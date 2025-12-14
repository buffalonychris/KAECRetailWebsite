import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOns, packagePricing } from '../data/pricing';
import { getHardwareList } from '../data/hardware';
import { getFeatureCategories } from '../data/features';
import { generateAgreement, QuoteContext } from '../lib/agreement';
import { buildAgreementReference, computeAgreementHash } from '../lib/agreementHash';
import { copyToClipboard, shortenMiddle } from '../lib/displayUtils';
import { loadRetailFlow, updateRetailFlow, AcceptanceRecord } from '../lib/retailFlow';
import { buildResumeUrl } from '../lib/resumeToken';
import { siteConfig } from '../config/site';

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const AgreementReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationQuote = (location.state as { quoteContext?: QuoteContext } | undefined)?.quoteContext;
  const [quote, setQuote] = useState<QuoteContext | null>(null);
  const [agreementHash, setAgreementHash] = useState('');
  const [acceptChecked, setAcceptChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [acceptanceDate, setAcceptanceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [storedAcceptance, setStoredAcceptance] = useState<AcceptanceRecord | null>(null);
  const [bannerMessage, setBannerMessage] = useState('');
  const [hashCopied, setHashCopied] = useState(false);
  const [priorHashCopied, setPriorHashCopied] = useState(false);
  const [quoteHashCopied, setQuoteHashCopied] = useState(false);
  const [resumeCopied, setResumeCopied] = useState(false);
  const redirectMessage = (location.state as { message?: string } | undefined)?.message;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (locationQuote) {
      setQuote(locationQuote);
      updateRetailFlow({ quote: locationQuote });
    }

    const stored = loadRetailFlow();
    if (stored.quote) {
      setQuote((current) => current ?? stored.quote!);
    }
    if (stored.agreementAcceptance) {
      setStoredAcceptance(stored.agreementAcceptance);
      setAcceptChecked(Boolean(stored.agreementAcceptance.accepted));
      if (stored.agreementAcceptance.fullName) setFullName(stored.agreementAcceptance.fullName);
      if (stored.agreementAcceptance.acceptanceDate)
        setAcceptanceDate(stored.agreementAcceptance.acceptanceDate);
    }
  }, [locationQuote]);

  const acceptanceState = acceptChecked || Boolean(storedAcceptance?.accepted);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      const hash = await computeAgreementHash(quote, {
        accepted: acceptanceState,
        fullName,
        acceptanceDate,
      });
      if (isMounted) setAgreementHash(hash);
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [quote, acceptanceState, fullName, acceptanceDate]);

  const agreement = useMemo(() => generateAgreement(quote ?? undefined), [quote]);
  const hardwareList = useMemo(() => (quote ? getHardwareList(quote.packageId, quote.selectedAddOns) : []), [quote]);
  const featureCategories = useMemo(
    () => (quote ? getFeatureCategories(quote.packageId, quote.selectedAddOns) : []),
    [quote]
  );

  if (!quote) {
    return (
      <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem' }}>
        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Agreement review</div>
          <h1 style={{ margin: 0, color: '#fff7e6' }}>No stored quote found</h1>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Build a deterministic quote first, then return here to review and accept the agreement.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/quote')}>
            Back to quote builder
          </button>
        </div>
      </div>
    );
  }

  const selectedPackage = packagePricing.find((pkg) => pkg.id === quote.packageId) ?? packagePricing[0];
  const selectedAddOns = addOns.filter((item) => quote.selectedAddOns.includes(item.id));
  const agreementReference = buildAgreementReference(quote);
  const quoteHashDisplay = shortenMiddle(quote.quoteHash);
  const supersedesQuote = shortenMiddle(quote.priorQuoteHash);
  const displayedAgreementHash = shortenMiddle(agreementHash);
  const supersedesAgreement = shortenMiddle(
    storedAcceptance?.supersedesAgreementHash ?? storedAcceptance?.agreementHash
  );
  const resumeUrl = storedAcceptance?.accepted
    ? buildResumeUrl(quote, 'payment')
    : buildResumeUrl(quote, 'agreement');
  const shortResume = shortenMiddle(resumeUrl);
  const customerName = quote.customerName?.trim() || 'Customer';
  const agreementDate = agreement.header.generatedDate;
  const agreementVersion = siteConfig.agreementDocVersion;

  const emailSubject = `KickAss Elder Care Agreement – ${customerName} – ${agreementDate}`;
  const emailBody = `Hi ${customerName},\n\nHere’s your KickAss Elder Care agreement based on your deterministic quote.\nAgreement Ref: ${agreementReference}\nAgreement Version: ${agreementVersion}\nAgreement Hash: ${agreementHash}\nQuote Ref: ${agreement.quoteBinding.reference}\nQuote Hash: ${quote.quoteHash || 'pending'}\nTotal: ${formatCurrency(quote.pricing.total)}\n\nResume your order: ${resumeUrl}\nThis agreement precedes payment and scheduling. No monthly subscriptions are required.`;

  const handleCopyAgreementHash = async () => {
    if (!agreementHash) return;
    await copyToClipboard(agreementHash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  const handleCopyPriorAgreementHash = async () => {
    const prior = storedAcceptance?.supersedesAgreementHash ?? storedAcceptance?.agreementHash;
    if (!prior) return;
    await copyToClipboard(prior);
    setPriorHashCopied(true);
    setTimeout(() => setPriorHashCopied(false), 2000);
  };

  const handleCopyQuoteHash = async () => {
    if (!quote.quoteHash) return;
    await copyToClipboard(quote.quoteHash);
    setQuoteHashCopied(true);
    setTimeout(() => setQuoteHashCopied(false), 2000);
  };

  const handleCopyResume = async () => {
    if (!resumeUrl) return;
    await copyToClipboard(resumeUrl);
    setResumeCopied(true);
    setTimeout(() => setResumeCopied(false), 2000);
  };

  const persistAcceptance = async () => {
    const hash = agreementHash ||
      (await computeAgreementHash(quote, {
        accepted: true,
        fullName,
        acceptanceDate,
      }));
    const record: AcceptanceRecord = {
      accepted: true,
      fullName,
      acceptanceDate,
      recordedAt: new Date().toISOString(),
      agreementVersion,
      agreementHash: hash,
      supersedesAgreementHash: storedAcceptance?.agreementHash ?? storedAcceptance?.supersedesAgreementHash,
    };
    setStoredAcceptance(record);
    updateRetailFlow({ agreementAcceptance: record });
    setBannerMessage('Agreement accepted. Proceed to payment when ready.');
  };

  const handleAccept = async () => {
    if (!acceptChecked || !fullName.trim()) return;
    await persistAcceptance();
  };

  const handleProceedToPayment = async () => {
    if (!storedAcceptance?.accepted) return;
    navigate('/payment', { state: { quoteContext: quote } });
  };

  const handlePrint = () => {
    navigate('/agreementPrint', { state: { autoPrint: true } });
  };

  const handleEmail = () => {
    const recipient = quote.contact && quote.contact.includes('@') ? quote.contact : '';
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
  };

  const acceptanceReady = acceptChecked && fullName.trim();

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '2rem' }}>
      {redirectMessage && (
        <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)', color: '#c8c0aa' }}>
          {redirectMessage}
        </div>
      )}
      {bannerMessage && (
        <div className="card" style={{ border: '1px solid rgba(84, 160, 82, 0.5)', color: '#c8c0aa' }}>
          {bannerMessage}
        </div>
      )}
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="badge">Step 2 — Agreement Review</div>
            <h1 style={{ margin: '0.25rem 0', color: '#fff7e6' }}>Review and accept your agreement</h1>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              This agreement is required to proceed to deposit/payment and scheduling. No monthly subscriptions are required.
            </p>
            <small style={{ color: '#c8c0aa' }}>
              Plain-language summary only. Informational only — not medical advice.
            </small>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" onClick={handleEmail}>
              Email Agreement
            </button>
            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              Print / Save Agreement
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>What happens next</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>Agreement → Payment/Deposit → Schedule</span>
            </li>
            <li>
              <span />
              <span>Deterministic quote bindings ensure pricing and scope stay locked.</span>
            </li>
            <li>
              <span />
              <span>If accepted, Proceed to Payment unlocks automatically.</span>
            </li>
          </ul>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Agreement reference</strong>
          <ul className="list" style={{ marginTop: 0 }}>
            <li>
              <span />
              <span>Date: {agreementDate}</span>
            </li>
            <li>
              <span />
              <span>Agreement Version: {agreementVersion}</span>
            </li>
            <li>
              <span />
              <span>Agreement Ref: {agreementReference}</span>
            </li>
            <li>
              <span />
              <span>
                Agreement Hash: <span className="mono-text">{displayedAgreementHash}</span>{' '}
                {agreementHash && (
                  <button type="button" className="btn btn-secondary" onClick={handleCopyAgreementHash}>
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
                  <button type="button" className="btn btn-secondary" onClick={handleCopyPriorAgreementHash}>
                    {priorHashCopied ? 'Copied prior hash' : 'Copy prior hash'}
                  </button>
                )}
              </span>
            </li>
            <li>
              <span />
              <span>
                Linked quote reference: {agreement.quoteBinding.reference} (hash {quoteHashDisplay}){' '}
                {quote.quoteHash && (
                  <button type="button" className="btn btn-secondary" onClick={handleCopyQuoteHash}>
                    {quoteHashCopied ? 'Copied full hash' : 'Copy full hash'}
                  </button>
                )}
              </span>
            </li>
            <li>
              <span />
              <span>
                Supersedes prior quote hash: <span className="mono-text">{supersedesQuote}</span>
              </span>
            </li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>
            This agreement supersedes prior agreements for the same customer/property context.
          </small>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Continue your order</strong>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href={resumeUrl} style={{ fontWeight: 800 }}>
              Continue your order
            </a>
            <button type="button" className="btn btn-secondary" onClick={handleCopyResume} disabled={!resumeUrl}>
              {resumeCopied ? 'Copied resume link' : 'Copy resume link'}
            </button>
          </div>
          <small style={{ color: '#c8c0aa' }}>{shortResume}</small>
          <small className="break-all" style={{ color: '#c8c0aa' }}>
            {resumeUrl}
          </small>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <div className="badge">Scope & Deliverables</div>
          <h2 style={{ margin: '0.25rem 0' }}>Included services</h2>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Deterministic commitments based on your selected package and add-ons. No monthly subscriptions are required.
          </p>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            <strong>Scope & Deliverables</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              {agreement.scope.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            <strong>Installation & validation</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              {agreement.installationCommitments.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
              {agreement.validationSteps.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
          <strong>Pricing note</strong>
          <p style={{ margin: 0, color: '#c8c0aa' }}>{agreement.noMonthlyStatement}</p>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div>
          <div className="badge">Quote reference</div>
          <h2 style={{ margin: '0.25rem 0' }}>{selectedPackage.name}</h2>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Package {selectedPackage.name} • Add-ons: {selectedAddOns.length ? selectedAddOns.map((item) => item.label).join(', ') : 'None'}
          </p>
          <small style={{ color: '#c8c0aa' }}>One-time total: {formatCurrency(quote.pricing.total)}</small>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            <strong>Hardware summary</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              {hardwareList.map((category) => (
                <li key={category.title}>
                  <span />
                  <span>
                    {category.title}: {category.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            <strong>Feature summary</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              {featureCategories.map((category) => (
                <li key={category.title}>
                  <span />
                  <span>
                    {category.title}: {category.items.join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div>
          <div className="badge">Acceptance</div>
          <h2 style={{ margin: '0.25rem 0' }}>Confirm review</h2>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Check the box, type your name, and confirm the date to accept this agreement. Acceptance unlocks payment.
          </p>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={acceptChecked}
            onChange={(e) => setAcceptChecked(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <span>I have reviewed and agree to the KickAss Elder Care agreement</span>
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
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" className="btn btn-primary" onClick={handleAccept} disabled={!acceptanceReady}>
            Accept Agreement
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleProceedToPayment}
            disabled={!storedAcceptance?.accepted}
          >
            Proceed to Payment
          </button>
          {storedAcceptance?.accepted && (
            <small style={{ color: '#c8c0aa' }}>
              Accepted by {storedAcceptance.fullName} on {storedAcceptance.acceptanceDate || 'date not provided'}.
            </small>
          )}
        </div>
        <small style={{ color: '#c8c0aa' }}>
          Payment unlocks after acceptance. Informational only — not medical advice.
        </small>
      </div>
    </div>
  );
};

export default AgreementReview;
