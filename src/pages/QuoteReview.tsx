import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOns, packagePricing } from '../data/pricing';
import { generateNarrative, NarrativeResponse } from '../lib/narrative';
import { QuoteContext } from '../lib/agreement';
import { loadRetailFlow, updateRetailFlow } from '../lib/retailFlow';

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const QuoteReview = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteContext | null>(null);
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  useEffect(() => {
    const stored = loadRetailFlow();
    if (stored.quote) {
      setQuote(stored.quote);
    }
  }, []);

  const selectedPackage = useMemo(
    () => packagePricing.find((pkg) => pkg.id === quote?.packageId) ?? packagePricing[0],
    [quote]
  );

  const selectedAddOns = useMemo(
    () => addOns.filter((addOn) => quote?.selectedAddOns.includes(addOn.id)),
    [quote]
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExplainQuote = async () => {
    if (!quote) return;
    setNarrativeLoading(true);
    const result = await generateNarrative({
      source: 'quote',
      quoteContext: {
        packageId: quote.packageId,
        selectedAddOnIds: quote.selectedAddOns,
        propertyDetails: {
          homeType: quote.homeType,
          homeSize: quote.homeSize,
          internetReliability: quote.internetReliability,
          city: quote.city,
        },
        pricing: quote.pricing,
      },
    });
    setNarrative(result);
    setNarrativeLoading(false);
  };

  const handleContinueToAgreement = () => {
    if (!quote) return;
    updateRetailFlow({ quote });
    navigate('/agreement', { state: { quoteContext: quote } });
  };

  const handleEmailQuote = () => {
    if (!quote) return;
    const recipient = quote.contact && quote.contact.includes('@') ? quote.contact : '';
    const mailtoBody = encodeURIComponent(
      `Tier: ${selectedPackage.name}\nTotal: ${formatCurrency(quote.pricing.total)}\nAdd-ons: ${
        selectedAddOns.length ? selectedAddOns.map((item) => item.label).join(', ') : 'None'
      }\nCity: ${quote.city || 'Not provided'}\nReturn to quote: ${window.location.origin}/quote`
    );
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(
      'KickAss Elder Care Quote'
    )}&body=${mailtoBody}`;
    window.location.href = mailto;
  };

  if (!quote) {
    return (
      <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem' }}>
        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Quote review</div>
          <h1 style={{ margin: 0, color: '#fff7e6' }}>No stored quote found</h1>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Build a deterministic quote first, then return here to review and continue to the agreement.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/quote')}>
            Back to quote builder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '2rem' }}>
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="badge">Step 1</div>
            <h1 style={{ margin: '0.25rem 0', color: '#fff7e6' }}>Quote review</h1>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Confirm your deterministic quote before proceeding to the agreement and payment steps.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            Print / Save PDF
          </button>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Quote reference</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>Tier: {selectedPackage.name}</span>
            </li>
            <li>
              <span />
              <span>One-time total: {formatCurrency(quote.pricing.total)}</span>
            </li>
            <li>
              <span />
              <span>
                Add-ons: {selectedAddOns.length ? selectedAddOns.map((item) => item.label).join(', ') : 'None selected'}
              </span>
            </li>
            {(quote.customerName || quote.contact || quote.city) && (
              <li>
                <span />
                <span>
                  {quote.customerName && <span>Contact: {quote.customerName}. </span>}
                  {quote.contact && <span>Reach: {quote.contact}. </span>}
                  {quote.city && <span>City: {quote.city}. </span>}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div className="badge">Quote summary</div>
            <h2 style={{ margin: '0.35rem 0' }}>{selectedPackage.name}</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>{selectedPackage.summary}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#c8c0aa', fontSize: '0.95rem' }}>One-time estimate</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--kaec-gold)' }}>
              {formatCurrency(quote.pricing.total)}
            </div>
            <small style={{ color: '#c8c0aa' }}>No monthly subscriptions required.</small>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.25rem', color: '#e6ddc7' }}>
          <strong>Property context</strong>
          <small>
            Home type: {quote.homeType?.replace('-', ' ') || 'Not provided'} • Size: {quote.homeSize || 'Not provided'} •
            Internet reliability: {quote.internetReliability || 'Not provided'}
          </small>
          {(quote.customerName || quote.contact || quote.city) && (
            <small>
              {quote.customerName && <span>Contact: {quote.customerName}. </span>}
              {quote.contact && <span>Reach: {quote.contact}. </span>}
              {quote.city && <span>City: {quote.city}.</span>}
            </small>
          )}
        </div>

        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Included in selection</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>
                Package: {selectedPackage.name} ({formatCurrency(selectedPackage.basePrice)})
              </span>
            </li>
            {selectedAddOns.length === 0 && (
              <li>
                <span />
                <span>No add-ons selected.</span>
              </li>
            )}
            {selectedAddOns.map((addOn) => (
              <li key={addOn.id}>
                <span />
                <span>
                  {addOn.label} ({formatCurrency(addOn.price)})
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={handleContinueToAgreement}>
            Continue to Agreement
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleExplainQuote}>
            Explain this quote
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleEmailQuote}>
            Email quote
          </button>
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            Print / Save Quote
          </button>
          <small style={{ color: '#c8c0aa' }}>
            Advisory narrative only; if there is an urgent safety issue, call 911.
          </small>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div>
          <div className="badge">AI Explanation (Advisory)</div>
          <h3 style={{ margin: '0.25rem 0', color: '#fff7e6' }}>Deterministic narrative</h3>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Explains why this package and add-ons fit, what offline behavior to expect, and the next best step. No medical advice;
            if there is an urgent safety issue, call 911.
          </p>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {(narrativeLoading || !narrative) && (
            <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
              <strong>{narrativeLoading ? 'Building explanation…' : 'Click “Explain this quote” to view the narrative.'}</strong>
              <small style={{ color: '#c8c0aa' }}>
                Deterministic templates are used by default; no external AI is required.
              </small>
            </div>
          )}
          {narrative?.sections.map((section) => (
            <div
              key={section.title}
              className="card"
              style={{ display: 'grid', gap: '0.4rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}
            >
              <strong>{section.title}</strong>
              <p style={{ margin: 0, color: '#c8c0aa' }}>{section.body}</p>
            </div>
          ))}
        </div>
        <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
          <strong>Disclaimers</strong>
          <ul className="list" style={{ marginTop: '0.35rem' }}>
            {(narrative?.disclaimer ?? [
              'Informational only. Not medical advice or a diagnosis.',
              'If you have an urgent safety concern, call 911.',
              'Final configuration depends on on-site conditions and local code.',
            ]).map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuoteReview;
