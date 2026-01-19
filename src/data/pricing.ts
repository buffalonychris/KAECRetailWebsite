export type PackageTierId = 'A1' | 'A2' | 'A3';

export type PackagePricing = {
  id: PackageTierId;
  name: string;
  basePrice: number;
  summary: string;
};

export type AddOn = {
  id: string;
  label: string;
  tier: 'Low' | 'Mid' | 'High';
  price: number;
  description: string;
};

export const packagePricing: PackagePricing[] = [
  {
    id: 'A1',
    name: 'Automation Basic',
    basePrice: 2850,
    summary: 'Foundational schedules and scenes with local-first control and offline continuity.',
  },
  {
    id: 'A2',
    name: 'Automation Plus',
    basePrice: 4950,
    summary: 'Presence-aware routines, adaptive lighting, and energy awareness without cloud dependence.',
  },
  {
    id: 'A3',
    name: 'Automation Pro',
    basePrice: 7750,
    summary: 'Multi-zone orchestration, resilience, and advanced rule depth for complex homes.',
  },
];

const tierLabels: Record<PackageTierId, string> = {
  A1: 'Automation Basic',
  A2: 'Automation Plus',
  A3: 'Automation Pro',
};

const tierBadgeClass: Record<PackageTierId, string> = {
  A1: 'tier-badge-bronze',
  A2: 'tier-badge-silver',
  A3: 'tier-badge-gold',
};

export const getTierLabel = (tier: PackageTierId): string => tierLabels[tier];

export const getTierBadgeClass = (tier: PackageTierId): string => tierBadgeClass[tier];

export const addOns: AddOn[] = [
  {
    id: 'smart-switches',
    label: 'Smart switches & dimmers upgrade',
    tier: 'Low',
    price: 320,
    description: 'Upgrades key rooms with tactile lighting control and reliable scenes. Install complexity: Light.',
  },
  {
    id: 'smart-plugs',
    label: 'Smart plugs for lamps & devices',
    tier: 'Low',
    price: 180,
    description: 'Adds scheduled control for lamps and plug-in appliances with quick pairing. Install complexity: Light.',
  },
  {
    id: 'simple-sensors',
    label: 'Simple occupancy sensor kit',
    tier: 'Low',
    price: 260,
    description: 'Enables motion-based lighting and room awareness for core spaces. Install complexity: Light.',
  },
  {
    id: 'scene-buttons',
    label: 'Scene button kit',
    tier: 'Low',
    price: 220,
    description: 'Adds one-touch scene control for entries, bedrooms, and shared spaces. Install complexity: Light.',
  },
  {
    id: 'presence-aware',
    label: 'Presence-aware room detection',
    tier: 'Mid',
    price: 420,
    description: 'Improves room-level occupancy accuracy for routines that follow you. Install complexity: Medium.',
  },
  {
    id: 'adaptive-lighting',
    label: 'Adaptive lighting kit',
    tier: 'Mid',
    price: 390,
    description: 'Auto-adjusts brightness and color temperature based on time and ambient light. Install complexity: Medium.',
  },
  {
    id: 'energy-awareness',
    label: 'Energy awareness monitor',
    tier: 'Mid',
    price: 480,
    description: 'Highlights top circuits and usage patterns for smarter routines. Install complexity: Medium.',
  },
  {
    id: 'climate-optimization',
    label: 'Climate optimization pack',
    tier: 'Mid',
    price: 520,
    description:
      'Balances comfort with schedules and zone sensors; optional external context only (weather). Install complexity: Medium.',
  },
  {
    id: 'multi-zone',
    label: 'Multi-zone orchestration',
    tier: 'High',
    price: 760,
    description: 'Coordinates lighting and climate across floors or wings with shared scenes. Install complexity: Heavy.',
  },
  {
    id: 'advanced-rules',
    label: 'Advanced rule engine setup',
    tier: 'High',
    price: 880,
    description: 'Adds layered logic, fallbacks, and safety checks for complex automations. Install complexity: Heavy.',
  },
  {
    id: 'energy-management',
    label: 'Whole-home energy management',
    tier: 'High',
    price: 950,
    description:
      'Load balancing and peak management with optional external context only (utility rates). Install complexity: Heavy.',
  },
  {
    id: 'specialty-spaces',
    label: 'Specialty space automation',
    tier: 'High',
    price: 820,
    description: 'Custom scenes for outdoor, media, wellness, or workshop zones. Install complexity: Heavy.',
  },
];
