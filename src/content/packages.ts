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
    name: 'Automation Basic',
    price: '$2,850 one-time',
    badge: 'Basic tier',
    tagline: 'Foundational schedules and scenes with Home Assistant as the single dashboard.',
    oneLiner:
      'Schedules, simple scenes, and local control that keep working even when the internet drops.',
    bio:
      'Automation Basic establishes reliable daily routines with wireless-first devices and local execution.',
    idealFor: 'Condos, townhomes, and smaller homes that want predictable routines without cloud lock-in.',
    includes: [
      'Home Assistant controller as the single control surface',
      'Wireless smart switches or dimmers for core lighting zones',
      'Smart plugs for lamps and plug-in devices',
      'Scene buttons for quick, on-wall routines',
      'Basic occupancy sensors for key rooms',
      'Local network configuration with secure household access',
    ],
    billOfMaterials: [
      'Home Assistant hub + local storage kit',
      'Smart switches/dimmers + scene buttons',
      'Smart plugs for lamps and appliances',
      'Occupancy sensors for primary rooms',
      'Local network configuration + device pairing',
    ],
    automationFlows: [
      'What your home does: scheduled lighting and climate scenes with simple one-touch routines.',
      'Works without internet: schedules, scenes, and local wall controls keep running (power permitting).',
      'No cloud required for local control of lights, scenes, or climate.',
    ],
    journeyFlow: [
      'Automation consult intake',
      'Routine mapping + package match',
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
      'No subscriptions sold; optional third-party services are contracted directly',
      'Offline Dignity Rule: core routines keep running locally during outages',
    ],
  },
  {
    id: 'a2',
    name: 'Automation Plus',
    price: '$4,950 one-time',
    badge: 'Plus tier',
    tagline: 'Presence-aware routines and adaptive lighting with local-first logic.',
    oneLiner:
      'Adds occupancy context, adaptive lighting, and energy awareness without cloud dependence.',
    bio:
      'Automation Plus deepens comfort by reacting to who is home, when rooms are used, and ambient light levels.',
    idealFor: 'Households that want routines to adapt to presence and time-of-day without manual toggling.',
    includes: [
      'Everything in Automation Basic',
      'Presence-aware room sensors for key zones',
      'Adaptive lighting logic tied to ambient light',
      'Smart thermostat or climate integration',
      'Energy monitoring for high-use circuits',
      'Scene automation for arrival, evening, and away modes',
    ],
    billOfMaterials: [
      'Basic hardware set',
      'Presence sensors for core rooms',
      'Ambient light sensors for adaptive scenes',
      'Smart thermostat or HVAC bridge',
      'Energy monitoring module',
      'Scene automation configuration',
    ],
    automationFlows: [
      'What your home does: presence-aware routines, adaptive lighting, and meaningful daily patterns.',
      'Works without internet: presence routines and adaptive lighting run locally with manual overrides.',
      'No cloud required for local control of lights, scenes, or climate.',
    ],
    journeyFlow: [
      'Automation consult intake',
      'Routine mapping + package match',
      'Quote + agreement',
      'Deposit gate',
      'Schedule + install',
      'Verification + homeowner training',
    ],
    agreements: [
      'Scope + deliverables agreement',
      'Privacy + local execution disclosure',
      'Deposit and scheduling acknowledgment',
      'Verification + maintenance checklist',
    ],
    differentiators: [
      'Single Home Assistant view for lights, climate, and scenes',
      'Offline-capable automations keep lighting and climate responsive',
      'No monthly fees for included capabilities',
    ],
  },
  {
    id: 'a3',
    name: 'Automation Pro',
    price: '$7,750 one-time',
    badge: 'Pro tier',
    tagline: 'Multi-zone orchestration with resilience and advanced rule depth.',
    oneLiner:
      'Adds whole-home orchestration, recovery behaviors, and advanced automations.',
    bio:
      'Automation Pro coordinates multiple zones, specialty spaces, and resilience behaviors for complex homes.',
    idealFor: 'Larger homes or enthusiasts who want advanced rules and multi-zone control.',
    includes: [
      'Everything in Automation Plus',
      'Multi-zone lighting and climate orchestration',
      'Advanced rule engine setup with layered conditions',
      'Resilience tuning for power-return recovery',
      'Specialty space scenes (outdoor, media, or wellness zones)',
      'On-site configuration session for advanced automations',
    ],
    billOfMaterials: [
      'Plus hardware set',
      'Additional multi-zone controllers',
      'UPS for automation controllers and network',
      'Specialty space scene kit',
      'Advanced automation configuration session',
    ],
    automationFlows: [
      'What your home does: multi-zone orchestration and layered routines across rooms and specialty spaces.',
      'Works without internet: local rule execution and recovery behaviors keep key scenes running.',
      'No cloud required for local control of lights, scenes, or climate.',
    ],
    journeyFlow: [
      'Automation consult intake',
      'Routine mapping + package match',
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
      'Prioritizes local processing; cloud context is optional for remote reach',
      'Home Assistant remains the only control surface for the household',
      'Advanced rules stay editable by the homeowner without subscriptions',
    ],
  },
];
