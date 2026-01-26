import { PackageTierId } from './pricing';

export type HomeSecurityComparisonRow = {
  feature: string;
  values: Record<PackageTierId, string>;
};

export const homeSecurityComparisonRows: HomeSecurityComparisonRow[] = [
  {
    feature: 'Local-first operation (LAN required)',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'One dashboard for arming + alerts',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'Local recording host',
    values: { A1: 'CloudKey+', A2: 'CloudKey+', A3: 'Dedicated UNVR + HDDs' },
  },
  {
    feature: 'Indoor camera views',
    values: { A1: '1', A2: '2', A3: '2–3' },
  },
  {
    feature: 'Outdoor/Doorbell cameras',
    values: { A1: '1', A2: '1 (PoE)', A3: '2 (PoE)' },
  },
  {
    feature: 'Door/Window sensors',
    values: { A1: '2–4', A2: '4–6', A3: '6–10' },
  },
  {
    feature: 'Motion sensors',
    values: { A1: '1', A2: '2', A3: '3' },
  },
  {
    feature: 'Leak/Smoke sensors',
    values: { A1: '1', A2: '2', A3: '3' },
  },
  {
    feature: 'Local siren/chime',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'Expandable for future coverage',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
];
