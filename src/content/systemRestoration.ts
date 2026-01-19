import { automationPlaybooks } from './automationPlaybooks';

export type LegacyMapping = {
  legacyItem: string;
  currentLocation: string;
  notes: string;
};

export type SystemInventory = {
  pages: string[];
  agreements: string[];
  systemLogic: string[];
  intakeJourneys: string[];
};

export type VerticalContent = {
  journeySteps: string[];
  agreements: string[];
  packageHighlights: string[];
  playbooks: typeof automationPlaybooks.homeSecurity;
};

export const systemInventory: SystemInventory = {
  pages: [
    'Holding Company Hub (/) and vertical portals',
    'Home Security (/home-security)',
    'Home Automation (/home-automation)',
    'Elder Care Tech (/elder-care-tech)',
    'HALO PERS (/halo)',
    'Operator SaaS (/operator)',
    'Package catalog (/packages, /packages/:id)',
    'Recommendation and quote journey (/recommend, /quote, /quoteReview)',
    'Agreement, deposit, and scheduling (/agreementReview, /payment, /schedule)',
    'Verification and certificates (/verify, /certificate)',
    'Health Homes program hub (/health-homes/*)',
    'Vendor onboarding (/vendors/*)',
    'HALO Launch experience (/halo/*)',
  ],
  agreements: [
    'Quote summary with hash verification',
    'Combined Agreement (review + print)',
    'Deposit acknowledgment and payment gate',
    'Installation scheduling request',
    'Certificate + verification flow',
    'Privacy policy and terms',
  ],
  systemLogic: [
    'Retail flow checkpoints stored in localStorage',
    'Document hash + resume tokens for recoverable journeys',
    'Deposit gating before scheduling unlocks',
    'UTM capture and routing telemetry',
    'Email payload composition for quote and agreement sharing',
  ],
  intakeJourneys: [
    'Retail intake → package match → quote → agreement → deposit → schedule',
    'Health Homes intake → package alignment → reporting readiness',
    'Vendor standards → evaluation → questionnaire → apply',
    'HALO setup → Test & Verified → support',
  ],
};

export const legacyMappings: LegacyMapping[] = [
  {
    legacyItem: 'Step001–Step003 Hub + Vertical segmentation',
    currentLocation: 'Holding company hub routes to each vertical portal in /home-security, /home-automation, /elder-care-tech, /halo, /operator',
    notes: 'Preserves hub-first navigation while keeping vertical subsites independent.',
  },
  {
    legacyItem: 'Core Functionality Workflow',
    currentLocation: 'Quote → Agreement → Deposit → Schedule → Verify',
    notes: 'Retail flow state persists locally with resumable links and hash verification.',
  },
  {
    legacyItem: 'Business Design Packages',
    currentLocation: 'Package catalog and detailed package intelligence under /packages',
    notes: 'BOMs, automation flows, and journey steps are bound to each tier.',
  },
  {
    legacyItem: 'Automation diagrams',
    currentLocation: 'Structured playbooks embedded in each vertical landing',
    notes: 'Converted to trigger/action/handoff playbooks.',
  },
];

export const verticalContent: Record<string, VerticalContent> = {
  homeSecurity: {
    journeySteps: [
      'Security consult intake and property profile',
      'Coverage design + tier match',
      'Quote and agreement confirmation',
      'Deposit capture and installation scheduling',
      'Install, verification, and homeowner handoff',
    ],
    agreements: [
      'Security coverage agreement',
      'Privacy-first, local data handling acknowledgement',
      'Offline Dignity Rule confirmation (local control stays available)',
      'Deposit and scheduling gate confirmation',
      'Verification summary and handoff record',
    ],
    packageHighlights: [
      'Security Basic: entry awareness, on-site lighting deterrence, and local siren response.',
      'Security Plus: expanded perimeter visibility with environmental hazard alerts.',
      'Security Pro: redundancy, system health assurance, and pro-grade local recording.',
      'No subscriptions sold; optional third-party monitoring can be added directly by the homeowner.',
      'Home Assistant remains the single dashboard for arming, sensors, lighting, and alerts.',
    ],
    playbooks: automationPlaybooks.homeSecurity,
  },
  homeAutomation: {
    journeySteps: [
      'Routine discovery + preference capture',
      'Automation blueprint + package match',
      'Quote and agreement confirmation',
      'Deposit capture and scheduling',
      'Install, calibration, and caregiver training',
    ],
    agreements: [
      'Automation scope agreement',
      'Home data handling + privacy controls',
      'Deposit and scheduling gate confirmation',
      'Post-install acceptance checklist',
    ],
    packageHighlights: [
      'Deterministic scenes and schedules',
      'Energy-aware automation sequences',
      'Local overrides and caregiver visibility',
    ],
    playbooks: automationPlaybooks.homeAutomation,
  },
  elderCare: {
    journeySteps: [
      'Caregiver intake + needs assessment',
      'Safety coverage and package fit',
      'Quote and agreement confirmation',
      'Deposit capture and scheduling',
      'Install, verification, and caregiver onboarding',
    ],
    agreements: [
      'Care support agreement',
      'Non-medical services disclosure',
      'Deposit and scheduling gate confirmation',
      'Verification + caregiver handoff summary',
    ],
    packageHighlights: [
      'Caregiver-grade alerts and check-ins',
      'Local-first monitoring cues',
      'Outcome-ready logging for program alignment',
    ],
    playbooks: automationPlaybooks.elderCare,
  },
  halo: {
    journeySteps: [
      'Launch checklist and contact intake',
      'Test & Verified documentation',
      'Support readiness and escalation practice',
      'Checkout confirmation (if enabled)',
    ],
    agreements: [
      'HALO launch terms + privacy',
      'Test & Verified attestation',
      'Support and escalation expectations',
    ],
    packageHighlights: [
      'Wearable signaling with local-first fallbacks',
      'Configured escalation pathways',
      'Plain-language caregiver verification',
    ],
    playbooks: automationPlaybooks.elderCare,
  },
};
