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
      title: 'Safety sensors',
      items: [
        { name: 'Door/entry contact sensors', quantity: 3 },
        { name: 'Motion detectors', quantity: 2 },
        { name: 'Smoke/CO listener', quantity: 1 },
      ],
    },
    {
      title: 'Voice and alerts',
      items: [
        { name: 'Voice assistant speakers', quantity: 2 },
        { name: 'Local-first alert tones', quantity: 1 },
      ],
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
      title: 'Safety sensors',
      items: [
        { name: 'Door/entry contact sensors', quantity: 5 },
        { name: 'Motion detectors', quantity: 3 },
        { name: 'Smoke/CO listener', quantity: 1 },
        { name: 'Water leak sensors', quantity: 2 },
      ],
    },
    {
      title: 'Lighting and audio',
      items: [
        { name: 'Smart lighting circuits', quantity: 2 },
        { name: 'Voice assistant speakers', quantity: 3 },
      ],
    },
    {
      title: 'Video and perimeter',
      items: [
        { name: 'Indoor cameras (local recording)', quantity: 2 },
        { name: 'Outdoor cameras (local recording)', quantity: 1 },
      ],
    },
  ],
  A3: [
    {
      title: 'Core controllers',
      items: [
        { name: 'Home Assistant hub with redundant storage', quantity: 1 },
        { name: 'Managed PoE switch', quantity: 1 },
        { name: 'Battery backup for hub and cameras', quantity: 2 },
      ],
    },
    {
      title: 'Safety sensors',
      items: [
        { name: 'Door/entry contact sensors', quantity: 8 },
        { name: 'Motion detectors', quantity: 4 },
        { name: 'Smoke/CO listener', quantity: 2 },
        { name: 'Water leak sensors', quantity: 4 },
      ],
    },
    {
      title: 'Lighting and audio',
      items: [
        { name: 'Smart lighting circuits', quantity: 3 },
        { name: 'Voice assistant speakers', quantity: 4 },
      ],
    },
    {
      title: 'Video and perimeter',
      items: [
        { name: 'Indoor cameras (local recording)', quantity: 3 },
        { name: 'Outdoor cameras (local recording)', quantity: 2 },
        { name: 'Local NVR storage', quantity: 1 },
      ],
    },
  ],
};

const addOnHardware: Record<string, HardwareCategory[]> = {
  'extra-lighting': [
    {
      title: 'Lighting and audio',
      items: [{ name: 'Additional smart lighting circuit', quantity: 1 }],
    },
  ],
  'additional-camera': [
    {
      title: 'Video and perimeter',
      items: [{ name: 'Additional camera (indoor/outdoor)', quantity: 1 }],
    },
  ],
  'water-leak-sensors': [
    {
      title: 'Safety sensors',
      items: [{ name: 'Extra water leak sensors', quantity: 3 }],
    },
  ],
  'cellular-failover': [
    {
      title: 'Connectivity resilience',
      items: [
        { name: 'Cellular notification modem', quantity: 1 },
        { name: 'Failover antenna kit', quantity: 1 },
      ],
    },
  ],
  'onsite-training': [
    {
      title: 'Training and handoff',
      items: [{ name: 'On-site caregiver training session', quantity: 1 }],
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
