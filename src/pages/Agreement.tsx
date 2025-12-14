import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateAgreement, QuoteContext } from '../lib/agreement';

const Agreement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationQuote = (location.state as { quoteContext?: QuoteContext } | undefined)?.quoteContext;
  const redirectMessage = (location.state as { message?: string } | undefined)?.message;
  const [quoteContext, setQuoteContext] = useState<QuoteContext | null>(null);
  const [acceptChecked, setAcceptChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [acceptanceDate, setAcceptanceDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (locationQuote) {
      setQuoteContext(locationQuote);
      localStorage.setItem('kaec-quote-context', JSON.stringify(locationQuote));
      return;
    }

    const stored = localStorage.getItem('kaec-quote-context');
    if (stored) {
      setQuoteContext(JSON.parse(stored));
    }
  }, [locationQuote]);

  const agreement = useMemo(() => generateAgreement(quoteContext ?? undefined), [quoteContext]);

  const handlePrint = () => {
    window.print();
  };

  const persistAcceptance = () => {
    localStorage.setItem(
      'kaec-agreement-acceptance',
      JSON.stringify({ accepted: true, fullName, acceptanceDate, recordedAt: new Date().toISOString() })
    );
  };

  const handleProceed = () => {
    persistAcceptance();
    navigate('/esign', { state: { quoteContext, fullName, acceptanceDate } });
  };

  const handleProceedToPayment = () => {
    persistAcceptance();
    navigate('/payment', { state: { quoteContext } });
  };

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '2rem' }}>
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
              Agreement Version: {agreement.header.version} — {agreement.header.generatedDate}
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
