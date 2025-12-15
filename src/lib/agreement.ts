import { addOns, packagePricing, PackageTierId } from '../data/pricing';
import { getHardwareList } from '../data/hardware';
import { getFeatureCategories } from '../data/features';
import { siteConfig } from '../config/site';
import { buildQuoteReference } from './quoteUtils';

export type QuoteContext = {
  customerName?: string;
  contact?: string;
  issuedAt?: string;
  emailIssuedAt?: string;
  emailTo?: string;
  emailSubject?: string;
  emailBody?: string;
  emailStatus?: 'not_sent' | 'issued' | 'draft_opened';
  city?: string;
  homeType?: string;
  homeSize?: string;
  internetReliability?: string;
  generatedAt?: string;
  packageId: PackageTierId;
  selectedAddOns: string[];
  pricing: {
    packagePrice: number;
    addOnTotal: number;
    total: number;
  };
  quoteHash?: string;
  priorQuoteHash?: string;
  quoteDocVersion?: string;
  quoteHashAlgorithm?: string;
};

export type AgreementContent = {
  header: {
    title: string;
    version: string;
    generatedDate: string;
  };
  customerSummary: string[];
  quoteSummary: {
    packageName: string;
    addOnLabels: string[];
    total: string;
  };
  installationCommitments: string[];
  validationSteps: string[];
  scope: string[];
  assumptions: string[];
  exclusions: string[];
  offlineBehavior: string;
  installationWindow: string;
  warrantyPlaceholders: string[];
  noMonthlyStatement: string;
  termsVersion: string;
  terms: string[];
  quoteBinding: {
    reference: string;
    quoteVersion: string;
    quoteHash?: string;
    priorQuoteHash?: string;
    total: string;
  };
  quoteAppendix: {
    packageName: string;
    addOnLabels: string[];
    hardwareSummary: string[];
    featureSummary: string[];
  };
};

const packageScope: Record<PackageTierId, string[]> = {
  A1: [
    'Deploy Home Assistant as the single control hub with secure local access.',
    'Install core safety sensors with caregiver alerts configured for the home layout.',
    'Provide guided handoff for basic automations tailored to the household.',
  ],
  A2: [
    'Expand lighting, cameras, and alerts to cover common living areas and entries.',
    'Enable local-first automations that keep notifications flowing when internet is spotty.',
    'Tune privacy zones and recording schedules aligned to caregiver preferences.',
  ],
  A3: [
    'Deliver whole-property coverage with redundancy and pro-grade storage applied.',
    'Optimize multi-room lighting, cameras, and sensors for senior safety pathways.',
    'Set up resilient automations with on-site data retention and backup checks.',
  ],
};

const addOnDeliverables: Record<string, string> = {
  'extra-lighting': 'Add a dedicated smart lighting circuit for safer nighttime navigation.',
  'additional-camera': 'Extend visual coverage with an additional indoor or outdoor camera.',
  'water-leak-sensors': 'Place a leak sensor multipack across kitchens, laundry, and baths.',
  'cellular-failover': 'Configure cellular notification failover to preserve caregiver alerts.',
  'onsite-training': 'Deliver an on-site training and handoff session for caregivers.',
};

const assumptions = [
  'Existing Wi-Fi and power are available where equipment is installed.',
  'Caregivers participate in basic configuration preferences during installation.',
  'Local-first design keeps automations running when internet is offline but power is available.',
];

const exclusions = [
  'No permitting, trenching, or structural work is included in this agreement.',
  'Cellular data plans are only added when explicitly selected and available in-market.',
  'This agreement does not provide medical advice, monitoring, or emergency response.',
];

const installationCommitments = [
  '1-day installation window coordinated with caregivers.',
  '2-person crew for coverage and safety.',
  'On-site setup and configuration of all listed equipment.',
  'Essential customer and caregiver training with hands-on walkthroughs.',
  'Post-install test and verification of alerts, automations, and access.',
  '1-year replacement warranty for all included equipment (retail placeholder copy).',
];

const validationSteps = [
  'Pre-flight check for Wi-Fi coverage and power at device locations.',
  'Confirm zoning for cameras and privacy preferences with caregivers.',
  'Verify notifications and automations continue to run during simulated internet outages.',
];

const terms = [
  'Non-medical and informational: KickAss Elder Care provides configuration and training only; we do not provide medical care or monitoring.',
  'Safety first: If there is an urgent safety issue, call 911 or local emergency services.',
  'Data handling: Local-first configuration is prioritized; any cloud connections are only enabled for selected services.',
  'Service boundaries: Warranty and service boundaries will be finalized in the KAEC backend signing package.',
  'Change management: Scope changes may adjust pricing and installation time after mutual agreement.',
  'Scheduling: Installation windows are coordinated with caregivers; exact times depend on site access.',
];

const currency = (amount: number) => `$${amount.toLocaleString()}`;

const buildScope = (context: QuoteContext) => {
  const base = packageScope[context.packageId] ?? packageScope.A2;
  const extras = context.selectedAddOns
    .map((id) => addOnDeliverables[id])
    .filter(Boolean) as string[];
  return [...base, ...extras];
};

const defaultQuote = (): QuoteContext => ({
  packageId: 'A2',
  selectedAddOns: [],
  pricing: {
    packagePrice: packagePricing.find((pkg) => pkg.id === 'A2')?.basePrice ?? 0,
    addOnTotal: 0,
    total: packagePricing.find((pkg) => pkg.id === 'A2')?.basePrice ?? 0,
  },
  quoteDocVersion: siteConfig.quoteDocVersion,
  quoteHashAlgorithm: siteConfig.quoteHashAlgorithm,
});

export const generateAgreement = (input?: QuoteContext): AgreementContent => {
  const context = input ?? defaultQuote();
  const packageInfo = packagePricing.find((pkg) => pkg.id === context.packageId) ?? packagePricing[0];
  const addOnLabels = addOns
    .filter((addOn) => context.selectedAddOns.includes(addOn.id))
    .map((addOn) => addOn.label);
  const hardwareSummary = getHardwareList(context.packageId, context.selectedAddOns)
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((category) => `${category.title}: ${category.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}`);
  const featureSummary = getFeatureCategories(context.packageId, context.selectedAddOns)
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((category) => `${category.title}: ${category.items.slice().sort().join('; ')}`);
  const quoteVersion = context.quoteDocVersion ?? siteConfig.quoteDocVersion;
  const agreementVersion = siteConfig.agreementDocVersion;
  const quoteReference = buildQuoteReference({ ...context, generatedAt: context.generatedAt });

  return {
    header: {
      title: 'KickAss Elder Care — Combined Agreement',
      version: agreementVersion,
      generatedDate: new Date().toISOString().slice(0, 10),
    },
    customerSummary: [
      context.customerName ? `Customer: ${context.customerName}` : 'Customer: Not provided',
      context.contact ? `Contact: ${context.contact}` : 'Contact: Not provided',
      context.city ? `City: ${context.city}` : 'City: Not provided',
    ].filter(Boolean),
    quoteSummary: {
      packageName: `${packageInfo.name} (${currency(packageInfo.basePrice)})`,
      addOnLabels: addOnLabels.length ? addOnLabels : ['No add-ons selected'],
      total: currency(context.pricing.total),
    },
    installationCommitments,
    validationSteps,
    scope: buildScope(context),
    assumptions,
    exclusions,
    offlineBehavior:
      'Offline-first behavior: Automations and local control are prioritized to function without internet. Alerts depend on available connectivity.',
    installationWindow:
      'Installation window: Coordinated with caregivers based on site readiness; no exact appointment is promised until scheduling is confirmed.',
    warrantyPlaceholders: [
      'Warranty placeholder: Final equipment and service warranty terms will be provided in the KAEC backend signing package.',
      'Service boundary placeholder: Support boundaries and response expectations will be documented in the final signing link.',
    ],
    noMonthlyStatement: 'Pricing is one-time for listed equipment, configuration, and training. No monthly subscriptions are required.',
    termsVersion: 'v1.0',
    terms,
    quoteBinding: {
      reference: quoteReference,
      quoteVersion,
      quoteHash: context.quoteHash,
      priorQuoteHash: context.priorQuoteHash,
      total: currency(context.pricing.total),
    },
    quoteAppendix: {
      packageName: `${packageInfo.name} (${currency(packageInfo.basePrice)})`,
      addOnLabels: addOnLabels.length ? addOnLabels : ['No add-ons selected'],
      hardwareSummary,
      featureSummary,
    },
  };
};

export default generateAgreement;
