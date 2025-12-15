import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FLOW_STORAGE_KEY, loadRetailFlow, RetailFlowState } from '../lib/retailFlow';
import { buildQuoteReference } from '../lib/quoteUtils';
import { buildAgreementReference } from '../lib/agreementHash';
import { shortenMiddle } from '../lib/displayUtils';
import { buildAgreementAuthorityMeta, buildQuoteAuthorityMeta, buildSicarAuthorityMeta, DocAuthorityMeta } from '../lib/docAuthority';
import { loadCertificate } from '../lib/sicar';

const UAT = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<RetailFlowState>({});
  const [quoteAuthority, setQuoteAuthority] = useState<DocAuthorityMeta | null>(null);
  const [agreementAuthority, setAgreementAuthority] = useState<DocAuthorityMeta | null>(null);
  const [sicarAuthority, setSicarAuthority] = useState<DocAuthorityMeta | null>(null);

  useEffect(() => {
    setState(loadRetailFlow());
  }, []);

  useEffect(() => {
    const run = async () => {
      if (state.quote) {
        const quoteMeta = await buildQuoteAuthorityMeta({ quote: state.quote });
        setQuoteAuthority(quoteMeta);
        const agreementMeta = await buildAgreementAuthorityMeta({
          quote: state.quote,
          agreementAcceptance: state.agreementAcceptance,
        });
        setAgreementAuthority(agreementMeta);
      } else {
        setQuoteAuthority(null);
        setAgreementAuthority(null);
      }

      const certificate = loadCertificate();
      if (
        certificate.quoteId ||
        certificate.agreementId ||
        certificate.acceptance ||
        certificate.devices.length > 0 ||
        certificate.installers.length > 0
      ) {
        const sicarMeta = await buildSicarAuthorityMeta(certificate);
        setSicarAuthority(sicarMeta);
      } else {
        setSicarAuthority(null);
      }
    };

    run();
  }, [state.agreementAcceptance, state.quote]);

  const stateJson = useMemo(() => JSON.stringify(state, null, 2), [state]);
  const quoteEmailPayload = useMemo(() => {
    if (!state.quote?.emailSubject || !state.quote.emailBody) return '';
    const emailTo = state.quote.emailTo ?? state.quote.contact ?? '';
    return `To: ${emailTo}\nSubject: ${state.quote.emailSubject}\n\n${state.quote.emailBody}`;
  }, [state.quote]);
  const agreementEmailPayload = useMemo(() => {
    if (!state.agreementAcceptance?.emailSubject || !state.agreementAcceptance.emailBody) return '';
    const emailTo = state.agreementAcceptance.emailTo ?? state.quote?.contact ?? '';
    return `To: ${emailTo}\nSubject: ${state.agreementAcceptance.emailSubject}\n\n${state.agreementAcceptance.emailBody}`;
  }, [state.agreementAcceptance?.emailBody, state.agreementAcceptance?.emailSubject, state.quote?.contact]);

  const resetFlow = () => {
    localStorage.removeItem(FLOW_STORAGE_KEY);
    window.location.reload();
  };

  const openPath = (path: string) => {
    window.open(path, '_blank', 'noopener');
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(stateJson);
  };

  const copyQuoteEmail = async () => {
    if (!quoteEmailPayload) return;
    await navigator.clipboard.writeText(quoteEmailPayload);
  };

  const copyAgreementEmail = async () => {
    if (!agreementEmailPayload) return;
    await navigator.clipboard.writeText(agreementEmailPayload);
  };

  const gateBadges = [
    { label: 'Quote present', active: Boolean(state.quote) },
    { label: 'Agreement accepted', active: Boolean(state.agreementAcceptance?.accepted) },
    { label: 'Deposit completed', active: state.payment?.depositStatus === 'completed' },
    { label: 'Schedule submitted', active: Boolean(state.scheduleRequest) },
  ];

  const quoteRef = state.quote ? buildQuoteReference(state.quote) : 'None';
  const agreementRef = state.quote ? buildAgreementReference(state.quote) : 'None';

  const printShortcuts = [
    { label: 'Go to Quote to print', path: '/quote' },
    { label: 'Go to Agreement to print', path: '/agreementReview' },
    { label: 'Go to Payment to print', path: '/payment' },
    { label: 'Go to Schedule to print', path: '/schedule' },
  ];

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem' }}>
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Internal UAT harness</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Retail flow test console</h1>
        <p style={{ margin: 0, color: '#e6ddc7' }}>
          Quickly jump between retail flow steps, reset local data, and inspect the local storage
          payload without hitting backend services.
        </p>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={resetFlow}>
            Reset Retail Flow
          </button>
          <button type="button" className="btn" onClick={() => openPath('/quote')}>
            Open Quote
          </button>
          <button type="button" className="btn" onClick={() => openPath('/agreementReview')}>
            Open Agreement
          </button>
          <button type="button" className="btn" onClick={() => openPath('/payment')}>
            Open Payment
          </button>
          <button type="button" className="btn" onClick={() => openPath('/schedule')}>
            Open Schedule
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {gateBadges.map((gate) => (
            <div
              key={gate.label}
              className="badge"
              style={{
                background: gate.active ? 'var(--kaec-green)' : 'var(--kaec-charcoal)',
                color: gate.active ? '#0c0b0b' : '#e6ddc7',
                border: gate.active ? '1px solid transparent' : '1px solid var(--kaec-sand)',
              }}
            >
              {gate.label}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className="badge">State viewer</div>
            <small style={{ color: '#c8c0aa' }}>LocalStorage key: {FLOW_STORAGE_KEY}</small>
          </div>
          <button type="button" className="btn" onClick={copyJson}>
            Copy JSON
          </button>
        </div>
        <pre
          style={{
            background: '#0f0f0f',
            color: '#e6ddc7',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid var(--kaec-ink)',
            margin: 0,
            overflowX: 'auto',
            minHeight: '180px',
          }}
        >
          {stateJson}
        </pre>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Email issuance (retail preview)</div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            <strong>Quote email</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              <li>
                <span />
                <span>Issued? {state.quote?.emailIssuedAt ? 'Yes' : 'No'}</span>
              </li>
              <li>
                <span />
                <span>Status: {state.quote?.emailStatus ?? 'not_sent'}</span>
              </li>
              <li>
                <span />
                <span>Email to: {state.quote?.emailTo ?? state.quote?.contact ?? 'n/a'}</span>
              </li>
              <li>
                <span />
                <span>Ref: {quoteRef}</span>
              </li>
            </ul>
            <button type="button" className="btn btn-secondary" onClick={copyQuoteEmail} disabled={!quoteEmailPayload}>
              Copy quote email payload
            </button>
          </div>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            <strong>Agreement email</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              <li>
                <span />
                <span>Accepted? {state.agreementAcceptance?.accepted ? 'Yes' : 'No'}</span>
              </li>
              <li>
                <span />
                <span>Email sent? {state.agreementAcceptance?.emailIssuedAt ? 'Yes' : 'No'}</span>
              </li>
              <li>
                <span />
                <span>Status: {state.agreementAcceptance?.emailStatus ?? 'not_sent'}</span>
              </li>
              <li>
                <span />
                <span>Email to: {state.agreementAcceptance?.emailTo ?? state.quote?.contact ?? 'n/a'}</span>
              </li>
              <li>
                <span />
                <span>Ref: {agreementRef}</span>
              </li>
              <li>
                <span />
                <span>Hash: {shortenMiddle(state.agreementAcceptance?.agreementHash)}</span>
              </li>
            </ul>
            <button type="button" className="btn btn-secondary" onClick={copyAgreementEmail} disabled={!agreementEmailPayload}>
              Copy agreement email payload
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Verification quick links</div>
        <small style={{ color: '#c8c0aa' }}>
          Jump to verification endpoints using the locally stored tokens for quote, agreement, and SICAR if available.
        </small>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {[{ label: 'Verify Quote', meta: quoteAuthority }, { label: 'Verify Agreement', meta: agreementAuthority }, { label: 'Verify SICAR', meta: sicarAuthority }].map(
            (tile) => (
              <div key={tile.label} className="card" style={{ border: '1px solid var(--kaec-ink)', display: 'grid', gap: '0.35rem' }}>
                <strong>{tile.label}</strong>
                <ul className="list" style={{ marginTop: '0.35rem' }}>
                  <li>
                    <span />
                    <span>Ref: {tile.meta?.reference ?? 'No token'}</span>
                  </li>
                  <li>
                    <span />
                    <span>Hash: {shortenMiddle(tile.meta?.hashShort)}</span>
                  </li>
                  <li>
                    <span />
                    <span>Issued: {tile.meta?.issuedAtISO ?? 'n/a'}</span>
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => tile.meta && openPath(tile.meta.verificationUrl)}
                  disabled={!tile.meta}
                >
                  {tile.meta ? 'Open verification' : 'No token'}
                </button>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Print shortcuts</div>
        <small style={{ color: '#c8c0aa' }}>
          Navigate to the desired step and use your browser&rsquo;s print or save-as-PDF to capture the
          current screen.
        </small>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {printShortcuts.map((shortcut) => (
            <button
              key={shortcut.path}
              type="button"
              className="btn"
              onClick={() => navigate(shortcut.path)}
            >
              {shortcut.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UAT;
