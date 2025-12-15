import { siteConfig } from '../config/site';
import { buildAgreementReference, computeAgreementHash } from './agreementHash';
import { QuoteContext } from './agreement';
import { shortenMiddle } from './displayUtils';
import { computeQuoteHash } from './quoteHash';
import { buildQuoteReference } from './quoteUtils';
import { buildResumeUrl, buildQuoteFromResumePayload, createResumeToken, parseResumeToken } from './resumeToken';
import { AcceptanceRecord, RetailFlowState } from './retailFlow';
import { CertificateRecord } from './sicar';

export type CanonicalDocumentType = 'QUOTE' | 'AGREEMENT' | 'SICAR';

export type DocAuthorityMeta = {
  docType: CanonicalDocumentType;
  version: string;
  reference: string;
  issuedAtISO: string;
  hashFull: string;
  hashShort: string;
  supersedesHashFull?: string;
  supersedesHashShort?: string;
  quoteBinding?: { ref: string; hashFull: string; hashShort: string };
  resumeUrl: string;
  resumeUrlDisplay: string;
  verificationUrl: string;
};

export type DocumentTypeConfig = {
  docType: CanonicalDocumentType;
  docVersion: string;
  hashAlgorithm: 'SHA-256';
  supersedesFieldKey?: 'priorQuoteHash' | 'supersedesAgreementHash';
  defaultResumeStep: 'agreement' | 'payment' | 'schedule' | 'view-only';
  printRoute: '/quotePrint' | '/agreementPrint' | '/certificate' | '/certificatePrint';
};

export const DOCUMENT_TYPES: Record<CanonicalDocumentType, DocumentTypeConfig> = {
  QUOTE: {
    docType: 'QUOTE',
    docVersion: siteConfig.quoteDocVersion,
    hashAlgorithm: 'SHA-256',
    supersedesFieldKey: 'priorQuoteHash',
    defaultResumeStep: 'agreement',
    printRoute: '/quotePrint',
  },
  AGREEMENT: {
    docType: 'AGREEMENT',
    docVersion: siteConfig.agreementDocVersion,
    hashAlgorithm: 'SHA-256',
    supersedesFieldKey: 'supersedesAgreementHash',
    defaultResumeStep: 'payment',
    printRoute: '/agreementPrint',
  },
  SICAR: {
    docType: 'SICAR',
    docVersion: 'v1.0',
    hashAlgorithm: 'SHA-256',
    defaultResumeStep: 'view-only',
    printRoute: '/certificate',
  },
};

const base64UrlEncode = (input: string) =>
  btoa(input)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const base64UrlDecode = (input: string) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return atob(normalized + padding);
};

export type AgreementTokenPayload = {
  quote: QuoteContext;
  acceptance?: AcceptanceRecord | null;
  hash?: string;
};

export type SicarTokenPayload = {
  certificate: CertificateRecord;
  hash?: string;
};

export const buildAgreementToken = (quote: QuoteContext, acceptance?: AcceptanceRecord | null, hash?: string) => {
  const payload: AgreementTokenPayload = {
    quote,
    acceptance: acceptance ?? undefined,
    hash,
  };
  return base64UrlEncode(JSON.stringify(payload));
};

export const parseAgreementToken = (token?: string | null): AgreementTokenPayload | null => {
  if (!token) return null;
  try {
    return JSON.parse(base64UrlDecode(token)) as AgreementTokenPayload;
  } catch (error) {
    console.error('Failed to parse agreement token', error);
    return null;
  }
};

export const buildSicarToken = (certificate: CertificateRecord, hash?: string) => {
  const payload: SicarTokenPayload = { certificate, hash };
  return base64UrlEncode(JSON.stringify(payload));
};

export const parseSicarToken = (token?: string | null): SicarTokenPayload | null => {
  if (!token) return null;
  try {
    return JSON.parse(base64UrlDecode(token)) as SicarTokenPayload;
  } catch (error) {
    console.error('Failed to parse sicar token', error);
    return null;
  }
};

export const buildQuoteAuthorityMeta = async (flow: RetailFlowState, token?: string): Promise<DocAuthorityMeta | null> => {
  const quote = flow.quote;
  if (!quote) return null;
  const usedToken = token || createResumeToken(quote);
  const reference = buildQuoteReference(quote);
  const hashFull = quote.quoteHash || (await computeQuoteHash(quote));
  const hashShort = shortenMiddle(hashFull);
  const supersedesHashFull = quote.priorQuoteHash;
  const resumeUrl = buildResumeUrl(quote, DOCUMENT_TYPES.QUOTE.defaultResumeStep as 'agreement' | 'payment' | 'schedule');
  const verificationUrl = `${window.location.origin}/verify?doc=QUOTE&t=${encodeURIComponent(usedToken)}`;
  return {
    docType: 'QUOTE',
    version: DOCUMENT_TYPES.QUOTE.docVersion,
    reference,
    issuedAtISO: quote.issuedAtISO || quote.issuedAt || quote.generatedAt || new Date().toISOString(),
    hashFull,
    hashShort,
    supersedesHashFull,
    supersedesHashShort: supersedesHashFull ? shortenMiddle(supersedesHashFull) : undefined,
    resumeUrl,
    resumeUrlDisplay: shortenMiddle(resumeUrl),
    verificationUrl,
  };
};

export const buildAgreementAuthorityMeta = async (
  flow: RetailFlowState,
  token?: string,
): Promise<DocAuthorityMeta | null> => {
  const quote = flow.quote;
  const acceptance = flow.agreementAcceptance;
  if (!quote) return null;
  const agreementHash = acceptance?.agreementHash || (await computeAgreementHash(quote, acceptance ?? undefined));
  const usedToken = token || buildAgreementToken(quote, acceptance, agreementHash);
  const reference = buildAgreementReference(quote);
  const hashShort = shortenMiddle(agreementHash);
  const resumeUrl = buildResumeUrl(
    quote,
    DOCUMENT_TYPES.AGREEMENT.defaultResumeStep as 'agreement' | 'payment' | 'schedule',
  );
  const verificationUrl = `${window.location.origin}/verify?doc=AGREEMENT&t=${encodeURIComponent(usedToken)}`;
  return {
    docType: 'AGREEMENT',
    version: DOCUMENT_TYPES.AGREEMENT.docVersion,
    reference,
    issuedAtISO:
      acceptance?.acceptedAt ||
      acceptance?.acceptanceDate ||
      quote.issuedAtISO ||
      quote.issuedAt ||
      quote.generatedAt ||
      new Date().toISOString(),
    hashFull: agreementHash,
    hashShort,
    supersedesHashFull: acceptance?.supersedesAgreementHash,
    supersedesHashShort: acceptance?.supersedesAgreementHash
      ? shortenMiddle(acceptance.supersedesAgreementHash)
      : undefined,
    quoteBinding: {
      ref: buildQuoteReference(quote),
      hashFull: quote.quoteHash || '',
      hashShort: shortenMiddle(quote.quoteHash),
    },
    resumeUrl,
    resumeUrlDisplay: shortenMiddle(resumeUrl),
    verificationUrl,
  };
};

export const buildSicarAuthorityMeta = async (sicarState: CertificateRecord, token?: string): Promise<DocAuthorityMeta> => {
  const reference = sicarState.quoteId || sicarState.agreementId || 'SICAR';
  const hashFull = token || '';
  const hashShort = hashFull ? shortenMiddle(hashFull) : 'pending';
  const usedToken = token || buildSicarToken(sicarState, hashFull);
  const verificationUrl = `${window.location.origin}/verify?doc=SICAR&t=${encodeURIComponent(usedToken)}`;
  return {
    docType: 'SICAR',
    version: DOCUMENT_TYPES.SICAR.docVersion,
    reference,
    issuedAtISO: (sicarState.acceptance?.signedAt as string) || sicarState.auditLog[0]?.timestamp || new Date().toISOString(),
    hashFull,
    hashShort,
    resumeUrl: `${window.location.origin}${DOCUMENT_TYPES.SICAR.printRoute}`,
    resumeUrlDisplay: shortenMiddle(`${window.location.origin}${DOCUMENT_TYPES.SICAR.printRoute}`),
    verificationUrl,
  };
};

export const parseDocumentToken = (docType: CanonicalDocumentType, token?: string | null) => {
  if (docType === 'QUOTE') return parseResumeToken(token ?? undefined);
  if (docType === 'AGREEMENT') return parseAgreementToken(token ?? undefined);
  return parseSicarToken(token ?? undefined);
};

export const restoreQuoteFromToken = (token?: string | null): QuoteContext | null => {
  const payload = parseResumeToken(token ?? undefined);
  return payload ? buildQuoteFromResumePayload(payload) : null;
};
