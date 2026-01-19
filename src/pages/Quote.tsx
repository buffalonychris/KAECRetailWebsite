import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateNarrative, NarrativeResponse } from '../lib/narrative';
import { addOns, packagePricing, PackageTierId } from '../data/pricing';
import { brandSite } from '../lib/brand';
import TierBadge from '../components/TierBadge';
import { QuoteContext } from '../lib/agreement';
import { loadRetailFlow, markFlowStep, updateRetailFlow } from '../lib/retailFlow';
import { computeQuoteHash } from '../lib/quoteHash';
import { siteConfig } from '../config/site';

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const Quote = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const [homeType, setHomeType] = useState('single-family');
  const [homeSize, setHomeSize] = useState('medium');
  const [reliability, setReliability] = useState('good');
  const [packageId, setPackageId] = useState<PackageTierId>('A2');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  useEffect(() => {
    markFlowStep('quote');
  }, []);

  useEffect(() => {
    const tierParam = searchParams.get('tier');
    if (!tierParam) return;
    const match = packagePricing.find((pkg) => pkg.id === tierParam);
    if (match) setPackageId(match.id);
  }, [searchParams]);

  const selectedPackage = useMemo(
    () => packagePricing.find((pkg) => pkg.id === packageId) ?? packagePricing[0],
    [packageId]
  );

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addOnTotal = useMemo(() => {
    return addOns
      .filter((addOn) => selectedAddOns.includes(addOn.id))
      .reduce((sum, addOn) => sum + addOn.price, 0);
  }, [selectedAddOns]);

  const addOnGroups = useMemo(() => {
    return addOns.reduce<Record<'Low' | 'Mid' | 'High', typeof addOns>>(
      (groups, addOn) => {
        groups[addOn.tier].push(addOn);
        return groups;
      },
      { Low: [], Mid: [], High: [] },
    );
  }, []);

  const total = selectedPackage.basePrice + addOnTotal;

  const persistQuote = async () => {
    const existing = loadRetailFlow();
    const previousQuote = existing.quote;
    const payload: QuoteContext = {
      customerName,
      contact,
      issuedAt: previousQuote?.issuedAt,
      emailIssuedAt: previousQuote?.emailIssuedAt,
      emailIssuedAtISO: previousQuote?.emailIssuedAtISO,
      emailTo: previousQuote?.emailTo,
      emailSubject: previousQuote?.emailSubject,
      emailBody: previousQuote?.emailBody,
      emailStatus: previousQuote?.emailStatus ?? 'not_sent',
      emailProvider: previousQuote?.emailProvider,
      emailMessageId: previousQuote?.emailMessageId,
      emailRecipients: previousQuote?.emailRecipients,
      emailLastStatus: previousQuote?.emailLastStatus,
      emailLastError: previousQuote?.emailLastError,
      city,
      homeType,
      homeSize,
      internetReliability: reliability,
      packageId,
      selectedAddOns,
      pricing: {
        packagePrice: selectedPackage.basePrice,
        addOnTotal,
        total,
      },
      quoteDocVersion: siteConfig.quoteDocVersion,
      quoteHashAlgorithm: siteConfig.quoteHashAlgorithm,
    };
    const enrichedQuote: QuoteContext = { ...payload, generatedAt: new Date().toISOString() };
    const previousHash = existing.quote?.quoteHash;
    const quoteWithPrior = previousHash ? { ...enrichedQuote, priorQuoteHash: previousHash } : enrichedQuote;
    const quoteHash = await computeQuoteHash(quoteWithPrior);
    const nextQuote = { ...quoteWithPrior, quoteHash };
    updateRetailFlow({ quote: nextQuote });
    return nextQuote;
  };

  const generateQuote = async () => {
    await persistQuote();
    navigate('/quoteReview');
  };

  const printQuote = async () => {
    const saved = await persistQuote();
    updateRetailFlow({ quote: saved });
    navigate('/quotePrint', { state: { autoPrint: true } });
  };

  const explainQuote = async () => {
    setNarrativeLoading(true);
    const result = await generateNarrative({
      source: 'quote',
      quoteContext: {
        packageId,
        selectedAddOnIds: selectedAddOns,
        propertyDetails: {
          homeType,
          homeSize,
          internetReliability: reliability,
          city,
        },
        pricing: {
          packagePrice: selectedPackage.basePrice,
          addOnTotal,
          total,
        },
      },
    });
    setNarrative(result);
    setNarrativeLoading(false);
  };

  const handleCopyExplanation = async () => {
    if (!narrative) return;
    const text = `${narrative.sections
      .map((section) => `${section.title}: ${section.body}`)
      .join('\n')}\nDisclaimer: ${narrative.disclaimer.join(' ')}`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '2rem' }}>
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Deterministic quote</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Build a {brandSite} quote</h1>
        <p style={{ margin: 0, color: '#e6ddc7' }}>
          Capture the basics, pick a package, and see an upfront one-time estimate. Pricing uses a
          fixed table—no AI, no monthly subscriptions required.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={generateQuote}
            disabled={!packageId}
          >
            Generate Quote
          </button>
          <button type="button" className="btn btn-secondary" onClick={printQuote}>
            Print / Save PDF
          </button>
          <small style={{ color: '#c8c0aa' }}>
            Direct navigation safe: /quote works online or offline cache.
          </small>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Customer basics</div>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span>Customer name (optional)</span>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Jane Caregiver"
                style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
              />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span>Email or phone (optional)</span>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="care@kickassfamily.com"
                style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
              />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span>City (optional)</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Oakland, CA"
                style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
              />
            </label>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Home type</span>
            <select
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
            >
              <option value="single-family">Single family</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Home size</span>
            <select
              value={homeSize}
              onChange={(e) => setHomeSize(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Internet reliability</span>
            <select
              value={reliability}
              onChange={(e) => setReliability(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
            >
              <option value="good">Good</option>
              <option value="spotty">Spotty</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <div className="badge">Package selection</div>
            <p style={{ margin: '0.35rem 0', color: '#c8c0aa' }}>
              Deterministic pricing pulls from the table below. Pick a tier and any add-ons to tune
              the scope.
            </p>
          </div>
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {packagePricing.map((pkg) => {
              const isSelected = pkg.id === packageId;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setPackageId(pkg.id)}
                  style={{
                    display: 'grid',
                    gap: '0.35rem',
                    textAlign: 'left',
                    borderRadius: '14px',
                    border: isSelected ? '1px solid var(--kaec-gold)' : '1px solid rgba(245, 192, 66, 0.25)',
                    background: isSelected ? 'rgba(245, 192, 66, 0.12)' : 'rgba(255,255,255,0.02)',
                    padding: '1rem',
                    cursor: 'pointer',
                    color: '#fff7e6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong>{pkg.name}</strong>
                    <span style={{ color: 'var(--kaec-gold)', fontWeight: 700 }}>{formatCurrency(pkg.basePrice)}</span>
                  </div>
                  <small style={{ color: '#c8c0aa' }}>{pkg.summary}</small>
                  <span style={{ fontSize: '0.9rem', color: '#c8c0aa' }}>One-time price</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Optional add-ons</div>
          {(['Low', 'Mid', 'High'] as const).map((tier) => (
            <div key={tier} style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <strong style={{ color: '#fff7e6' }}>{tier} investment</strong>
                <small style={{ color: '#c8c0aa' }}>
                  {tier === 'Low' && 'Easy wins to tighten entry coverage.'}
                  {tier === 'Mid' && 'Balanced upgrades for broader visibility.'}
                  {tier === 'High' && 'High-tech resilience for wide footprints.'}
                </small>
              </div>
              <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                {addOnGroups[tier].map((addOn) => {
                  const checked = selectedAddOns.includes(addOn.id);
                  return (
                    <label
                      key={addOn.id}
                      style={{
                        display: 'grid',
                        gap: '0.35rem',
                        padding: '1rem',
                        borderRadius: '14px',
                        border: checked ? '1px solid var(--kaec-gold)' : '1px solid rgba(245, 192, 66, 0.25)',
                        background: checked ? 'rgba(245, 192, 66, 0.12)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddOn(addOn.id)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <div>
                          <strong>{addOn.label}</strong>
                          <div style={{ color: 'var(--kaec-gold)', fontWeight: 700 }}>{formatCurrency(addOn.price)}</div>
                        </div>
                      </div>
                      <small style={{ color: '#c8c0aa' }}>{addOn.description}</small>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div className="badge">Quote summary</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <TierBadge tierId={selectedPackage.id} />
              <h2 style={{ margin: '0.35rem 0' }}>{selectedPackage.name}</h2>
            </div>
            <p style={{ margin: 0, color: '#c8c0aa' }}>{selectedPackage.summary}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#c8c0aa', fontSize: '0.95rem' }}>One-time estimate</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--kaec-gold)' }}>{formatCurrency(total)}</div>
            <small style={{ color: '#c8c0aa' }}>No monthly subscriptions required.</small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={generateQuote} disabled={!packageId}>
            Generate Quote
          </button>
          <button type="button" className="btn btn-secondary" onClick={explainQuote}>
            Explain this quote
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopyExplanation}
            disabled={!narrative}
          >
            Copy explanation
          </button>
          <small style={{ color: '#c8c0aa' }}>
            Advisory narrative only; call 911 for emergencies.
          </small>
        </div>

        <div style={{ display: 'grid', gap: '0.25rem', color: '#e6ddc7' }}>
          <strong>Property context</strong>
          <small>
            Home type: {homeType.replace('-', ' ')} • Size: {homeSize} • Internet reliability: {reliability}
          </small>
          {(customerName || contact || city) && (
            <small>
              {customerName && <span>Contact: {customerName}. </span>}
              {contact && <span>Reach: {contact}. </span>}
              {city && <span>City: {city}.</span>}
            </small>
          )}
        </div>

        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Included in selection</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>
                Package: <TierBadge tierId={selectedPackage.id} className="inline-badge" /> {selectedPackage.name} ({formatCurrency(selectedPackage.basePrice)})
              </span>
            </li>
            {selectedAddOns.length === 0 && (
              <li>
                <span />
                <span>No add-ons selected.</span>
              </li>
            )}
            {selectedAddOns.map((id) => {
              const addOn = addOns.find((item) => item.id === id);
              if (!addOn) return null;
              return (
                <li key={addOn.id}>
                  <span />
                  <span>
                    {addOn.label} ({formatCurrency(addOn.price)})
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Assumptions</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>Pricing is one-time for listed equipment, configuration, and training.</span>
            </li>
            <li>
              <span />
              <span>Existing Wi-Fi and power outlets are available where devices are installed.</span>
            </li>
            <li>
              <span />
              <span>Local-first design keeps automations running during internet outages when power is available.</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Exclusions</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>No monthly monitoring fees are included or required.</span>
            </li>
            <li>
              <span />
              <span>Permitting, structural work, and trenching are out of scope.</span>
            </li>
            <li>
              <span />
              <span>Cellular data plans are only added if explicitly selected and available in-market.</span>
            </li>
          </ul>
        </div>

        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <div className="badge">AI Explanation (Advisory)</div>
            <h3 style={{ margin: '0.25rem 0', color: '#fff7e6' }}>Deterministic narrative</h3>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Explains why this package and add-ons fit, what offline behavior to expect, and the next best step. No medical
              advice; if there is an urgent safety issue, call 911.
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
    </div>
  );
};

export default Quote;
