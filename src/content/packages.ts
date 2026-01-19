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
    name: 'Elder Care Bronze',
    price: '$2,850 one-time',
    badge: 'Bronze tier',
    tagline: 'Baseline safety with Home Assistant as the single control hub.',
    oneLiner:
      'Entry package that keeps essential lights, locks, and alerts under one local-first system.',
    bio:
      'Bronze restores the essential safety backbone with a clean Home Assistant build, baseline sensors, and caregiver-friendly alerts.',
    idealFor: 'Condos, accessory units, and tight retrofit timelines.',
    includes: [
      'Home Assistant controller as the only app your family needs',
      'Keyed smart lock with local PIN and app control',
      'Two smart light circuits for night-path lighting',
      'Wi-Fi motion + door sensors for entry awareness',
      'Two indoor Wi-Fi cameras (local recording capable)',
      'Battery backup for controller and network gear',
    ],
    billOfMaterials: [
      'Home Assistant hub + local storage kit',
      'Door and motion sensor set',
      'Two smart lighting circuits + controller',
      'Smart lock + keypad',
      'Two indoor cameras with local storage',
      'UPS / battery backup for hub + router',
    ],
    automationFlows: [
      'Entry breach lighting escalation',
      'Night-path lighting schedule',
      'Caregiver alert routing with fallback contacts',
    ],
    journeyFlow: [
      'Caregiver intake',
      'Package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + caregiver training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Non-medical services disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification summary',
    ],
    differentiators: [
      'Runs locally during internet outages as long as power is available',
      'No subscriptions or monthly monitoring fees',
      'Caregiver-ready dashboard with secure remote access options',
    ],
  },
  {
    id: 'a2',
    name: 'Elder Care Silver',
    price: '$4,950 one-time',
    badge: 'Silver tier',
    tagline: 'Expanded safety coverage with guided check-ins and reliable video.',
    oneLiner:
      'Adds more lighting, cameras, and alerts so caregivers can spot issues quickly without extra apps.',
    bio:
      'Silver reintroduces expanded visibility, richer alerting, and environment sensing for broader homes and assisted living units.',
    idealFor: 'Detached homes and assisted-living units that need broader coverage.',
    includes: [
      'Everything in Elder Care Bronze',
      'Four additional smart light circuits for safer pathways',
      'Two-way video doorbell tied into Home Assistant',
      'Two more indoor cameras plus one outdoor camera',
      'Water leak and temperature sensors for early warnings',
      'Local video recording to supported storage (no cloud subscription required)',
    ],
    billOfMaterials: [
      'Bronze hardware set',
      'Additional lighting circuits (x4)',
      'Video doorbell + two-way audio',
      'Indoor/outdoor cameras (x3)',
      'Water leak and temperature sensors',
      'Local video storage expansion',
    ],
    automationFlows: [
      'Caregiver check-in ladder',
      'Leak + temperature alert routing',
      'Video clip capture with local storage',
    ],
    journeyFlow: [
      'Caregiver intake',
      'Package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + caregiver training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Privacy + local storage disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification + maintenance checklist',
    ],
    differentiators: [
      'Single Home Assistant view for lights, locks, cameras, and alerts',
      'Offline-capable automations keep lighting and locks responsive',
      'One-time purchase; no monthly fees for included features',
    ],
  },
  {
    id: 'a3',
    name: 'Elder Care Gold',
    price: '$7,750 one-time',
    badge: 'Gold tier',
    tagline: 'Full-property safety net with redundancy and professional-grade coverage.',
    oneLiner:
      'Adds exterior hardening, cellular failover options, and expanded storage for local reliability.',
    bio:
      'Gold reinstates maximum resilience with pro-grade recording, redundant storage, and advanced automation testing for larger footprints.',
    idealFor: 'Larger single-family homes or multi-unit footprints needing resilient coverage.',
    includes: [
      'Everything in Elder Care Silver',
      'Professional-grade Reolink NVR for local multi-camera recording',
      'Four outdoor PoE cameras plus floodlight camera',
      'Smart thermostat with caregiver alerts',
      'Cellular backup option for notifications when available',
      'On-site configuration session for custom automations',
    ],
    billOfMaterials: [
      'Silver hardware set',
      'Professional-grade NVR + storage array',
      'Outdoor PoE camera bundle (x5)',
      'Smart thermostat + caregiver alerting',
      'Cellular notification failover kit',
      'On-site configuration session',
    ],
    automationFlows: [
      'Perimeter deterrence lighting loop',
      'Redundant alert routing with cellular fallback',
      'Whole-home safety scenes with backup verification',
    ],
    journeyFlow: [
      'Caregiver intake',
      'Package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + caregiver training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Resilience + outage behavior disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification + coverage acceptance',
    ],
    differentiators: [
      'Prioritizes local processing; cloud is optional for remote reach',
      'Home Assistant remains the only control surface for family and staff',
      'Clear, one-time pricing with no required subscriptions',
    ],
  },
];
