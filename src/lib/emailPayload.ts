import { buildAgreementReference } from './agreementHash';
import { QuoteContext } from './agreement';
import { AcceptanceRecord } from './retailFlow';
import { buildQuoteReference, formatQuoteDate } from './quoteUtils';
import { buildResumeUrl } from './resumeToken';
import { shortenMiddle } from './displayUtils';

const getOrigin = () => (typeof window !== 'undefined' ? window.location.origin : 'https://kaec.local');

export const isValidEmail = (value?: string) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const buildQuoteEmailPayload = (quote: QuoteContext) => {
  const origin = getOrigin();
  const reference = buildQuoteReference(quote);
  const quoteDate = formatQuoteDate(quote.generatedAt);
  const customerName = quote.customerName?.trim() || 'Unknown';
  const resumeUrl = buildResumeUrl(quote, 'agreement');
  const shortHash = shortenMiddle(quote.quoteHash) ?? 'pending';
  const printUrl = `${origin}/quotePrint`;
  const subject = `KAEC Quote ${reference} — ${quoteDate} — ${customerName}`;
  const body = [
    `Deterministic KAEC quote issued: ${reference}`,
    `Customer: ${customerName}`,
    `Total: $${quote.pricing.total.toLocaleString()}`,
    `Quote hash (short): ${shortHash}`,
    '',
    `Continue your order: Continue your order — ${resumeUrl}`,
    `Quote print link: ${printUrl}`,
    '',
    'Retail preview; final e-sign package will be delivered via secure signing link once enabled.',
  ].join('\n');

  return { to: quote.contact ?? '', subject, body };
};

export const buildAgreementEmailPayload = (
  quote: QuoteContext,
  acceptance: AcceptanceRecord,
  options?: { resumePath?: 'payment' | 'agreement' }
) => {
  const origin = getOrigin();
  const reference = buildAgreementReference(quote);
  const quoteReference = buildQuoteReference(quote);
  const agreementDate = formatQuoteDate(acceptance.acceptanceDate ?? new Date().toISOString());
  const customerName = quote.customerName?.trim() || 'Unknown';
  const resumeUrl = buildResumeUrl(quote, options?.resumePath === 'payment' ? 'payment' : 'agreement');
  const shortAgreementHash = shortenMiddle(acceptance.agreementHash) ?? 'pending';
  const shortQuoteHash = shortenMiddle(quote.quoteHash) ?? 'pending';
  const printUrl = `${origin}/agreementPrint`;
  const subject = `KAEC Combined Agreement ${reference} — ${agreementDate} — ${customerName}`;
  const body = [
    `Signed agreement issued: ${reference}`,
    `Customer: ${customerName}`,
    `Agreement hash (short): ${shortAgreementHash}`,
    `Linked quote: ${quoteReference} (hash ${shortQuoteHash})`,
    `Total: $${quote.pricing.total.toLocaleString()}`,
    '',
    `Continue your order: Continue your order — ${resumeUrl}`,
    `Agreement print link: ${printUrl}`,
    '',
    'Retail preview; final e-sign package will be delivered via secure signing link once enabled.',
  ].join('\n');

  return { to: quote.contact ?? '', subject, body };
};
