import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthorityBlock from '../components/AuthorityBlock';
import FlowGuidePanel from '../components/FlowGuidePanel';
import { addOns, packagePricing } from '../data/pricing';
import { generateNarrative, NarrativeResponse } from '../lib/narrative';
import { QuoteContext } from '../lib/agreement';
import { loadRetailFlow, markFlowStep, updateRetailFlow } from '../lib/retailFlow';
import { getHardwareGroups } from '../data/hardware';
import { getFeatureGroups } from '../data/features';
import { buildQuoteReference, formatQuoteDate } from '../lib/quoteUtils';
import { quoteAssumptions, quoteDeliverables, quoteExclusions } from '../lib/quoteHash';
import { buildResumeUrl, buildQuoteFromResumePayload, parseResumeToken } from '../lib/resumeToken';
import { siteConfig } from '../config/site';
import { copyToClipboard, shortenMiddle } from '../lib/displayUtils';
import { buildQuoteEmailPayload, isValidEmail } from '../lib/emailPayload';
import { sendQuoteEmail } from '../lib/emailSend';
import { buildQuoteAuthorityMeta, DocAuthorityMeta } from '../lib/docAuthority';
import TierBadge from '../components/TierBadge';
import SaveProgressCard from '../components/SaveProgressCard';

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const QuoteReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = searchParams.get('t') || '';
  const [quote, setQuote] = useState<QuoteContext | null>(null);
  const [narrative, setNarrative] = useState<NarrativeResponse | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);
  const [priorHashCopied, setPriorHashCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [manualRecipient, setManualRecipient] = useState('');
  const [emailBanner, setEmailBanner] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);
  const [emailPayload, setEmailPayload] = useState<Awaited<ReturnType<typeof buildQuoteEmailPayload>> | null>(null);
  const [authorityMeta, setAuthorityMeta] = useState<DocAuthorityMeta | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    markFlowStep('quote');
    if (token) {
      const payload = parseResumeToken(token);
      if (payload) {
        const restored = buildQuoteFromResumePayload(payload);
        setQuote(restored);
        setEmail(restored.contact ?? '');
        return;
      }
    }

    const stored = loadRetailFlow();
    if (stored.quote) {
      setQuote(stored.quote);
      setEmail(stored.quote.contact ?? '');
    }
  }, [token]);

  const selectedPackage = useMemo(
    () => packagePricing.find((pkg) => pkg.id === quote?.packageId) ?? packagePricing[0],
    [quote]
  );

  const selectedAddOns = useMemo(
    () => addOns.filter((addOn) => quote?.selectedAddOns.includes(addOn.id)),
    [quote]
  );

  const hardwareGroups = useMemo(
    () => (quote ? getHardwareGroups(quote.packageId, quote.selectedAddOns) : []),
    [quote]
  );
  const featureGroups = useMemo(
    () => (quote ? getFeatureGroups(quote.packageId, quote.selectedAddOns) : []),
    [quote]
  );

  const resumeUrl = useMemo(() => (quote ? buildResumeUrl(quote, 'agreement') : ''), [quote]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (!quote) {
        if (isMounted) setAuthorityMeta(null);
        return;
      }
      const meta = await buildQuoteAuthorityMeta({ quote }, token || undefined);
      if (isMounted) setAuthorityMeta(meta);
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [quote, token]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (!quote) {
        if (isMounted) setEmailPayload(null);
        return;
      }
      const payload = await buildQuoteEmailPayload({ ...quote, contact: email || quote.contact }, token || undefined);
      if (isMounted) setEmailPayload(payload);
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [email, quote, token]);

  useEffect(() => {
    if (!quote || !emailPayload || sending) return;
    if (!quote.contact || !isValidEmail(quote.contact)) return;
    if (quote.emailIssuedAtISO) return;
    handleSendEmail(quote.contact, 'auto');
  }, [emailPayload, quote, sending]);

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

  const emailStatus = quote?.emailLastStatus ?? quote?.emailStatus ?? 'not_sent';
  const emailValid = isValidEmail(email);

  const handleUpdateEmail = (value: string) => {
    setEmail(value);
    if (!quote) return;
    const nextQuote = { ...quote, contact: value };
    setQuote(nextQuote);
    updateRetailFlow({ quote: nextQuote });
  };

  const recordEmailResult = (
    recipient: string,
    result: Awaited<ReturnType<typeof sendQuoteEmail>>,
  ) => {
    if (!quote) return;
    const issuedAt = new Date().toISOString();
    const recipients = [recipient, ...(quote.emailRecipients ?? [])].filter(Boolean);
    const uniqueRecipients = Array.from(new Set(recipients)).slice(0, 3);
    const status = result.ok ? (result.provider === 'mock' ? 'mock' : 'sent') : 'failed';
    const nextQuote: QuoteContext = {
      ...quote,
      contact: quote.contact ?? recipient,
      issuedAt: quote.issuedAt ?? issuedAt,
      issuedAtISO: quote.issuedAtISO ?? issuedAt,
      emailIssuedAt: quote.emailIssuedAt ?? issuedAt,
      emailIssuedAtISO: issuedAt,
      emailTo: recipient,
      emailProvider: result.provider,
      emailMessageId: result.id,
      emailLastStatus: status,
      emailLastError: result.ok ? undefined : result.error,
      emailRecipients: uniqueRecipients,
    };
    setQuote(nextQuote);
    updateRetailFlow({ quote: nextQuote });

    const banner =
      status === 'sent'
        ? `A copy has been emailed to ${recipient}.`
        : status === 'mock'
        ? `Email queued (mock mode) for ${recipient}.`
        : 'We could not send the email. Please try again.';
    setEmailBanner(banner);
    setEmailError(result.ok ? '' : result.error || 'Unable to send email');
  };

  const sendQuoteEmailToRecipient = async (recipient: string) => {
    if (!quote || !emailPayload || !isValidEmail(recipient)) return null;
    setSending(true);
    setEmailError('');
    const response = await sendQuoteEmail({ ...emailPayload, to: recipient });
    recordEmailResult(recipient, response);
    setSending(false);
    return response;
  };

  const handleSendEmail = async (recipient: string, source: 'auto' | 'manual') => {
    const response = await sendQuoteEmailToRecipient(recipient);
    if (!response) return;
    if (source === 'manual') {
      setManualRecipient('');
    }
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
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleSendEmail(email, 'manual')}
              disabled={!emailValid || sending || !emailPayload}
            >
              {sending ? 'Sending…' : 'Send legal copy to my email'}
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
            We send the legally binding tokenized copy via the KAEC server. No pricing or package content is changed.
          </small>
        </div>
        {emailBanner || quote.emailLastStatus ? (
          <div
            className="card"
            style={{
              border:
                emailStatus === 'failed'
                  ? '1px solid rgba(255, 98, 98, 0.6)'
                  : emailStatus === 'mock'
                  ? '1px solid rgba(245, 192, 66, 0.5)'
                  : '1px solid rgba(84, 160, 82, 0.5)',
              color: '#c8c0aa',
            }}
          >
            <strong>
              {emailBanner ||
                (emailStatus === 'sent'
                  ? `A copy has been emailed to ${quote.emailRecipients?.[0] ?? quote.emailTo ?? email}.`
                  : emailStatus === 'mock'
                  ? `Email queued (mock mode) for ${quote.emailRecipients?.[0] ?? quote.emailTo ?? email}.`
                  : 'We could not send the email. Please try again.')}
            </strong>
            {quote.emailProvider && (
              <div style={{ marginTop: '0.25rem' }}>
                <small>
                  Provider: {quote.emailProvider}
                  {quote.emailMessageId ? ` • Message ID: ${quote.emailMessageId}` : ''}
                </small>
              </div>
            )}
            {(emailError || quote.emailLastError) && (
              <div style={{ marginTop: '0.25rem', color: '#f0b267' }}>
                <small>Error: {emailError || quote.emailLastError}</small>
              </div>
            )}
          </div>
        ) : null}
        <div style={{ display: 'grid', gap: '0.5rem', maxWidth: '520px' }}>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Send a copy to</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                value={manualRecipient}
                onChange={(e) => setManualRecipient(e.target.value)}
                placeholder="name@example.com"
                style={{
                  flex: 1,
                  minWidth: '240px',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(245,192,66,0.35)',
                  background: '#0f0e0d',
                  color: '#fff7e6',
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSendEmail(manualRecipient, 'manual')}
                disabled={!isValidEmail(manualRecipient) || sending || !emailPayload}
              >
                {sending ? 'Sending…' : 'Send Email'}
              </button>
            </div>
            {!isValidEmail(manualRecipient) && manualRecipient && (
              <small style={{ color: '#f0b267' }}>Enter a valid email to send a copy.</small>
            )}
          </label>
          {quote.emailRecipients?.length ? (
            <small style={{ color: '#c8c0aa' }}>
              Sent to: {quote.emailRecipients.slice(0, 3).join(', ')}
            </small>
          ) : null}
        </div>
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

      <SaveProgressCard
        defaultEmail={email}
        resumeUrl={resumeUrl}
        available={Boolean(emailPayload)}
        sending={sending}
        onEmailChange={handleUpdateEmail}
        onSend={(recipient) => sendQuoteEmailToRecipient(recipient)}
      />

      <FlowGuidePanel
        currentStep="quote"
        nextDescription="Agreement review is next. Save or email this quote, then continue to formal acceptance."
        ctaLabel="Continue to Agreement"
        onCta={handleContinueToAgreement}
      />

      <AuthorityBlock meta={authorityMeta} />

      <div className="card" style={{ display: 'grid', gap: '1rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge">Quote reference</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <TierBadge tierId={selectedPackage.id} />
              <h2 style={{ margin: '0.35rem 0' }}>{selectedPackage.name}</h2>
            </div>
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
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            Print / Save Quote
          </button>
          <small style={{ color: '#c8c0aa' }}>
            Advisory narrative only; if there is an urgent safety issue, call 911.
          </small>
        </div>
      <div className="card" style={{ display: 'grid', gap: '0.35rem', background: '#0f0e0d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <strong>Email delivery</strong>
          <small style={{ color: '#c8c0aa' }}>
            {quote.emailLastStatus
              ? `${quote.emailLastStatus.toUpperCase()} ${quote.emailIssuedAtISO ? `at ${quote.emailIssuedAtISO}` : ''}`
              : 'Not sent'}
          </small>
        </div>
        <ul className="list" style={{ marginTop: 0 }}>
          <li>
            <span />
            <span>Provider: {quote.emailProvider ?? 'not configured (mock mode)'}</span>
          </li>
          <li>
            <span />
            <span>Message ID: {quote.emailMessageId ?? 'n/a'}</span>
          </li>
          <li>
            <span />
            <span>Recipients: {quote.emailRecipients?.slice(0, 3).join(', ') || quote.contact || 'n/a'}</span>
          </li>
        </ul>
        {emailPayload?.links && (
          <div style={{ display: 'grid', gap: '0.35rem' }}>
            <small style={{ color: '#c8c0aa' }}>Links included in the email payload:</small>
            <ul className="list" style={{ marginTop: 0 }}>
              <li>
                <span />
                <span className="break-all">Print: {emailPayload.links.printUrl}</span>
              </li>
              <li>
                <span />
                <span className="break-all">Verify: {emailPayload.links.verifyUrl}</span>
              </li>
              <li>
                <span />
                <span className="break-all">Resume: {emailPayload.links.resumeUrl}</span>
              </li>
              {emailPayload.links.reviewUrl && (
                <li>
                  <span />
                  <span className="break-all">Review: {emailPayload.links.reviewUrl}</span>
                </li>
              )}
            </ul>
          </div>
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
        {hardwareGroups.map((group) => (
          <div
            key={group.heading}
            className="card"
            style={{ border: '1px solid rgba(245, 192, 66, 0.35)', display: 'grid', gap: '0.5rem' }}
          >
            <strong>{group.heading}</strong>
            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {group.categories.map((category) => (
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
        ))}
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Feature coverage</div>
        {featureGroups.map((group) => (
          <div
            key={group.heading}
            className="card"
            style={{ border: '1px solid rgba(245, 192, 66, 0.35)', display: 'grid', gap: '0.5rem' }}
          >
            <strong>{group.heading}</strong>
            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {group.categories.map((category) => (
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
        ))}
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
