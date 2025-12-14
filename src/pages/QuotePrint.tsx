import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOns, packagePricing } from '../data/pricing';
import { generateNarrative, NarrativeResponse } from '../lib/narrative';
import { QuoteContext } from '../lib/agreement';
import { loadRetailFlow } from '../lib/retailFlow';
import { getHardwareList, HardwareCategory } from '../data/hardware';
import { FeatureCategory, getFeatureCategories } from '../data/features';
import { buildQuoteReference, formatQuoteDate } from '../lib/quoteUtils';
import { quoteAssumptions, quoteDeliverables, quoteExclusions } from '../lib/quoteHash';
import { siteConfig } from '../config/site';

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const QuotePrint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quote, setQuote] = useState<QuoteContext | null>(null);
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = loadRetailFlow();
    if (stored.quote) {
      setQuote(stored.quote);
    }
  }, []);

  const selectedPackage = useMemo(
    () => (quote ? packagePricing.find((pkg) => pkg.id === quote.packageId) ?? packagePricing[0] : packagePricing[0]),
    [quote]
  );

  const selectedAddOns = useMemo(() => addOns.filter((addOn) => quote?.selectedAddOns.includes(addOn.id)), [quote]);

  const hardwareList: HardwareCategory[] = useMemo(
    () => (quote ? getHardwareList(quote.packageId, quote.selectedAddOns) : []),
    [quote]
  );

  const featureCategories: FeatureCategory[] = useMemo(
    () => (quote ? getFeatureCategories(quote.packageId, quote.selectedAddOns) : []),
    [quote]
  );

  useEffect(() => {
    if (!quote) return;
    const fetchNarrative = async () => {
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
    };

    fetchNarrative();
  }, [quote]);

  useEffect(() => {
    if (!quote) return;
    const originalTitle = document.title;
    const name = quote.customerName?.trim() || 'Customer';
    const date = formatQuoteDate(quote.generatedAt);
    const shouldAutoPrint = (location.state as { autoPrint?: boolean } | null)?.autoPrint ?? true;
    if (!shouldAutoPrint) return undefined;

    const timer = setTimeout(() => {
      document.title = `ElderCare Quote From KAEC ${date} for ${name}`;
      window.print();
      document.title = originalTitle;
    }, 600);

    return () => {
      clearTimeout(timer);
      document.title = originalTitle;
    };
  }, [location.state, quote]);

  if (!quote) {
    return (
      <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem' }}>
        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Quote print</div>
          <h1 style={{ margin: 0, color: '#fff7e6' }}>No stored quote found</h1>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Build a deterministic quote first, then return here to print a professional copy.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/quote')}>
            Back to quote builder
          </button>
        </div>
      </div>
    );
  }

  const reference = buildQuoteReference(quote);
  const quoteDate = formatQuoteDate(quote.generatedAt);
  const customerName = quote.customerName?.trim() || 'Customer';
  const quoteVersion = quote.quoteDocVersion ?? siteConfig.quoteDocVersion;
  const displayedHash = quote.quoteHash ?? 'Pending';
  const supersedes = quote.priorQuoteHash ?? 'None';

  return (
    <div className="print-page" style={{ padding: '3rem 0' }}>
      <div className="print-document kaec-doc" role="document">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem' }}>KickAss Elder Care (KAEC)</div>
            <div style={{ fontSize: '0.95rem', color: '#333' }}>Local-first safety, security, and monitoring.</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.95rem' }}>
            <div>Date: {quoteDate}</div>
            <div>Quote Ref: {reference}</div>
            <div>Quote Version: {quoteVersion}</div>
            <div>Quote Hash: {displayedHash}</div>
          </div>
        </header>

        <div style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#222' }}>
          <div>Supersedes prior quote hash: {supersedes}</div>
          <div>This quote supersedes all prior quotes for the same customer/property context.</div>
        </div>

        <section className="print-section" style={{ marginTop: '1.5rem' }}>
          <h2>Customer & Property</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            <div>
              <strong>Name</strong>
              <div>{customerName}</div>
            </div>
            <div>
              <strong>Contact</strong>
              <div>{quote.contact || 'Not provided'}</div>
            </div>
            <div>
              <strong>City</strong>
              <div>{quote.city || 'Not provided'}</div>
            </div>
            <div>
              <strong>Home</strong>
              <div>
                {quote.homeType?.replace('-', ' ') || 'Not provided'} • {quote.homeSize || 'Not provided'} • Internet:{' '}
                {quote.internetReliability || 'Not provided'}
              </div>
            </div>
          </div>
        </section>

        <section className="print-section" style={{ marginTop: '1.25rem' }}>
          <h2>Selection</h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              border: '1px solid #d9d9d9',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{selectedPackage.name}</div>
              <div style={{ color: '#444' }}>{selectedPackage.summary}</div>
              <div style={{ marginTop: '0.35rem' }}>
                <strong>Package:</strong> {formatCurrency(selectedPackage.basePrice)}
              </div>
              <div style={{ marginTop: '0.35rem' }}>
                <strong>Add-ons:</strong>{' '}
                {selectedAddOns.length === 0
                  ? 'None'
                  : selectedAddOns.map((addOn) => `${addOn.label} (${formatCurrency(addOn.price)})`).join(', ')}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#444' }}>One-time total</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatCurrency(quote.pricing.total)}</div>
              <div style={{ color: '#444' }}>No monthly subscriptions required.</div>
            </div>
          </div>
        </section>

        <section className="print-section" style={{ marginTop: '1.25rem' }}>
          <h2>What’s Included</h2>
          <ul className="print-list">
            {quoteDeliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="print-section" style={{ marginTop: '1.25rem' }}>
          <h2>Hardware (deterministic)</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {hardwareList.map((category) => (
              <div key={category.title} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '0.85rem' }}>
                <strong>{category.title}</strong>
                <ul className="print-list" style={{ marginTop: '0.35rem' }}>
                  {category.items.map((item) => (
                    <li key={item.name}>
                      {item.name} — qty {item.quantity}
                      {item.note ? ` (${item.note})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="print-section" style={{ marginTop: '1.25rem' }}>
          <h2>Feature coverage</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {featureCategories.map((category) => (
              <div key={category.title} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '0.85rem' }}>
                <strong>{category.title}</strong>
                <ul className="print-list" style={{ marginTop: '0.35rem' }}>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="print-section" style={{ marginTop: '1.25rem' }}>
          <h2>Assumptions & exclusions</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <strong>Assumptions</strong>
              <ul className="print-list" style={{ marginTop: '0.35rem' }}>
                {quoteAssumptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Exclusions</strong>
              <ul className="print-list" style={{ marginTop: '0.35rem' }}>
                {quoteExclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="print-section page-break" style={{ marginTop: '1.5rem' }}>
          <h2>Explanation & narrative</h2>
          <p style={{ color: '#444' }}>
            Deterministic narrative describing why this configuration fits and what to expect during outages and day-to-day use.
          </p>
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {(narrative?.sections ?? []).map((section) => (
              <div key={section.title}>
                <strong>{section.title}</strong>
                <p style={{ margin: '0.35rem 0', color: '#333' }}>{section.body}</p>
              </div>
            ))}
            {!narrative && <div style={{ color: '#555' }}>Narrative loading…</div>}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <strong>Disclaimers</strong>
            <ul className="print-list" style={{ marginTop: '0.35rem' }}>
              {(narrative?.disclaimer ?? [
                'Informational only. Not medical advice or a diagnosis.',
                'If you have an urgent safety concern, call 911.',
                'Final configuration depends on on-site conditions and local code.',
              ]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuotePrint;
