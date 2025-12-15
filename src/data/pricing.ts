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
  price: number;
  description: string;
};

export const packagePricing: PackagePricing[] = [
  {
    id: 'A1',
    name: 'Elder Care Bronze',
    basePrice: 2850,
    summary: 'Baseline safety with Home Assistant as the single control hub.',
  },
  {
    id: 'A2',
    name: 'Elder Care Silver',
    basePrice: 4950,
    summary: 'Expanded lighting, cameras, and alerts with local-first control.',
  },
  {
    id: 'A3',
    name: 'Elder Care Gold',
    basePrice: 7750,
    summary: 'Comprehensive coverage with redundancy and pro-grade storage.',
  },
];

const tierLabels: Record<PackageTierId, string> = {
  A1: 'Elder Care Bronze',
  A2: 'Elder Care Silver',
  A3: 'Elder Care Gold',
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
    id: 'extra-lighting',
    label: 'Extra smart lighting circuit',
    price: 350,
    description: 'Adds a dedicated pathway or night-lighting circuit.',
  },
  {
    id: 'additional-camera',
    label: 'Additional camera (indoor or outdoor)',
    price: 320,
    description: 'Extends visual coverage and recording zones.',
  },
  {
    id: 'water-leak-sensors',
    label: 'Water leak sensor kit',
    price: 280,
    description: 'Multipack of leak sensors for kitchens, laundry, and baths.',
  },
  {
    id: 'cellular-failover',
    label: 'Cellular notification failover',
    price: 540,
    description: 'Keeps caregiver alerts flowing during internet outages.',
  },
  {
    id: 'onsite-training',
    label: 'On-site training and handoff',
    price: 450,
    description: 'Guided session for caregivers to use dashboards and automations.',
  },
];
