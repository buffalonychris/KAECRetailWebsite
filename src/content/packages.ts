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
    name: 'Security Basic',
    price: '$2,850 one-time',
    badge: 'Basic tier',
    tagline: 'Entry-ready protection with Home Assistant as the single dashboard.',
    oneLiner:
      'Core entry sensors, lighting, and alert routing that stays local-first and usable during outages.',
    bio:
      'Security Basic delivers deterrence, awareness, and immediate visibility without forcing cloud dependency.',
    idealFor: 'Condos, townhomes, and smaller footprints that need dependable entry coverage.',
    includes: [
      'Home Assistant controller as the single control surface',
      'Entry contacts and motion sensors tuned for doorways and hallways',
      'Two smart lighting circuits for entry and pathway lighting',
      'Smart lock with local PIN, key override, and offline control',
      'Indoor camera with local recording enabled',
      'Local siren with on-site arming/disarming',
      'Battery backup for controller and network gear',
    ],
    billOfMaterials: [
      'Home Assistant hub + local storage kit',
      'Door/window contacts + motion sensors',
      'Two smart lighting circuits + controller',
      'Smart lock + keypad',
      'Indoor camera with local storage',
      'Local siren',
      'UPS / battery backup for hub + router',
    ],
    automationFlows: [
      'Entry lighting behavior: turn on interior lights when a door opens after-hours.',
      'Perimeter breach response: trigger siren and local alerts when a verified entry occurs.',
      'Offline assurance: alarms, lights, and sensors continue without internet.',
    ],
    journeyFlow: [
      'Security consult intake',
      'Coverage design + package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + homeowner training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Privacy + local data handling disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification summary',
    ],
    differentiators: [
      'Home Assistant remains the only dashboard for local control',
      'No subscriptions sold; monitoring integrations are optional third-party',
      'Local control for arming, sensors, lights, and siren during outages',
    ],
  },
  {
    id: 'a2',
    name: 'Security Plus',
    price: '$4,950 one-time',
    badge: 'Plus tier',
    tagline: 'Expanded perimeter and environmental awareness with local-first control.',
    oneLiner:
      'Adds more coverage, video verification, and hazard sensing while staying offline-capable.',
    bio:
      'Security Plus broadens entry coverage and adds environmental hazard response for more complete household safety.',
    idealFor: 'Detached homes that need broader interior and exterior visibility.',
    includes: [
      'Everything in Security Basic',
      'Four additional smart lighting circuits for exterior and pathway coverage',
      'Video doorbell tied into Home Assistant',
      'Two additional cameras for interior or exterior coverage',
      'Water leak and smoke/CO sensors with local alerts',
      'Local video recording to supported storage (no cloud subscription required)',
    ],
    billOfMaterials: [
      'Basic hardware set',
      'Additional lighting circuits (x4)',
      'Video doorbell + two-way audio',
      'Indoor/outdoor cameras (x2)',
      'Water leak + smoke/CO sensor kit',
      'Local video storage expansion',
    ],
    automationFlows: [
      'Entry lighting behavior: brighten approach paths when motion is detected after dark.',
      'Perimeter breach response: confirm with door + camera events and notify household.',
      'Environmental hazard response: alert on leak or smoke/CO while sounding local siren.',
    ],
    journeyFlow: [
      'Security consult intake',
      'Coverage design + package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + homeowner training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Privacy + local storage disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification + maintenance checklist',
    ],
    differentiators: [
      'Single Home Assistant view for lights, locks, cameras, and alerts',
      'Offline-capable automations keep lighting, sensors, and sirens responsive',
      'No monthly fees for included capabilities',
    ],
  },
  {
    id: 'a3',
    name: 'Security Pro',
    price: '$7,750 one-time',
    badge: 'Pro tier',
    tagline: 'Full-property resilience with redundancy and system health assurance.',
    oneLiner:
      'Adds perimeter hardening, redundancy, and proactive system health monitoring.',
    bio:
      'Security Pro delivers the highest resilience with redundant recording, wider perimeter coverage, and system health assurance.',
    idealFor: 'Larger single-family homes or multi-unit footprints needing resilient coverage.',
    includes: [
      'Everything in Security Plus',
      'Professional-grade NVR for local multi-camera recording',
      'Four outdoor PoE cameras plus floodlight camera',
      'Whole-home siren + perimeter lighting escalation',
      'Cellular backup option for notifications when available',
      'On-site configuration session for advanced automations',
    ],
    billOfMaterials: [
      'Plus hardware set',
      'Professional-grade NVR + storage array',
      'Outdoor PoE camera bundle (x5)',
      'Whole-home siren + exterior lighting kit',
      'Cellular notification failover kit',
      'On-site configuration session',
    ],
    automationFlows: [
      'Entry lighting behavior: staged interior and exterior lighting for verified entry.',
      'Perimeter breach response: coordinated lights, siren, and camera capture.',
      'System health assurance: daily device heartbeat checks with local alerts.',
    ],
    journeyFlow: [
      'Security consult intake',
      'Coverage design + package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + homeowner training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Resilience + outage behavior disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification + coverage acceptance',
    ],
    differentiators: [
      'Prioritizes local processing; cloud is optional for remote reach',
      'Home Assistant remains the only control surface for the household',
      'System health monitoring keeps coverage verified without subscriptions',
    ],
  },
];
