import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateAgreement, QuoteContext } from '../lib/agreement';
import { computeAgreementHash } from '../lib/agreementHash';
import { copyToClipboard, shortenMiddle } from '../lib/displayUtils';
import { loadRetailFlow, updateRetailFlow, AcceptanceRecord } from '../lib/retailFlow';
import { buildResumeUrl } from '../lib/resumeToken';
import { siteConfig } from '../config/site';

const Agreement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationQuote = (location.state as { quoteContext?: QuoteContext } | undefined)?.quoteContext;
  const redirectMessage = (location.state as { message?: string } | undefined)?.message;
  const [quoteContext, setQuoteContext] = useState<QuoteContext | null>(null);
  const [storedAcceptance, setStoredAcceptance] = useState<AcceptanceRecord | null>(null);
  const [acceptChecked, setAcceptChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [acceptanceDate, setAcceptanceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [agreementHash, setAgreementHash] = useState('');
  const [hashCopied, setHashCopied] = useState(false);
  const [priorHashCopied, setPriorHashCopied] = useState(false);
  const [quoteHashCopied, setQuoteHashCopied] = useState(false);
  const [priorQuoteHashCopied, setPriorQuoteHashCopied] = useState(false);
  const [resumeCopied, setResumeCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (locationQuote) {
      setQuoteContext(locationQuote);
      updateRetailFlow({ quote: locationQuote });
    }

    const storedFlow = loadRetailFlow();
    if (storedFlow.quote) {
      setQuoteContext((current) => current ?? storedFlow.quote!);
    }
    if (storedFlow.agreementAcceptance) {
      setStoredAcceptance(storedFlow.agreementAcceptance);
      if (storedFlow.agreementAcceptance.fullName) {
        setFullName(storedFlow.agreementAcceptance.fullName);
      }
      if (storedFlow.agreementAcceptance.acceptanceDate) {
        setAcceptanceDate(storedFlow.agreementAcceptance.acceptanceDate);
      }
    }
  }, [locationQuote]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      const hash = await computeAgreementHash(quoteContext, { accepted: acceptChecked, fullName, acceptanceDate });
      if (isMounted) {
        setAgreementHash(hash);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [quoteContext, acceptChecked, fullName, acceptanceDate]);

  const agreement = useMemo(() => generateAgreement(quoteContext ?? undefined), [quoteContext]);

  const handlePrint = () => {
    navigate('/agreementPrint', { state: { autoPrint: true } });
  };

  const persistAcceptance = () => {
    const priorAgreementHash = storedAcceptance?.agreementHash;
    const nextAcceptance: AcceptanceRecord = {
      accepted: true,
      fullName,
      acceptanceDate,
      recordedAt: new Date().toISOString(),
      agreementVersion: siteConfig.agreementDocVersion,
      agreementHash,
      supersedesAgreementHash: priorAgreementHash ?? storedAcceptance?.supersedesAgreementHash,
    };
    setStoredAcceptance(nextAcceptance);
    updateRetailFlow({
      agreementAcceptance: nextAcceptance,
    });
  };

  const handleProceed = () => {
    persistAcceptance();
    navigate('/esign', { state: { quoteContext, fullName, acceptanceDate } });
  };

  const handleProceedToPayment = () => {
    persistAcceptance();
    navigate('/payment', { state: { quoteContext } });
  };

  const agreementVersion = siteConfig.agreementDocVersion;
  const agreementHashDisplay = shortenMiddle(agreementHash);
  const supersedesAgreement = shortenMiddle(storedAcceptance?.supersedesAgreementHash ?? storedAcceptance?.agreementHash);
  const quoteHashDisplay = shortenMiddle(agreement.quoteBinding.quoteHash);
  const priorQuoteHashDisplay = shortenMiddle(agreement.quoteBinding.priorQuoteHash);
  const resumeUrl = quoteContext ? buildResumeUrl(quoteContext, 'agreement') : '';

  const handleCopyHash = async () => {
    if (!agreementHash) return;
    await copyToClipboard(agreementHash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  const handleCopyPriorHash = async () => {
    const prior = storedAcceptance?.supersedesAgreementHash ?? storedAcceptance?.agreementHash;
    if (!prior) return;
    await copyToClipboard(prior);
    setPriorHashCopied(true);
    setTimeout(() => setPriorHashCopied(false), 2000);
  };

  const handleCopyQuoteHash = async () => {
    if (!agreement.quoteBinding.quoteHash) return;
    await copyToClipboard(agreement.quoteBinding.quoteHash);
    setQuoteHashCopied(true);
    setTimeout(() => setQuoteHashCopied(false), 2000);
  };

  const handleCopyPriorQuoteHash = async () => {
    if (!agreement.quoteBinding.priorQuoteHash) return;
    await copyToClipboard(agreement.quoteBinding.priorQuoteHash);
    setPriorQuoteHashCopied(true);
    setTimeout(() => setPriorQuoteHashCopied(false), 2000);
  };

  const handleCopyResume = async () => {
    if (!resumeUrl) return;
    await copyToClipboard(resumeUrl);
    setResumeCopied(true);
    setTimeout(() => setResumeCopied(false), 2000);
  };

  return (
    <div className="container kaec-doc" style={{ padding: '3rem 0', display: 'grid', gap: '2rem' }}>
      {redirectMessage && (
        <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)', color: '#c8c0aa' }}>
          {redirectMessage}
        </div>
      )}
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="badge">Combined agreement</div>
            <h1 style={{ margin: '0.25rem 0', color: '#fff7e6' }}>{agreement.header.title}</h1>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Statement of Work + Terms & Conditions generated directly from your deterministic quote.
            </p>
            <small style={{ color: '#c8c0aa' }}>
              Agreement Version: {agreementVersion} — {agreement.header.generatedDate}
            </small>
          </div>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            Print / Save PDF
          </button>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Customer context</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            {agreement.customerSummary.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Quote reference</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>Tier: {agreement.quoteSummary.packageName}</span>
            </li>
            <li>
              <span />
              <span>Add-ons: {agreement.quoteSummary.addOnLabels.join(', ')}</span>
            </li>
            <li>
              <span />
              <span>One-time total: {agreement.quoteSummary.total}</span>
            </li>
          </ul>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Quote binding</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>Quote Reference: {agreement.quoteBinding.reference}</span>
            </li>
            <li>
              <span />
              <span>Quote Version: {agreement.quoteBinding.quoteVersion}</span>
            </li>
            <li>
              <span />
              <span>
                Quote Hash: <span className="mono-text">{quoteHashDisplay}</span>{' '}
                {agreement.quoteBinding.quoteHash && (
                  <button type="button" className="btn btn-secondary" onClick={handleCopyQuoteHash}>
                    {quoteHashCopied ? 'Copied full hash' : 'Copy full hash'}
                  </button>
                )}
              </span>
            </li>
            <li>
              <span />
              <span>
                Supersedes prior quote hash: <span className="mono-text">{priorQuoteHashDisplay}</span>{' '}
                {agreement.quoteBinding.priorQuoteHash && (
                  <button type="button" className="btn btn-secondary" onClick={handleCopyPriorQuoteHash}>
                    {priorQuoteHashCopied ? 'Copied prior hash' : 'Copy prior hash'}
                  </button>
                )}
              </span>
            </li>
          </ul>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Agreement binding</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>Agreement Version: {agreementVersion}</span>
            </li>
            <li>
              <span />
              <span>
                Agreement Hash: <span className="mono-text">{agreementHashDisplay}</span>{' '}
                {agreementHash && (
                  <button type="button" className="btn btn-secondary" onClick={handleCopyHash}>
                    {hashCopied ? 'Copied full hash' : 'Copy full hash'}
                  </button>
                )}
              </span>
            </li>
            <li>
              <span />
              <span>
                Supersedes prior agreement hash: <span className="mono-text">{supersedesAgreement}</span>{' '}
                {supersedesAgreement !== 'None' && (
                  <button type="button" className="btn btn-secondary" onClick={handleCopyPriorHash}>
                    {priorHashCopied ? 'Copied prior hash' : 'Copy prior hash'}
                  </button>
                )}
              </span>
            </li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>
            This agreement supersedes all prior agreements for the same customer/property context.
          </small>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Continue your order</strong>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href={resumeUrl || '#'} style={{ fontWeight: 800 }}>
              Continue your order
            </a>
            <button type="button" className="btn btn-secondary" onClick={handleCopyResume} disabled={!resumeUrl}>
              {resumeCopied ? 'Copied resume link' : 'Copy resume link'}
            </button>
          </div>
          {resumeUrl && (
            <small className="break-all" style={{ color: '#c8c0aa' }}>
              {resumeUrl}
            </small>
          )}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <div className="badge">Statement of Work</div>
          <h2 style={{ margin: '0.25rem 0' }}>Scope & Deliverables</h2>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Based on your selections, the following items are included. No monthly subscriptions are required.
          </p>
        </div>
        <ul className="list" style={{ marginTop: 0 }}>
          {agreement.scope.map((item) => (
            <li key={item}>
              <span />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Assumptions & Exclusions</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            {agreement.assumptions.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
            {agreement.exclusions.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Offline behavior</strong>
          <p style={{ margin: 0, color: '#c8c0aa' }}>{agreement.offlineBehavior}</p>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Installation window</strong>
          <p style={{ margin: 0, color: '#c8c0aa' }}>{agreement.installationWindow}</p>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Warranty / service boundary placeholders</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            {agreement.warrantyPlaceholders.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Pricing note</strong>
          <p style={{ margin: 0, color: '#c8c0aa' }}>{agreement.noMonthlyStatement}</p>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <div className="badge">Terms & Conditions</div>
          <h2 style={{ margin: '0.25rem 0' }}>Version {agreement.termsVersion}</h2>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            These terms accompany the Statement of Work. They will be mirrored in the final e-sign package.
          </p>
        </div>
        <ul className="list" style={{ marginTop: 0 }}>
          {agreement.terms.map((item) => (
            <li key={item}>
              <span />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div>
          <div className="badge">Quote Appendix</div>
          <h2 style={{ margin: '0.25rem 0' }}>Binding summary</h2>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Appendix ties this Agreement to the deterministic quote: package, add-ons, totals, version, and hashes.
          </p>
        </div>
        <ul className="list" style={{ marginTop: 0 }}>
          <li>
            <span />
            <span>Package: {agreement.quoteAppendix.packageName}</span>
          </li>
          <li>
            <span />
            <span>Add-ons: {agreement.quoteAppendix.addOnLabels.join(', ')}</span>
          </li>
          <li>
            <span />
            <span>One-time total: {agreement.quoteBinding.total}</span>
          </li>
          <li>
            <span />
            <span>Quote version: {agreement.quoteBinding.quoteVersion}</span>
          </li>
          <li>
            <span />
            <span>Quote hash: {agreement.quoteBinding.quoteHash ?? 'Pending'}</span>
          </li>
          <li>
            <span />
            <span>Supersedes prior quote hash: {agreement.quoteBinding.priorQuoteHash ?? 'None'}</span>
          </li>
          {agreement.quoteAppendix.hardwareSummary.map((item) => (
            <li key={item}>
              <span />
              <span>{item}</span>
            </li>
          ))}
          {agreement.quoteAppendix.featureSummary.map((item) => (
            <li key={item}>
              <span />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div>
          <div className="badge">Acceptance</div>
          <h2 style={{ margin: '0.25rem 0' }}>Confirm review before e-signature</h2>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            E-signature will be completed through a secure KAEC backend link. Provide your name to continue.
          </p>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={acceptChecked}
            onChange={(e) => setAcceptChecked(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <span>I have reviewed and agree to the Combined Agreement</span>
        </label>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Typed full name</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full legal name"
              style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
            />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Date</span>
            <input
              type="date"
              value={acceptanceDate}
              onChange={(e) => setAcceptanceDate(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
            />
          </label>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleProceed}
          disabled={!acceptChecked || !fullName.trim()}
        >
          Proceed to E-Signature
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleProceedToPayment}
          disabled={!acceptChecked || !fullName.trim()}
        >
          Proceed to Payment
        </button>
        <small style={{ color: '#c8c0aa' }}>
          Agreement is not fully executed until e-signature is completed through the KAEC backend signing link.
        </small>
        <small style={{ color: '#c8c0aa' }}>
          Payment gate is retail-only and shows deterministic deposit and balance—no card is charged here.
        </small>
      </div>
    </div>
  );
};

export default Agreement;
