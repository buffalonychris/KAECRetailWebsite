import { PackageTierId } from './pricing';

type HardwareItem = {
  name: string;
  quantity: number;
  note?: string;
};

export type HardwareCategory = {
  title: string;
  items: HardwareItem[];
};

export type HardwareGroup = {
  heading: string;
  categories: HardwareCategory[];
};

const baseHardware: Record<PackageTierId, HardwareCategory[]> = {
  A1: [
    {
      title: 'Core controllers',
      items: [
        { name: 'Home Assistant hub with local storage', quantity: 1 },
        { name: 'Network switch / PoE injector', quantity: 1 },
      ],
    },
    {
      title: 'Lighting and scenes',
      items: [
        { name: 'Smart switches or dimmers', quantity: 4 },
        { name: 'Scene buttons', quantity: 2 },
        { name: 'Smart plugs', quantity: 3 },
      ],
    },
    {
      title: 'Room sensing',
      items: [{ name: 'Occupancy sensors', quantity: 3 }],
    },
  ],
  A2: [
    {
      title: 'Core controllers',
      items: [
        { name: 'Home Assistant hub with local storage', quantity: 1 },
        { name: 'Network switch / PoE injector', quantity: 1 },
        { name: 'Battery backup for hub', quantity: 1 },
      ],
    },
    {
      title: 'Lighting and scenes',
      items: [
        { name: 'Smart switches or dimmers', quantity: 6 },
        { name: 'Scene buttons', quantity: 3 },
        { name: 'Smart plugs', quantity: 4 },
      ],
    },
    {
      title: 'Room sensing',
      items: [
        { name: 'Occupancy sensors', quantity: 5 },
        { name: 'Presence sensors', quantity: 2 },
        { name: 'Ambient light sensors', quantity: 2 },
      ],
    },
    {
      title: 'Climate and energy',
      items: [
        { name: 'Smart thermostat or HVAC bridge', quantity: 1 },
        { name: 'Energy monitoring module', quantity: 1 },
      ],
    },
  ],
  A3: [
    {
      title: 'Core controllers',
      items: [
        { name: 'Home Assistant hub with redundant storage', quantity: 1 },
        { name: 'Managed PoE switch', quantity: 1 },
        { name: 'Battery backup for automation controllers', quantity: 2 },
      ],
    },
    {
      title: 'Lighting and scenes',
      items: [
        { name: 'Smart switches or dimmers', quantity: 10 },
        { name: 'Scene buttons', quantity: 4 },
        { name: 'Smart plugs', quantity: 6 },
      ],
    },
    {
      title: 'Room sensing',
      items: [
        { name: 'Occupancy sensors', quantity: 7 },
        { name: 'Presence sensors', quantity: 4 },
        { name: 'Ambient light sensors', quantity: 4 },
      ],
    },
    {
      title: 'Climate and energy',
      items: [
        { name: 'Smart thermostat or HVAC bridge', quantity: 2 },
        { name: 'Energy monitoring module', quantity: 2 },
        { name: 'Multi-zone controllers', quantity: 2 },
      ],
    },
  ],
};

const addOnHardware: Record<string, HardwareCategory[]> = {
  'smart-switches': [
    {
      title: 'Lighting and scenes',
      items: [{ name: 'Additional smart switches or dimmers', quantity: 2 }],
    },
  ],
  'smart-plugs': [
    {
      title: 'Lighting and scenes',
      items: [{ name: 'Smart plugs', quantity: 2 }],
    },
  ],
  'simple-sensors': [
    {
      title: 'Room sensing',
      items: [{ name: 'Occupancy sensors', quantity: 2 }],
    },
  ],
  'scene-buttons': [
    {
      title: 'Lighting and scenes',
      items: [{ name: 'Scene buttons', quantity: 2 }],
    },
  ],
  'presence-aware': [
    {
      title: 'Room sensing',
      items: [{ name: 'Presence sensors', quantity: 2 }],
    },
  ],
  'adaptive-lighting': [
    {
      title: 'Room sensing',
      items: [{ name: 'Ambient light sensors', quantity: 2 }],
    },
  ],
  'energy-awareness': [
    {
      title: 'Climate and energy',
      items: [{ name: 'Energy monitoring module', quantity: 1 }],
    },
  ],
  'climate-optimization': [
    {
      title: 'Climate and energy',
      items: [{ name: 'Thermostat sensor kit', quantity: 1 }],
    },
  ],
  'multi-zone': [
    {
      title: 'Climate and energy',
      items: [{ name: 'Multi-zone controllers', quantity: 1 }],
    },
  ],
  'advanced-rules': [
    {
      title: 'Core controllers',
      items: [{ name: 'Advanced automation configuration session', quantity: 1 }],
    },
  ],
  'energy-management': [
    {
      title: 'Climate and energy',
      items: [{ name: 'Energy management controller', quantity: 1 }],
    },
  ],
  'specialty-spaces': [
    {
      title: 'Lighting and scenes',
      items: [{ name: 'Specialty space automation kit', quantity: 1 }],
    },
  ],
};

const mergeHardware = (categories: HardwareCategory[]): HardwareCategory[] => {
  const map = new Map<string, HardwareItem[]>();

  categories.forEach((category) => {
    const existing = map.get(category.title) ?? [];
    const mergedItems = [...existing];

    category.items.forEach((item) => {
      const found = mergedItems.find((existingItem) => existingItem.name === item.name);
      if (found) {
        found.quantity += item.quantity;
      } else {
        mergedItems.push({ ...item });
      }
    });

    map.set(category.title, mergedItems);
  });

  return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
};

const toHardwareMap = (categories: HardwareCategory[]) => {
  const byTitle = new Map<string, Map<string, number>>();

  categories.forEach((category) => {
    const existing = byTitle.get(category.title) ?? new Map<string, number>();
    category.items.forEach((item) => {
      existing.set(item.name, (existing.get(item.name) ?? 0) + item.quantity);
    });
    byTitle.set(category.title, existing);
  });

  return byTitle;
};

const diffHardware = (base: HardwareCategory[], target: HardwareCategory[]): HardwareCategory[] => {
  const baseMap = toHardwareMap(base);
  const result: HardwareCategory[] = [];

  target.forEach((category) => {
    const baseItems = baseMap.get(category.title) ?? new Map<string, number>();
    const additions: HardwareItem[] = [];

    category.items.forEach((item) => {
      const delta = item.quantity - (baseItems.get(item.name) ?? 0);
      if (delta > 0) additions.push({ ...item, quantity: delta });
    });

    if (additions.length) {
      result.push({ title: category.title, items: additions });
    }
  });

  return result;
};

const bronzeHardware = mergeHardware(baseHardware.A1);
const silverTotal = mergeHardware(baseHardware.A2);
const goldTotal = mergeHardware(baseHardware.A3);

const silverAdds = diffHardware(bronzeHardware, silverTotal);
const silverRollup = mergeHardware([...bronzeHardware, ...silverAdds]);
const goldAdds = diffHardware(silverRollup, goldTotal);
const goldRollup = mergeHardware([...silverRollup, ...goldAdds]);

const buildHardwareGroups = (packageId: PackageTierId): HardwareGroup[] => {
  if (packageId === 'A1') {
    return [{ heading: 'Included Hardware', categories: bronzeHardware }];
  }

  if (packageId === 'A2') {
    return [
      { heading: 'Included from Basic', categories: bronzeHardware },
      { heading: 'Additional in Plus', categories: silverAdds },
    ];
  }

  return [
    { heading: 'Included from Basic + Plus', categories: silverRollup },
    { heading: 'Additional in Pro', categories: goldAdds },
  ];
};

export const getHardwareGroups = (
  packageId: PackageTierId,
  addOnIds: string[]
): HardwareGroup[] => {
  const groups = buildHardwareGroups(packageId);
  const extras = addOnIds.flatMap((id) => addOnHardware[id] ?? []);

  if (extras.length) {
    groups.push({ heading: 'Selected add-ons', categories: mergeHardware(extras) });
  }

  return groups;
};

export const getHardwareList = (
  packageId: PackageTierId,
  addOnIds: string[]
): HardwareCategory[] => {
  const base =
    packageId === 'A1' ? bronzeHardware : packageId === 'A2' ? silverRollup : goldRollup;
  const extras = addOnIds.flatMap((id) => addOnHardware[id] ?? []);
  return mergeHardware([...base, ...extras]);
};
