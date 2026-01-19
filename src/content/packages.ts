export type PackageTier = {
  id: string;
  name: string;
  badge?: string;
  price: string;
  tagline: string;
  oneLiner: string;
  bio: string;
  includes: string[];
  billOfMaterials: string[];
  automationFlows: string[];
  journeyFlow: string[];
  agreements: string[];
  differentiators: string[];
  idealFor: string;
};

export const packages: PackageTier[] = [
  {
    id: 'a1',
    name: 'Elder Tech Basic',
    price: '$2,850 one-time',
    badge: 'Basic tier',
    tagline: 'Night pathway safety, hazard awareness, and gentle check-ins with local-first dignity.',
    oneLiner:
      'Local lighting cues, hazard alerts, and missed-activity awareness that keep working offline.',
    bio:
      'Elder Tech Basic delivers quiet safety behaviors for aging-in-place households without default surveillance.',
    idealFor: 'Residents who want a safer night routine and caregivers who need calm, privacy-first updates.',
    includes: [
      'Home Assistant controller as the single control surface',
      'Night pathway lighting kit for hallways and bathrooms',
      'Wireless motion sensors for key pathways',
      'Door contact for primary entry awareness',
      'Leak + temperature sensors for kitchen and bath hazards',
      'Local chime or voice check-in prompt device',
      'Secure local network configuration with caregiver roles',
    ],
    billOfMaterials: [
      'Home Assistant hub + local storage kit',
      'Night pathway lighting kit',
      'Wireless motion sensors',
      'Door contact sensor',
      'Leak + temperature sensors',
      'Local check-in prompt device',
      'Local network configuration + device pairing',
    ],
    automationFlows: [
      'What your home does: low-glare night lighting, hazard alerts, and gentle missed-activity cues.',
      'Works without internet: lighting cues, sensor triggers, and local alerts continue on-site (power permitting).',
      'Cameras are optional and off by default.',
    ],
    journeyFlow: [
      'Caregiver consult intake',
      'Safety walkthrough + package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + caregiver training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Non-medical services disclosure',
      'Privacy-first local data handling disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification + caregiver handoff summary',
    ],
    differentiators: [
      'Home Assistant remains the only dashboard for resident and caregiver access',
      'No subscriptions sold; optional third-party services are contracted directly',
      'Offline Dignity Rule: core safety behaviors keep running locally during outages',
    ],
  },
  {
    id: 'a2',
    name: 'Elder Tech Plus',
    price: '$4,950 one-time',
    badge: 'Plus tier',
    tagline: 'Routine-aware support, door usage awareness, and privacy-first caregiver summaries.',
    oneLiner:
      'Adds routine deviation detection, door awareness, and caregiver-ready summaries without surveillance.',
    bio:
      'Elder Tech Plus adds routine intelligence and shared visibility while keeping signals local and dignified.',
    idealFor: 'Families who want routine-aware reassurance and respectful visibility across caregivers.',
    includes: [
      'Everything in Elder Tech Basic',
      'Additional motion and presence sensors for routine awareness',
      'Door usage awareness for primary exits',
      'Privacy-first caregiver summary dashboard setup',
      'Expanded hazard sensor coverage',
      'Role-based access configuration for shared caregivers',
    ],
    billOfMaterials: [
      'Basic hardware set',
      'Presence sensors for core rooms',
      'Door contact sensors',
      'Caregiver summary dashboard configuration',
      'Additional hazard sensors',
      'Role-based access configuration',
    ],
    automationFlows: [
      'What your home does: routine deviation detection, door usage awareness, and caregiver summaries.',
      'Works without internet: routine alerts and lighting cues run locally; summaries sync when back online.',
      'Cameras are optional and off by default.',
    ],
    journeyFlow: [
      'Caregiver consult intake',
      'Routine mapping + package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + caregiver training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Non-medical services disclosure',
      'Privacy-first local execution disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification + caregiver summary checklist',
    ],
    differentiators: [
      'Single Home Assistant view for resident and caregiver dashboards',
      'Offline-capable routines keep core alerts and lighting responsive',
      'No monthly fees for included capabilities',
    ],
  },
  {
    id: 'a3',
    name: 'Elder Tech Pro',
    price: '$7,750 one-time',
    badge: 'Pro tier',
    tagline: 'Multi-signal correlation, adaptive escalation, and advanced guardrails.',
    oneLiner:
      'Adds multi-signal correlation and adaptive escalation for complex caregiving needs.',
    bio:
      'Elder Tech Pro blends multiple safety signals into a reliable, privacy-first escalation ladder.',
    idealFor: 'Homes needing layered guardrails, shared caregiver teams, and advanced escalation logic.',
    includes: [
      'Everything in Elder Tech Plus',
      'Multi-signal correlation for motion, door, and hazard cues',
      'Adaptive escalation ladder with caregiver tiers',
      'Advanced guardrails for overnight and high-risk windows',
      'System health and battery backup tuning',
      'On-site configuration session for advanced caregiver workflows',
    ],
    billOfMaterials: [
      'Plus hardware set',
      'Additional motion, door, and hazard sensors',
      'UPS for Home Assistant and network gear',
      'Advanced escalation configuration session',
    ],
    automationFlows: [
      'What your home does: multi-signal correlation, adaptive escalation, and proactive safety guardrails.',
      'Works without internet: escalation ladders and local rules continue without cloud services.',
      'Cameras are optional and off by default.',
    ],
    journeyFlow: [
      'Caregiver consult intake',
      'Routine mapping + package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + caregiver training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Non-medical services disclosure',
      'Resilience + outage behavior disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification + caregiver escalation acceptance',
    ],
    differentiators: [
      'Prioritizes local processing; cloud context is optional for remote reach',
      'Home Assistant remains the only control surface for the household',
      'Advanced rules stay editable by the customer without subscriptions',
    ],
  },
];
