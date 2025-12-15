import { PackageTierId } from './pricing';

export type FeatureCategory = {
  title: string;
  items: string[];
};

export type FeatureGroup = {
  heading: string;
  categories: FeatureCategory[];
};

const bronzeFeatures: FeatureCategory[] = [
  {
    title: 'Safety & Response',
    items: [
      'Entry and motion alerts with local siren tones',
      'Smoke/CO listener announcements',
      'Emergency lighting cues near exits',
    ],
  },
  {
    title: 'Caregiver Visibility',
    items: [
      'Basic event history in Home Assistant',
      'Arrival/departure notifications for caregivers',
    ],
  },
  {
    title: 'Offline Resilience',
    items: ['Local-first automations continue during internet outages when power is present'],
  },
];

const silverAdds: FeatureCategory[] = [
  {
    title: 'Safety & Response',
    items: [
      'Coordinated lighting paths on alerts',
      'Indoor/outdoor camera motion snapshots (local)',
      'Automated check-in prompts via voice assistants',
    ],
  },
  {
    title: 'Caregiver Visibility',
    items: [
      'Secure remote access to live feeds',
      'Timeline of key events (doors, motion, water)',
      'Shared notification routing for family members',
    ],
  },
  {
    title: 'Home Monitoring',
    items: ['Leak notifications with room labels', 'Scene buttons for caregivers and residents'],
  },
  {
    title: 'Offline Resilience',
    items: [
      'Local storage for cameras and automations',
      'Battery-backed hub for graceful recovery after outages',
    ],
  },
];

const goldAdds: FeatureCategory[] = [
  {
    title: 'Safety & Response',
    items: [
      'Full-property alerting with zoned responses',
      'Perimeter video verification with local clips',
      'Redundant siren/voice paths for critical events',
    ],
  },
  {
    title: 'Caregiver Visibility',
    items: [
      'High-retention local recording for all cameras',
      'Private dashboards for family and professional caregivers',
      'Custom schedules for on-site and remote teams',
    ],
  },
  {
    title: 'Home Monitoring',
    items: [
      'Comprehensive leak and environment coverage',
      'Advanced automations for dusk/dawn and occupancy',
      'Garage/yard coverage for perimeter awareness',
    ],
  },
  {
    title: 'Offline Resilience',
    items: [
      'Redundant storage plus battery for controllers and cameras',
      'LAN-only control paths for safety routines when the internet is down',
    ],
  },
  {
    title: 'Video/Security',
    items: ['Local NVR with role-based sharing', 'Enhanced privacy zones and masking'],
  },
];

const addOnFeatures: Record<string, FeatureCategory[]> = {
  'extra-lighting': [
    {
      title: 'Convenience',
      items: ['Additional guided night lighting scenes'],
    },
  ],
  'additional-camera': [
    {
      title: 'Video/Security',
      items: ['Extended coverage zone with private recording'],
    },
  ],
  'water-leak-sensors': [
    {
      title: 'Home Monitoring',
      items: ['Expanded leak coverage for kitchens, laundry, and baths'],
    },
  ],
  'cellular-failover': [
    {
      title: 'Offline Resilience',
      items: ['Cellular notification path for critical alerts during outages'],
    },
  ],
  'onsite-training': [
    {
      title: 'Caregiver Visibility',
      items: ['Hands-on coaching for caregivers to use dashboards and automations'],
    },
  ],
};

const mergeFeatures = (categories: FeatureCategory[]): FeatureCategory[] => {
  const map = new Map<string, Set<string>>();

  categories.forEach((category) => {
    const existing = map.get(category.title) ?? new Set<string>();
    category.items.forEach((item) => existing.add(item));
    map.set(category.title, existing);
  });

  return Array.from(map.entries()).map(([title, items]) => ({ title, items: Array.from(items) }));
};

const buildGroups = (packageId: PackageTierId): FeatureGroup[] => {
  if (packageId === 'A1') {
    return [{ heading: 'Included Features', categories: mergeFeatures(bronzeFeatures) }];
  }

  if (packageId === 'A2') {
    return [
      { heading: 'Included from Bronze', categories: mergeFeatures(bronzeFeatures) },
      { heading: 'Additional in Silver', categories: mergeFeatures(silverAdds) },
    ];
  }

  return [
    {
      heading: 'Included from Bronze + Silver',
      categories: mergeFeatures([...bronzeFeatures, ...silverAdds]),
    },
    { heading: 'Additional in Gold', categories: mergeFeatures(goldAdds) },
  ];
};

export const getFeatureGroups = (
  packageId: PackageTierId,
  addOnIds: string[]
): FeatureGroup[] => {
  const groups = buildGroups(packageId);
  const extras = addOnIds.flatMap((id) => addOnFeatures[id] ?? []);

  if (extras.length) {
    groups.push({ heading: 'Selected add-ons', categories: mergeFeatures(extras) });
  }

  return groups;
};

export const getFeatureCategories = (
  packageId: PackageTierId,
  addOnIds: string[]
): FeatureCategory[] => {
  const groups = getFeatureGroups(packageId, addOnIds);
  const merged = groups.flatMap((group) => group.categories);
  return mergeFeatures(merged);
};
