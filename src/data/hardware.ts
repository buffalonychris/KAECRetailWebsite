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

export const getHardwareList = (
  packageId: PackageTierId,
  addOnIds: string[]
): HardwareCategory[] => {
  const base = baseHardware[packageId] ?? [];
  const extras = addOnIds.flatMap((id) => addOnHardware[id] ?? []);
  return mergeHardware([...base, ...extras]);
};
