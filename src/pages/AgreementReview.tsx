import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthorityBlock from '../components/AuthorityBlock';
import { addOns, packagePricing } from '../data/pricing';
import { getHardwareGroups } from '../data/hardware';
import { getFeatureGroups } from '../data/features';
import { generateAgreement, QuoteContext } from '../lib/agreement';
import { buildAgreementReference, computeAgreementHash } from '../lib/agreementHash';
import { copyToClipboard, shortenMiddle } from '../lib/displayUtils';
import { loadRetailFlow, markFlowStep, updateRetailFlow, AcceptanceRecord } from '../lib/retailFlow';
import { buildResumeUrl } from '../lib/resumeToken';
import { siteConfig } from '../config/site';
import { buildAgreementEmailPayload, isValidEmail } from '../lib/emailPayload';
import { sendAgreementEmail } from '../lib/emailSend';
import { buildAgreementAuthorityMeta, DocAuthorityMeta, parseAgreementToken } from '../lib/docAuthority';
import FlowGuidePanel from '../components/FlowGuidePanel';
import TierBadge from '../components/TierBadge';
import SaveProgressCard from '../components/SaveProgressCard';

const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

const AgreementReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = searchParams.get('t') || '';
  const locationQuote = (location.state as { quoteContext?: QuoteContext } | undefined)?.quoteContext;
  const [quote, setQuote] = useState<QuoteContext | null>(null);
  const [agreementHash, setAgreementHash] = useState('');
  const [acceptChecked, setAcceptChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [acceptanceDate, setAcceptanceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [storedAcceptance, setStoredAcceptance] = useState<AcceptanceRecord | null>(null);
  const [bannerMessage, setBannerMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailBanner, setEmailBanner] = useState('');
  const [manualRecipient, setManualRecipient] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);
  const [guidedMode, setGuidedMode] = useState<boolean>(() => loadRetailFlow().guidedMode ?? false);
  const [agreementEmailPayload, setAgreementEmailPayload] =
    useState<Awaited<ReturnType<typeof buildAgreementEmailPayload>> | null>(null);
  const [hashCopied, setHashCopied] = useState(false);
  const [priorHashCopied, setPriorHashCopied] = useState(false);
  const [quoteHashCopied, setQuoteHashCopied] = useState(false);
  const [resumeCopied, setResumeCopied] = useState(false);
  const [authorityMeta, setAuthorityMeta] = useState<DocAuthorityMeta | null>(null);
  const redirectMessage = (location.state as { message?: string } | undefined)?.message;

  useEffect(() => {
    window.scrollTo(0, 0);
    markFlowStep('agreement');
    if (token) {
      const payload = parseAgreementToken(token);
      if (payload?.quote) {
        setQuote(payload.quote);
        setEmail(payload.quote.contact ?? '');
        if (payload.acceptance) {
          setStoredAcceptance(payload.acceptance);
          setAcceptChecked(Boolean(payload.acceptance.accepted));
          if (payload.acceptance.fullName) setFullName(payload.acceptance.fullName);
          if (payload.acceptance.acceptanceDate) setAcceptanceDate(payload.acceptance.acceptanceDate);
        }
        return;
      }
    }

    if (locationQuote) {
      setQuote(locationQuote);
      updateRetailFlow({ quote: locationQuote });
    }

    const stored = loadRetailFlow();
    if (stored.quote) {
      setQuote((current) => current ?? stored.quote!);
      setEmail(stored.quote.contact ?? '');
    }
    if (typeof stored.guidedMode !== 'undefined') setGuidedMode(Boolean(stored.guidedMode));
    if (stored.agreementAcceptance) {
      setStoredAcceptance(stored.agreementAcceptance);
      setAcceptChecked(Boolean(stored.agreementAcceptance.accepted));
      if (stored.agreementAcceptance.fullName) setFullName(stored.agreementAcceptance.fullName);
      if (stored.agreementAcceptance.acceptanceDate)
        setAcceptanceDate(stored.agreementAcceptance.acceptanceDate);
    }
  }, [locationQuote, token]);

  const acceptanceState = acceptChecked || Boolean(storedAcceptance?.accepted);

  const acceptedRecord = storedAcceptance?.accepted ? storedAcceptance : null;

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (!quote) {
        if (isMounted) setAuthorityMeta(null);
        return;
      }
      const meta = await buildAgreementAuthorityMeta(
        { quote, agreementAcceptance: storedAcceptance ?? undefined },
        token || undefined,
      );
      if (isMounted) setAuthorityMeta(meta);
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [quote, storedAcceptance, token]);

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

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (!quote || !acceptedRecord) {
        if (isMounted) setAgreementEmailPayload(null);
        return;
      }
      const payload = await buildAgreementEmailPayload(
        { ...quote, contact: email || quote.contact },
        { ...acceptedRecord, emailTo: email || acceptedRecord.emailTo },
        { resumePath: 'payment' },
      );
      if (isMounted) setAgreementEmailPayload(payload);
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [acceptedRecord, email, quote, token]);

  useEffect(() => {
    if (!acceptedRecord || !agreementEmailPayload || sending) return;
    const recipient = email || acceptedRecord.emailTo || quote?.contact || '';
    if (!isValidEmail(recipient)) return;
    if (acceptedRecord.emailIssuedAtISO) return;
    handleSendAgreementEmail(recipient, 'auto');
  }, [acceptedRecord, agreementEmailPayload, email, quote, sending]);

  const agreement = useMemo(() => generateAgreement(quote ?? undefined), [quote]);
  const hardwareGroups = useMemo(
    () => (quote ? getHardwareGroups(quote.packageId, quote.selectedAddOns) : []),
    [quote]
  );
  const featureGroups = useMemo(
    () => (quote ? getFeatureGroups(quote.packageId, quote.selectedAddOns) : []),
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
  const acceptedName = fullName || storedAcceptance?.fullName || '';
  const acceptedDate = acceptanceDate || storedAcceptance?.acceptanceDate || '';
  const acceptanceReady = (acceptChecked || storedAcceptance?.accepted) && Boolean(acceptedName.trim()) && isValidEmail(email);
  const acceptanceSnapshot: AcceptanceRecord | null = useMemo(() => {
    if (storedAcceptance?.accepted || acceptanceReady) {
      return {
        accepted: true,
        fullName: storedAcceptance?.fullName ?? acceptedName,
        acceptanceDate: storedAcceptance?.acceptanceDate ?? acceptedDate,
        recordedAt: storedAcceptance?.recordedAt,
        acceptedAt: storedAcceptance?.acceptedAt ?? storedAcceptance?.recordedAt,
        agreementVersion,
        agreementHash: storedAcceptance?.agreementHash ?? agreementHash,
        supersedesAgreementHash: storedAcceptance?.supersedesAgreementHash ?? storedAcceptance?.agreementHash,
        emailIssuedAt: storedAcceptance?.emailIssuedAt,
        emailIssuedAtISO: storedAcceptance?.emailIssuedAtISO,
        emailTo: storedAcceptance?.emailTo ?? email,
        emailProvider: storedAcceptance?.emailProvider,
        emailMessageId: storedAcceptance?.emailMessageId,
        emailRecipients: storedAcceptance?.emailRecipients,
        emailLastStatus: storedAcceptance?.emailLastStatus,
        emailLastError: storedAcceptance?.emailLastError,
        emailSubject: storedAcceptance?.emailSubject,
        emailBody: storedAcceptance?.emailBody,
        emailStatus: storedAcceptance?.emailStatus ?? 'not_sent',
      };
    }
    return null;
  }, [acceptanceReady, acceptedDate, acceptedName, agreementHash, agreementVersion, email, storedAcceptance]);

  const agreementEmailStatus = acceptanceSnapshot?.emailLastStatus ?? acceptanceSnapshot?.emailStatus ?? 'not_sent';

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

  const handleUpdateEmail = (value: string) => {
    setEmail(value);
    if (!quote) return;
    const nextQuote = { ...quote, contact: value };
    setQuote(nextQuote);
    updateRetailFlow({ quote: nextQuote });
  };

  const recordAgreementEmailResult = (
    recipient: string,
    result: Awaited<ReturnType<typeof sendAgreementEmail>>,
  ) => {
    if (!quote) return;
    const baseAcceptance = storedAcceptance?.accepted ? storedAcceptance : null;
    if (!baseAcceptance) return;
    const issuedAt = new Date().toISOString();
    const recipients = [recipient, ...(baseAcceptance.emailRecipients ?? [])].filter(Boolean);
    const uniqueRecipients = Array.from(new Set(recipients)).slice(0, 3);
    const status = result.ok ? (result.provider === 'mock' ? 'mock' : 'sent') : 'failed';
    const updated: AcceptanceRecord = {
      ...baseAcceptance,
      emailIssuedAt: baseAcceptance.emailIssuedAt ?? issuedAt,
      emailIssuedAtISO: issuedAt,
      emailTo: recipient,
      emailProvider: result.provider,
      emailMessageId: result.id,
      emailLastStatus: status,
      emailLastError: result.ok ? undefined : result.error,
      emailRecipients: uniqueRecipients,
    };
    setStoredAcceptance(updated);
    updateRetailFlow({ agreementAcceptance: updated });
    const banner =
      status === 'sent'
        ? `A copy has been emailed to ${recipient}.`
        : status === 'mock'
        ? `Email queued (mock mode) for ${recipient}.`
        : 'We could not send the email. Please try again.';
    setEmailBanner(banner);
    setEmailError(result.ok ? '' : result.error || 'Unable to send email');
  };

  const sendAgreementEmailToRecipient = async (recipient: string) => {
    if (!agreementEmailPayload || !isValidEmail(recipient)) return null;
    const baseAcceptance = storedAcceptance?.accepted ? storedAcceptance : null;
    if (!baseAcceptance) return null;
    setSending(true);
    setEmailError('');
    const response = await sendAgreementEmail({ ...agreementEmailPayload, to: recipient });
    recordAgreementEmailResult(recipient, response);
    setSending(false);
    return response;
  };

  const handleSendAgreementEmail = async (recipient: string, source: 'auto' | 'manual') => {
    const response = await sendAgreementEmailToRecipient(recipient);
    if (!response) return;
    if (source === 'manual') setManualRecipient('');
  };

  const persistAcceptance = async (): Promise<AcceptanceRecord> => {
    const hash =
      agreementHash ||
      (await computeAgreementHash(quote, {
        accepted: true,
        fullName,
        acceptanceDate,
      }));
    const timestamp = new Date().toISOString();
    const record: AcceptanceRecord = {
      accepted: true,
      fullName,
      acceptanceDate,
      recordedAt: storedAcceptance?.recordedAt ?? timestamp,
      acceptedAt: storedAcceptance?.acceptedAt ?? storedAcceptance?.recordedAt ?? timestamp,
      agreementVersion,
      agreementHash: hash,
      supersedesAgreementHash: storedAcceptance?.agreementHash ?? storedAcceptance?.supersedesAgreementHash,
      emailIssuedAt: storedAcceptance?.emailIssuedAt,
      emailIssuedAtISO: storedAcceptance?.emailIssuedAtISO,
      emailTo: storedAcceptance?.emailTo ?? email,
      emailSubject: storedAcceptance?.emailSubject,
      emailBody: storedAcceptance?.emailBody,
      emailStatus: storedAcceptance?.emailStatus ?? 'not_sent',
      emailProvider: storedAcceptance?.emailProvider,
      emailMessageId: storedAcceptance?.emailMessageId,
      emailRecipients: storedAcceptance?.emailRecipients,
      emailLastStatus: storedAcceptance?.emailLastStatus,
      emailLastError: storedAcceptance?.emailLastError,
    };
    setStoredAcceptance(record);
    updateRetailFlow({ agreementAcceptance: record });
    setBannerMessage('Agreement accepted. Proceed to payment when ready.');
    return record;
  };

  const handleAccept = async () => {
    if (!acceptChecked || !fullName.trim() || !isValidEmail(email)) return;
    await persistAcceptance();
  };

  const handleProceedToPayment = async () => {
    if (!storedAcceptance?.accepted) return;
    navigate('/payment', { state: { quoteContext: quote } });
  };

  const handlePrint = () => {
    navigate('/agreementPrint', { state: { autoPrint: true } });
  };

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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleSendAgreementEmail(email, 'manual')}
            disabled={!acceptedRecord || !agreementEmailPayload || !isValidEmail(email) || sending}
          >
            {sending ? 'Sending…' : 'Send signed agreement copy'}
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            Print / Save Agreement
          </button>
        </div>
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

      <SaveProgressCard
        defaultEmail={email}
        resumeUrl={resumeUrl}
        available={Boolean(agreementEmailPayload)}
        sending={sending}
        onEmailChange={handleUpdateEmail}
        onSend={(recipient) => sendAgreementEmailToRecipient(recipient)}
      />

      <AuthorityBlock meta={authorityMeta} />

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

      <FlowGuidePanel
        currentStep="agreement"
        nextDescription="Payment/Deposit comes next. Save or email the signed agreement, then continue to reserve your installation."
        ctaLabel="Proceed to Payment"
        onCta={handleProceedToPayment}
      />
      <div className="card" style={{ display: 'grid', gap: '0.75rem', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <div className="badge">Friendly Agreement Overview</div>
            <h2 style={{ margin: 0 }}>You're almost done.</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              A quick, plain-language check before you accept. This panel does not change any legal terms.
            </p>
            {guidedMode && (
              <small style={{ color: '#c8c0aa' }}>This step is required before deposit and scheduling.</small>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" onClick={handlePrint}>
              Print/Save Agreement
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleSendAgreementEmail(email, 'manual')}
              disabled={!agreementEmailPayload || !isValidEmail(email) || sending}
            >
              {sending ? 'Sending…' : 'Email a copy'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => authorityMeta?.verificationUrl && window.open(authorityMeta.verificationUrl, '_blank')}
              disabled={!authorityMeta?.verificationUrl}
            >
              Verify authenticity
            </button>
          </div>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)', background: '#0f0e0d' }}>
            <strong>What this agreement does</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              <li>
                <span />
                <span>Confirms the package you selected and what’s included.</span>
              </li>
              <li>
                <span />
                <span>Confirms install expectations (professional crew, setup, training).</span>
              </li>
              <li>
                <span />
                <span>Confirms your deposit requirement so we can schedule.</span>
              </li>
            </ul>
          </div>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)', background: '#0f0e0d' }}>
            <strong>What this agreement does NOT do</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              <li>
                <span />
                <span>No subscription commitment.</span>
              </li>
              <li>
                <span />
                <span>No medical diagnosis or medical advice.</span>
              </li>
              <li>
                <span />
                <span>No hidden recurring charges.</span>
              </li>
              <li>
                <span />
                <span>You can review/print/save before proceeding.</span>
              </li>
            </ul>
          </div>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)', background: '#0f0e0d' }}>
            <strong>What happens next</strong>
            <ul className="list" style={{ marginTop: '0.35rem' }}>
              <li>
                <span />
                <span>Accept agreement → deposit → schedule install.</span>
              </li>
              <li>
                <span />
                <span>You’ll receive an emailed copy automatically.</span>
              </li>
            </ul>
          </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <TierBadge tierId={selectedPackage.id} />
            <h2 style={{ margin: '0.25rem 0' }}>{selectedPackage.name}</h2>
          </div>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Package {selectedPackage.name} • Add-ons: {selectedAddOns.length ? selectedAddOns.map((item) => item.label).join(', ') : 'None'}
          </p>
          <small style={{ color: '#c8c0aa' }}>One-time total: {formatCurrency(quote.pricing.total)}</small>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            <strong>Hardware summary</strong>
            <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.35rem' }}>
              {hardwareGroups.map((group) => (
                <div key={group.heading} style={{ display: 'grid', gap: '0.25rem' }}>
                  <small style={{ color: '#c8c0aa' }}>{group.heading}</small>
                  <ul className="list" style={{ marginTop: 0 }}>
                    {group.categories.map((category) => (
                      <li key={category.title}>
                        <span />
                        <span>
                          {category.title}: {category.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            <strong>Feature summary</strong>
            <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.35rem' }}>
              {featureGroups.map((group) => (
                <div key={group.heading} style={{ display: 'grid', gap: '0.25rem' }}>
                  <small style={{ color: '#c8c0aa' }}>{group.heading}</small>
                  <ul className="list" style={{ marginTop: 0 }}>
                    {group.categories.map((category) => (
                      <li key={category.title}>
                        <span />
                        <span>
                          {category.title}: {category.items.join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
        <small style={{ color: '#c8c0aa' }}>
          This is required so we can take your deposit and schedule your install.
        </small>
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
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span>Email for delivery (required)</span>
            <input
              value={email}
              onChange={(e) => handleUpdateEmail(e.target.value)}
              placeholder="care@kickassfamily.com"
              style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(245,192,66,0.35)', background: '#0f0e0d', color: '#fff7e6' }}
            />
            {!isValidEmail(email) && email && <small style={{ color: '#f0b267' }}>Enter a valid email to issue.</small>}
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
        {acceptedRecord ? (
          <div className="card" style={{ display: 'grid', gap: '0.75rem', background: '#0f0e0d', border: '1px solid rgba(245, 192, 66, 0.35)' }}>
            {emailBanner || agreementEmailStatus !== 'not_sent' ? (
              <div
                className="card"
                style={{
                  border:
                    agreementEmailStatus === 'failed'
                      ? '1px solid rgba(255, 98, 98, 0.6)'
                      : agreementEmailStatus === 'mock'
                      ? '1px solid rgba(245, 192, 66, 0.5)'
                      : '1px solid rgba(84, 160, 82, 0.5)',
                  color: '#c8c0aa',
                }}
              >
                <strong>
                  {emailBanner ||
                    (agreementEmailStatus === 'sent'
                      ? `A copy has been emailed to ${acceptedRecord.emailRecipients?.[0] ?? acceptedRecord.emailTo ?? email}.`
                      : agreementEmailStatus === 'mock'
                      ? `Email queued (mock mode) for ${acceptedRecord.emailRecipients?.[0] ?? acceptedRecord.emailTo ?? email}.`
                      : 'We could not send the email. Please try again.')}
                </strong>
                {acceptedRecord.emailProvider && (
                  <div style={{ marginTop: '0.25rem' }}>
                    <small>
                      Provider: {acceptedRecord.emailProvider}
                      {acceptedRecord.emailMessageId ? ` • Message ID: ${acceptedRecord.emailMessageId}` : ''}
                    </small>
                  </div>
                )}
                {(emailError || acceptedRecord.emailLastError) && (
                  <div style={{ marginTop: '0.25rem', color: '#f0b267' }}>
                    <small>Error: {emailError || acceptedRecord.emailLastError}</small>
                  </div>
                )}
              </div>
            ) : (
              <small style={{ color: '#c8c0aa' }}>Send the signed agreement to yourself and any caregivers.</small>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSendAgreementEmail(email, 'manual')}
                disabled={!agreementEmailPayload || !isValidEmail(email) || sending}
              >
                {sending ? 'Sending…' : 'Send to primary email'}
              </button>
            </div>
            <div style={{ display: 'grid', gap: '0.5rem', maxWidth: '540px' }}>
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
                    onClick={() => handleSendAgreementEmail(manualRecipient, 'manual')}
                    disabled={!isValidEmail(manualRecipient) || !agreementEmailPayload || sending}
                  >
                    {sending ? 'Sending…' : 'Send Email'}
                  </button>
                </div>
                {!isValidEmail(manualRecipient) && manualRecipient && (
                  <small style={{ color: '#f0b267' }}>Enter a valid email to send a copy.</small>
                )}
              </label>
              {acceptedRecord.emailRecipients?.length ? (
                <small style={{ color: '#c8c0aa' }}>
                  Sent to: {acceptedRecord.emailRecipients.slice(0, 3).join(', ')}
                </small>
              ) : null}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <strong>Email status</strong>
              <small style={{ color: '#c8c0aa' }}>
                {acceptedRecord.emailLastStatus
                  ? `${acceptedRecord.emailLastStatus.toUpperCase()} ${acceptedRecord.emailIssuedAtISO ? `at ${acceptedRecord.emailIssuedAtISO}` : ''}`
                  : 'Not sent'}
              </small>
            </div>
            {agreementEmailPayload?.links && (
              <div style={{ display: 'grid', gap: '0.35rem' }}>
                <small style={{ color: '#c8c0aa' }}>Links included in the email payload:</small>
                <ul className="list" style={{ marginTop: 0 }}>
                  <li>
                    <span />
                    <span className="break-all">Print: {agreementEmailPayload.links.printUrl}</span>
                  </li>
                  <li>
                    <span />
                    <span className="break-all">Verify: {agreementEmailPayload.links.verifyUrl}</span>
                  </li>
                  <li>
                    <span />
                    <span className="break-all">Resume: {agreementEmailPayload.links.resumeUrl}</span>
                  </li>
                  {agreementEmailPayload.links.reviewUrl && (
                    <li>
                      <span />
                      <span className="break-all">Review: {agreementEmailPayload.links.reviewUrl}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : null}
        <small style={{ color: '#c8c0aa' }}>
          Payment unlocks after acceptance. Informational only — not medical advice.
        </small>
      </div>
    </div>
  );
};

export default AgreementReview;
