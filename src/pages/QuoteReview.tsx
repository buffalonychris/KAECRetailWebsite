import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOns, packagePricing } from '../data/pricing';
import { generateNarrative, NarrativeResponse } from '../lib/narrative';
import { QuoteContext } from '../lib/agreement';
import { loadRetailFlow, updateRetailFlow } from '../lib/retailFlow';
import { getHardwareList } from '../data/hardware';
import { getFeatureCategories } from '../data/features';
import { buildQuoteReference, formatQuoteDate } from '../lib/quoteUtils';
import { quoteAssumptions, quoteDeliverables, quoteExclusions } from '../lib/quoteHash';
import { buildResumeUrl } from '../lib/resumeToken';
import { siteConfig } from '../config/site';
import { copyToClipboard, shortenMiddle } from '../lib/displayUtils';
import { buildQuoteEmailPayload, isValidEmail } from '../lib/emailPayload';

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const QuoteReview = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<QuoteContext | null>(null);
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);
  const [priorHashCopied, setPriorHashCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailBanner, setEmailBanner] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = loadRetailFlow();
    if (stored.quote) {
      setQuote(stored.quote);
      setEmail(stored.quote.contact ?? '');
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

  const resumeUrl = useMemo(() => (quote ? buildResumeUrl(quote, 'agreement') : ''), [quote]);

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
    navigate('/agreementReview', { state: { quoteContext: quote } });
  };

  const handlePrint = () => {
    if (!quote) return;
    updateRetailFlow({ quote });
    navigate('/quotePrint', { state: { autoPrint: true } });
  };

  const quoteDate = quote ? formatQuoteDate(quote.generatedAt) : formatQuoteDate();
  const customerName = quote?.customerName?.trim() || 'Customer';

  const emailPayload = quote ? buildQuoteEmailPayload({ ...quote, contact: email }) : null;
  const emailStatus = quote?.emailStatus ?? 'not_sent';
  const emailValid = isValidEmail(email);

  const handleUpdateEmail = (value: string) => {
    setEmail(value);
    if (!quote) return;
    const nextQuote = { ...quote, contact: value };
    setQuote(nextQuote);
    updateRetailFlow({ quote: nextQuote });
  };

  const handleIssueEmail = () => {
    if (!quote || !emailPayload || !emailValid) return;
    const issuedAt = new Date().toISOString();
    const nextQuote: QuoteContext = {
      ...quote,
      contact: email,
      issuedAt: quote.issuedAt ?? issuedAt,
      emailIssuedAt: issuedAt,
      emailTo: email,
      emailSubject: emailPayload.subject,
      emailBody: emailPayload.body,
      emailStatus: 'issued',
    };
    setQuote(nextQuote);
    updateRetailFlow({ quote: nextQuote });
    setEmailBanner(`Copy issued and emailed to: ${email} (Retail preview)`);
  };

  const handleOpenDraft = () => {
    if (!quote || !emailPayload || !emailValid) return;
    const mailto = `mailto:${email}?subject=${encodeURIComponent(emailPayload.subject)}&body=${encodeURIComponent(
      emailPayload.body
    )}`;
    const issuedAt = quote.emailIssuedAt ?? new Date().toISOString();
    const nextQuote: QuoteContext = {
      ...quote,
      contact: email,
      issuedAt: quote.issuedAt ?? issuedAt,
      emailIssuedAt: issuedAt,
      emailTo: email,
      emailSubject: emailPayload.subject,
      emailBody: emailPayload.body,
      emailStatus: 'draft_opened',
    };
    setQuote(nextQuote);
    updateRetailFlow({ quote: nextQuote });
    setEmailBanner(`Copy issued and emailed to: ${email} (Retail preview)`);
    window.location.href = mailto;
  };

  const handleCopyEmail = async () => {
    if (!emailPayload || !emailValid) return;
    await navigator.clipboard.writeText(`Subject: ${emailPayload.subject}\n\n${emailPayload.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyResumeLink = async () => {
    if (!resumeUrl) return;
    await copyToClipboard(resumeUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCopyHash = async () => {
    if (!quote?.quoteHash) return;
    await copyToClipboard(quote.quoteHash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  const handleCopyPriorHash = async () => {
    if (!quote?.priorQuoteHash) return;
    await copyToClipboard(quote.priorQuoteHash);
    setPriorHashCopied(true);
    setTimeout(() => setPriorHashCopied(false), 2000);
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

  const reference = buildQuoteReference(quote);
  const quoteVersion = quote.quoteDocVersion ?? siteConfig.quoteDocVersion;
  const displayedHash = shortenMiddle(quote.quoteHash);
  const supersedes = shortenMiddle(quote.priorQuoteHash);

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
            <button type="button" className="btn btn-secondary" onClick={handleIssueEmail} disabled={!emailValid}>
              Email me a copy (Issue Quote)
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={{ display: 'grid', gap: '0.35rem', maxWidth: '420px' }}>
            <span>Email for delivery (required to issue via email)</span>
            <input
              value={email}
              onChange={(e) => handleUpdateEmail(e.target.value)}
              placeholder="care@kickassfamily.com"
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1px solid rgba(245,192,66,0.35)',
                background: '#0f0e0d',
                color: '#fff7e6',
              }}
            />
            {!emailValid && email && <small style={{ color: '#f0b267' }}>Enter a valid email to issue.</small>}
          </label>
          <small style={{ color: '#c8c0aa' }}>
            The issue action records a retail preview copy and pre-fills your email client. No email is sent automatically.
          </small>
        </div>
        {emailBanner || (quote.emailIssuedAt && quote.emailStatus && quote.emailStatus !== 'not_sent') ? (
          <div className="card" style={{ border: '1px solid rgba(84, 160, 82, 0.5)', color: '#c8c0aa' }}>
            <strong>{emailBanner || `Copy issued and emailed to: ${quote.emailTo ?? email} (Retail preview)`}</strong>
            <div style={{ marginTop: '0.25rem' }}>
              <small>If your email client did not open, copy the message below.</small>
            </div>
          </div>
        ) : null}
        {resumeUrl && (
          <div style={{ display: 'grid', gap: '0.4rem' }}>
            <strong>Resume Link</strong>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={resumeUrl} style={{ color: 'var(--kaec-gold)', fontWeight: 700 }}>
                Continue your order
              </a>
              <button type="button" className="btn btn-secondary" onClick={handleCopyResumeLink}>
                {linkCopied ? 'Copied resume link' : 'Copy resume link'}
              </button>
            </div>
            <small className="break-all" style={{ color: '#c8c0aa' }}>{resumeUrl}</small>
          </div>
        )}
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
            <div style={{ display: 'grid', gap: '0.2rem', color: '#c8c0aa', marginTop: '0.35rem' }}>
              <small>Quote Version: {quoteVersion}</small>
              <small style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="mono-text" title={quote.quoteHash || undefined}>Quote Hash: {displayedHash}</span>
                {quote.quoteHash && (
                  <button type="button" className="btn btn-secondary" onClick={handleCopyHash}>
                    {hashCopied ? 'Copied full hash' : 'Copy full hash'}
                  </button>
                )}
              </small>
              <small style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="mono-text" title={quote.priorQuoteHash || undefined}>Supersedes prior: {supersedes}</span>
                {quote.priorQuoteHash && (
                  <button type="button" className="btn btn-secondary" onClick={handleCopyPriorHash}>
                    {priorHashCopied ? 'Copied prior hash' : 'Copy prior hash'}
                  </button>
                )}
              </small>
            </div>
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
          <button type="button" className="btn btn-secondary" onClick={handleIssueEmail} disabled={!emailValid}>
            Email me a copy (Issue Quote)
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleOpenDraft} disabled={!emailValid}>
            Open email draft
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCopyEmail} disabled={!emailValid}>
            {copied ? 'Copied email text' : 'Copy email text'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            Print / Save Quote
          </button>
          <small style={{ color: '#c8c0aa' }}>
            Advisory narrative only; if there is an urgent safety issue, call 911.
          </small>
        </div>
        <div className="card" style={{ display: 'grid', gap: '0.35rem', background: '#0f0e0d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <strong>Email status</strong>
            <small style={{ color: '#c8c0aa' }}>
              {emailStatus === 'issued'
                ? `Issued at ${quote.emailIssuedAt ?? 'pending'}`
                : emailStatus === 'draft_opened'
                ? `Draft opened at ${quote.emailIssuedAt ?? 'pending'}`
                : 'Not sent'}
            </small>
          </div>
          {emailPayload && (
            <pre
              style={{
                background: '#0a0908',
                color: '#e6ddc7',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(245, 192, 66, 0.35)',
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}
            >
              {`Subject: ${emailPayload.subject}\n\n${emailPayload.body}`}
            </pre>
          )}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">What’s included</div>
        <ul className="list" style={{ marginTop: '0.35rem' }}>
          {quoteDeliverables.map((item) => (
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
          {quoteAssumptions.map((item) => (
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
          {quoteExclusions.map((item) => (
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
