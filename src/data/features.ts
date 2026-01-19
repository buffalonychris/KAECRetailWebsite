import { PackageTierId } from './pricing';

export type FeatureCategory = {
  title: string;
  items: string[];
};

export type FeatureGroup = {
  heading: string;
  categories: FeatureCategory[];
};

const basicFeatures: FeatureCategory[] = [
  {
    title: 'Schedules & Scenes',
    items: ['Time-based lighting and climate schedules', 'One-touch scenes for daily routines'],
  },
  {
    title: 'Local Control',
    items: [
      'Home Assistant as the single dashboard',
      'Manual overrides from wall controls and scene buttons',
    ],
  },
  {
    title: 'Offline Resilience',
    items: ['Local-first automations continue during internet outages when power is present'],
  },
];

const plusAdds: FeatureCategory[] = [
  {
    title: 'Presence-Aware Comfort',
    items: ['Room-level occupancy routines', 'Arrival, away, and sleep mode scenes'],
  },
  {
    title: 'Adaptive Lighting',
    items: ['Brightness and color temperature shifts by time and ambient light'],
  },
  {
    title: 'Energy Awareness',
    items: ['Circuit-level monitoring and usage insights', 'Energy-aware automation suggestions'],
  },
  {
    title: 'Offline Resilience',
    items: [
      'Local schedules and presence routines stay active without internet',
      'Graceful recovery after outages with stored scenes',
    ],
  },
];

const proAdds: FeatureCategory[] = [
  {
    title: 'Multi-Zone Orchestration',
    items: ['Room-to-room scene transitions', 'Zone-based lighting and climate coordination'],
  },
  {
    title: 'Advanced Automation',
    items: ['Layered conditions and fallback rules', 'Specialty space routines'],
  },
  {
    title: 'Resilience',
    items: ['Power-return recovery behaviors', 'Local execution health checks'],
  },
  {
    title: 'Offline Resilience',
    items: [
      'Local orchestration stays live with LAN-only control paths',
      'Redundant controller protection for critical routines',
    ],
  },
  {
    title: 'Ownership & Privacy',
    items: ['Home Assistant stays the homeowner-controlled platform', 'No cloud dependency for local control'],
  },
];

const addOnFeatures: Record<string, FeatureCategory[]> = {
  'smart-switches': [
    {
      title: 'Lighting Control',
      items: ['Expanded dimming and scene coverage'],
    },
  ],
  'smart-plugs': [
    {
      title: 'Device Control',
      items: ['Scheduled control for lamps and plug-in devices'],
    },
  ],
  'simple-sensors': [
    {
      title: 'Presence Signals',
      items: ['Expanded occupancy triggers for routines'],
    },
  ],
  'scene-buttons': [
    {
      title: 'Scene Control',
      items: ['One-touch scenes for daily routines'],
    },
  ],
  'presence-aware': [
    {
      title: 'Presence Accuracy',
      items: ['Room-level detection for responsive routines'],
    },
  ],
  'adaptive-lighting': [
    {
      title: 'Adaptive Lighting',
      items: ['Automatic brightness and color temperature tuning'],
    },
  ],
  'energy-awareness': [
    {
      title: 'Energy Insights',
      items: ['Circuit-level monitoring with reporting'],
    },
  ],
  'climate-optimization': [
    {
      title: 'Climate Optimization',
      items: ['Zone-aware comfort settings with optional weather context'],
    },
  ],
  'multi-zone': [
    {
      title: 'Multi-Zone Control',
      items: ['Room-grouped scenes and transitions'],
    },
  ],
  'advanced-rules': [
    {
      title: 'Automation Depth',
      items: ['Layered logic and fallback rules'],
    },
  ],
  'energy-management': [
    {
      title: 'Energy Management',
      items: ['Load management with optional utility-rate context'],
    },
  ],
  'specialty-spaces': [
    {
      title: 'Specialty Spaces',
      items: ['Custom automations for outdoor, media, or wellness zones'],
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
    return [{ heading: 'Included Features', categories: mergeFeatures(basicFeatures) }];
  }

  if (packageId === 'A2') {
    return [
      { heading: 'Included from Basic', categories: mergeFeatures(basicFeatures) },
      { heading: 'Additional in Plus', categories: mergeFeatures(plusAdds) },
    ];
  }

  return [
    {
      heading: 'Included from Basic + Plus',
      categories: mergeFeatures([...basicFeatures, ...plusAdds]),
    },
    { heading: 'Additional in Pro', categories: mergeFeatures(proAdds) },
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
