import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateAgreement, QuoteContext } from '../lib/agreement';
import { AcceptanceRecord, loadRetailFlow } from '../lib/retailFlow';
import { computeAgreementHash, buildAgreementReference } from '../lib/agreementHash';
import { shortenMiddle, copyToClipboard } from '../lib/displayUtils';
import { buildResumeUrl } from '../lib/resumeToken';
import { siteConfig } from '../config/site';

const AgreementPrint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quote, setQuote] = useState<QuoteContext | null>(null);
  const [acceptance, setAcceptance] = useState<AcceptanceRecord | null>(null);
  const [agreementHash, setAgreementHash] = useState('');
  const [hashCopied, setHashCopied] = useState(false);
  const [priorHashCopied, setPriorHashCopied] = useState(false);
  const [quoteHashCopied, setQuoteHashCopied] = useState(false);
  const [priorQuoteHashCopied, setPriorQuoteHashCopied] = useState(false);
  const [resumeCopied, setResumeCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = loadRetailFlow();
    if (stored.quote) {
      setQuote(stored.quote);
    }
    if (stored.agreementAcceptance) {
      setAcceptance(stored.agreementAcceptance);
    }
  }, []);

  useEffect(() => {
    if (!quote) return;
    const originalTitle = document.title;
    const shouldAutoPrint = (location.state as { autoPrint?: boolean } | null)?.autoPrint ?? true;
    if (!shouldAutoPrint) return undefined;

    const timer = setTimeout(() => {
      document.title = 'KickAss Elder Care Agreement';
      window.print();
      document.title = originalTitle;
    }, 600);

    return () => {
      clearTimeout(timer);
      document.title = originalTitle;
    };
  }, [location.state, quote]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      const hash = await computeAgreementHash(quote, {
        accepted: acceptance?.accepted ?? false,
        fullName: acceptance?.fullName,
        acceptanceDate: acceptance?.acceptanceDate,
      });
      if (isMounted) {
        setAgreementHash(hash);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [quote, acceptance]);

  const agreement = useMemo(() => generateAgreement(quote ?? undefined), [quote]);

  if (!quote) {
    return (
      <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem' }}>
        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Agreement print</div>
          <h1 style={{ margin: 0, color: '#fff7e6' }}>No stored agreement found</h1>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Build a deterministic quote and agreement first, then return here to print a professional copy.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/quote')}>
            Back to quote builder
          </button>
        </div>
      </div>
    );
  }

  const agreementReference = buildAgreementReference(quote);
  const displayedAgreementHash = shortenMiddle(agreementHash);
  const supersedesAgreement = shortenMiddle(acceptance?.supersedesAgreementHash ?? acceptance?.agreementHash);
  const quoteHashDisplay = shortenMiddle(agreement.quoteBinding.quoteHash);
  const priorQuoteHashDisplay = shortenMiddle(agreement.quoteBinding.priorQuoteHash);
  const resumeUrl = buildResumeUrl(quote, 'agreement');
  const docDate = agreement.header.generatedDate;

  const handleCopyAgreementHash = async () => {
    if (!agreementHash) return;
    await copyToClipboard(agreementHash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  const handleCopyPriorAgreementHash = async () => {
    const prior = acceptance?.supersedesAgreementHash ?? acceptance?.agreementHash;
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
    await copyToClipboard(resumeUrl);
    setResumeCopied(true);
    setTimeout(() => setResumeCopied(false), 2000);
  };

  return (
    <div className="print-page" style={{ padding: '3rem 0' }}>
      <div className="print-document kaec-doc" role="document">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem' }}>KickAss Elder Care (KAEC)</div>
            <div style={{ fontSize: '0.95rem', color: '#333' }}>Local-first safety, security, and monitoring.</div>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button type="button" className="btn btn-primary" style={{ marginLeft: '0.5rem' }} onClick={() => window.print()}>
              Print / Save PDF
            </button>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.95rem', display: 'grid', gap: '0.35rem' }}>
            <div>Date: {docDate}</div>
            <div>Agreement Ref: {agreementReference}</div>
            <div>Agreement Version: {siteConfig.agreementDocVersion}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span className="mono-text" title={agreementHash || undefined}>Agreement Hash: {displayedAgreementHash}</span>
              {agreementHash && (
                <button type="button" className="btn btn-secondary" onClick={handleCopyAgreementHash}>
                  {hashCopied ? 'Copied full hash' : 'Copy full hash'}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span className="mono-text" title={acceptance?.supersedesAgreementHash || acceptance?.agreementHash || undefined}>
                Supersedes prior agreement hash: {supersedesAgreement}
              </span>
              {supersedesAgreement !== 'None' && (
                <button type="button" className="btn btn-secondary" onClick={handleCopyPriorAgreementHash}>
                  {priorHashCopied ? 'Copied prior hash' : 'Copy prior hash'}
                </button>
              )}
            </div>
            <div>This agreement supersedes all prior agreements for the same customer/property context.</div>
            <div>Quote Ref: {agreement.quoteBinding.reference}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span className="mono-text" title={agreement.quoteBinding.quoteHash || undefined}>Quote Hash: {quoteHashDisplay}</span>
              {agreement.quoteBinding.quoteHash && (
                <button type="button" className="btn btn-secondary" onClick={handleCopyQuoteHash}>
                  {quoteHashCopied ? 'Copied full hash' : 'Copy full hash'}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span className="mono-text" title={agreement.quoteBinding.priorQuoteHash || undefined}>
                Supersedes prior quote hash: {priorQuoteHashDisplay}
              </span>
              {agreement.quoteBinding.priorQuoteHash && (
                <button type="button" className="btn btn-secondary" onClick={handleCopyPriorQuoteHash}>
                  {priorQuoteHashCopied ? 'Copied prior hash' : 'Copy prior hash'}
                </button>
              )}
            </div>
            <div style={{ fontWeight: 700, color: '#000', marginTop: '0.5rem', display: 'grid', gap: '0.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span>Continue your order:</span>
                <a href={resumeUrl} style={{ fontWeight: 800 }}>
                  Continue your order
                </a>
                <button type="button" className="btn btn-secondary" onClick={handleCopyResume}>
                  {resumeCopied ? 'Copied resume link' : 'Copy resume link'}
                </button>
              </div>
              <small className="break-all" style={{ color: '#222', textAlign: 'right' }}>{resumeUrl}</small>
            </div>
          </div>
        </header>

        <section className="print-section" style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
          <h2>Customer & Property</h2>
          <ul className="print-list">
            {agreement.customerSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="print-section" style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <h2>Quote Binding</h2>
          <ul className="print-list">
            <li>Tier: {agreement.quoteSummary.packageName}</li>
            <li>Add-ons: {agreement.quoteSummary.addOnLabels.join(', ')}</li>
            <li>One-time total: {agreement.quoteSummary.total}</li>
            <li>Quote Version: {agreement.quoteBinding.quoteVersion}</li>
          </ul>
        </section>

        <section className="print-section" style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <h2>Statement of Work</h2>
          <ul className="print-list">
            {agreement.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div>
            <strong>Assumptions & Exclusions</strong>
            <ul className="print-list">
              {agreement.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {agreement.exclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Offline behavior</strong>
            <p style={{ margin: 0, color: '#111' }}>{agreement.offlineBehavior}</p>
          </div>
          <div>
            <strong>Installation window</strong>
            <p style={{ margin: 0, color: '#111' }}>{agreement.installationWindow}</p>
          </div>
          <div>
            <strong>Warranty / service boundary placeholders</strong>
            <ul className="print-list">
              {agreement.warrantyPlaceholders.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Pricing note</strong>
            <p style={{ margin: 0, color: '#111' }}>{agreement.noMonthlyStatement}</p>
          </div>
        </section>

        <section className="print-section" style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <h2>Terms & Conditions</h2>
          <div>Version {agreement.termsVersion}</div>
          <ul className="print-list">
            {agreement.terms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="print-section" style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <h2>Quote Appendix</h2>
          <ul className="print-list">
            <li>Package: {agreement.quoteAppendix.packageName}</li>
            <li>Add-ons: {agreement.quoteAppendix.addOnLabels.join(', ')}</li>
            <li>One-time total: {agreement.quoteBinding.total}</li>
            <li>Quote version: {agreement.quoteBinding.quoteVersion}</li>
            <li>Quote hash: {quoteHashDisplay}</li>
            <li>Supersedes prior quote hash: {priorQuoteHashDisplay}</li>
            {agreement.quoteAppendix.hardwareSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {agreement.quoteAppendix.featureSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AgreementPrint;
