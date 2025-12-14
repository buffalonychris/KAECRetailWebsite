export type DepositPolicy =
  | { type: 'percentage'; value: number; note: string }
  | { type: 'flat'; value: number; note: string };

type SiteConfig = {
  enableAiApiNarrative: boolean;
  enableMockPayments: boolean;
  depositPolicy: DepositPolicy;
  quoteDocVersion: string;
  quoteHashAlgorithm: string;
};

export const siteConfig: SiteConfig = {
  enableAiApiNarrative: false,
  enableMockPayments: true,
  depositPolicy: {
    type: 'percentage',
    value: 0.3,
    note: 'Default deposit uses 30% of the deterministic total; swap to flat with type: "flat" and value in USD.',
  },
  quoteDocVersion: 'v1.0',
  quoteHashAlgorithm: 'SHA-256',
};
