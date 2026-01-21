import { PackageTierId } from './pricing';

export type HomeSecurityComparisonRow = {
  feature: string;
  values: Record<PackageTierId, string>;
};

export const homeSecurityComparisonRows: HomeSecurityComparisonRow[] = [
  {
    feature: 'Hub runs locally (Home Assistant)',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'One dashboard for arming + alerts',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'Intrusion sensing',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'Motion awareness',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'Leak awareness',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'Local siren response',
    values: { A1: '✅', A2: '✅', A3: '✅' },
  },
  {
    feature: 'Doorbell coverage',
    values: { A1: '—', A2: '✅', A3: '✅' },
  },
  {
    feature: 'Indoor camera views',
    values: { A1: '—', A2: '✅', A3: '✅✅' },
  },
  {
    feature: 'Outdoor PoE reliability',
    values: { A1: '—', A2: '✅', A3: '✅✅' },
  },
  {
    feature: 'Dedicated local recording',
    values: { A1: '—', A2: '—', A3: '✅' },
  },
  {
    feature: 'Expandable for future coverage',
    values: { A1: '✅', A2: '✅', A3: '✅✅' },
  },
];
