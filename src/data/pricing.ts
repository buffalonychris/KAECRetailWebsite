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
    name: 'Security Basic',
    basePrice: 2850,
    summary: 'Entry-ready protection with local-first control and offline continuity.',
  },
  {
    id: 'A2',
    name: 'Security Plus',
    basePrice: 4950,
    summary: 'Expanded perimeter and environmental awareness with local alerts.',
  },
  {
    id: 'A3',
    name: 'Security Pro',
    basePrice: 7750,
    summary: 'Full-property resilience with redundancy and health assurance.',
  },
];

const tierLabels: Record<PackageTierId, string> = {
  A1: 'Security Basic',
  A2: 'Security Plus',
  A3: 'Security Pro',
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
    tier: 'Low',
    price: 350,
    description: 'Adds a dedicated pathway circuit and automatic entry lighting. Helps deter entry and prevent trips.',
  },
  {
    id: 'additional-camera',
    label: 'Additional camera (indoor or outdoor)',
    tier: 'Mid',
    price: 320,
    description: 'Extends local video coverage for driveways or common areas. Adds visibility without cloud dependence.',
  },
  {
    id: 'water-leak-sensors',
    label: 'Water leak sensor kit',
    tier: 'Low',
    price: 280,
    description: 'Local alerts for kitchens, laundry, and baths. Reduces damage from silent leaks.',
  },
  {
    id: 'cellular-failover',
    label: 'Cellular notification failover',
    tier: 'High',
    price: 540,
    description: 'Keeps alerts moving when the internet drops. Optional third-party cellular plan contracted directly.',
  },
  {
    id: 'onsite-training',
    label: 'On-site training and handoff',
    tier: 'Mid',
    price: 450,
    description: 'Guided session to fine-tune dashboards and automations. Ensures household confidence on day one.',
  },
];
