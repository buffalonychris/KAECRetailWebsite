import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOns, packagePricing } from '../data/pricing';
import { generateNarrative, NarrativeResponse } from '../lib/narrative';
import { QuoteContext } from '../lib/agreement';
import { loadRetailFlow, updateRetailFlow } from '../lib/retailFlow';
import { getHardwareList } from '../data/hardware';
import { getFeatureCategories } from '../data/features';

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const formatDate = (isoDate?: string) => {
  const date = isoDate ? new Date(isoDate) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const quoteReference = (quote: QuoteContext) => `KAEC-${quote.packageId}-${formatDate(quote.generatedAt).replace(/-/g, '')}`;

const whatsIncluded = [
  '1-day installation crew of 2',
  'Onsite setup and configuration',
  'Essential customer training',
  'Complete test (certified) of all equipment post install',
  '1-year replacement warranty for all equipment',
];

const assumptions = [
  'Pricing is one-time for listed equipment, configuration, and training.',
  'Existing Wi-Fi and power outlets are available where devices are installed.',
  'Local-first design keeps automations running during internet outages when power is available.',
];

const exclusions = [
  'No monthly monitoring fees are included or required.',
  'Permitting, structural work, and trenching are out of scope.',
  'Cellular data plans are only added if explicitly selected and available in-market.',
];

const QuoteReview = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteContext | null>(null);
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const hardwareList = useMemo(() => (quote ? getHardwareList(quote.packageId, quote.selectedAddOns) : []), [quote]);
  const featureCategories = useMemo(
    () => (quote ? getFeatureCategories(quote.packageId, quote.selectedAddOns) : []),
    [quote]
  );

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

  const handlePrint = () => {
    if (!quote) return;
    updateRetailFlow({ quote });
    navigate('/quotePrint', { state: { autoPrint: true } });
  };

  const quoteDate = quote ? formatDate(quote.generatedAt) : formatDate();
  const customerName = quote?.customerName?.trim() || 'Customer';
  const addOnSummary =
    selectedAddOns.length === 0
      ? 'None'
      : selectedAddOns.map((item) => `${item.label} (${formatCurrency(item.price)})`).join(', ');

  const emailSubject = `KickAss Elder Care Quote – ${customerName} – ${quoteDate}`;
  const emailBodyText = `Hi ${customerName},\n\nHere’s your deterministic KickAss Elder Care quote generated on ${quoteDate}.\nTier: ${selectedPackage.name}\nTotal: ${formatCurrency(quote?.pricing.total ?? selectedPackage.basePrice)}\nAdd-ons: ${addOnSummary}\nHome: ${quote?.homeType || 'Not provided'} / ${quote?.homeSize || 'Not provided'} / Internet: ${
    quote?.internetReliability || 'Not provided'
  }\nCity: ${quote?.city || 'Not provided'}\n\nReview or adjust at ${window.location.origin}/quote.\n\nThank you,\nKickAss Elder Care`;

  const handleEmailQuote = () => {
    if (!quote) return;
    const recipient = quote.contact && quote.contact.includes('@') ? quote.contact : '';
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyText)}`;
    window.location.href = mailto;
  };

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(emailBodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const reference = quoteReference(quote);

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '2rem' }}>
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="badge">Quote generated</div>
            <h1 style={{ margin: '0.25rem 0', color: '#fff7e6' }}>Quote ready for review</h1>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Confirm details, save a clean copy, email it to caregivers, or continue to agreement.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleContinueToAgreement}>
              Continue to Agreement
            </button>
            <button type="button" className="btn btn-secondary" onClick={handlePrint}>
              Print / Save Quote
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleEmailQuote}>
              Email Quote
            </button>
          </div>
        </div>
        <div>
          <strong>Checklist</strong>
          <ul className="list" style={{ marginTop: '0.35rem' }}>
            <li>
              <span />
              <span>Confirm property and contact details are correct.</span>
            </li>
            <li>
              <span />
              <span>Print or save the professional quote PDF.</span>
            </li>
            <li>
              <span />
              <span>Email the summary to caregivers.</span>
            </li>
            <li>
              <span />
              <span>Continue to Agreement to finalize.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge">Quote reference</div>
            <h2 style={{ margin: '0.35rem 0' }}>{selectedPackage.name}</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>Ref: {reference} • Date: {quoteDate}</p>
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
            Home type: {quote.homeType?.replace('-', ' ') || 'Not provided'} • Size: {quote.homeSize || 'Not provided'} • Internet
            reliability: {quote.internetReliability || 'Not provided'}
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
            Email Quote
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCopyEmail}>
            {copied ? 'Copied email text' : 'Copy email text'}
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
        <div className="badge">What’s included</div>
        <ul className="list" style={{ marginTop: '0.35rem' }}>
          {whatsIncluded.map((item) => (
            <li key={item}>
              <span />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Hardware (deterministic)</div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {hardwareList.map((category) => (
            <div key={category.title} className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
              <strong>{category.title}</strong>
              <ul className="list" style={{ marginTop: '0.35rem' }}>
                {category.items.map((item) => (
                  <li key={item.name}>
                    <span />
                    <span>
                      {item.name} — qty {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Feature coverage</div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {featureCategories.map((category) => (
            <div key={category.title} className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
              <strong>{category.title}</strong>
              <ul className="list" style={{ marginTop: '0.35rem' }}>
                {category.items.map((item) => (
                  <li key={item}>
                    <span />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.35rem' }}>
        <strong>Assumptions</strong>
        <ul className="list" style={{ marginTop: 0 }}>
          {assumptions.map((item) => (
            <li key={item}>
              <span />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.35rem' }}>
        <strong>Exclusions</strong>
        <ul className="list" style={{ marginTop: 0 }}>
          {exclusions.map((item) => (
            <li key={item}>
              <span />
              <span>{item}</span>
            </li>
          ))}
        </ul>
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
