import { Link } from 'react-router-dom';
import type { PackageTier } from '../content/packages';
import TierBadge from './TierBadge';
import { PackageTierId } from '../data/pricing';

type Props = {
  pkg: PackageTier;
};

const PackageCard = ({ pkg }: Props) => {
  const tierId = pkg.id.toUpperCase() as PackageTierId;
  return (
    <div className="card" aria-label={`${pkg.name} package`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <TierBadge tierId={tierId} labelOverride={pkg.badge ?? undefined} />
          <h3 style={{ margin: 0, color: '#fff7e6' }}>{pkg.name}</h3>
          <div style={{ color: 'var(--kaec-muted)' }}>{pkg.tagline}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--kaec-gold)' }}>
            {pkg.price}
          </div>
          <small style={{ color: 'var(--kaec-muted)' }}>One-time upfront</small>
        </div>
      </div>
      <p style={{ marginTop: '1rem', color: '#e6ddc7' }}>{pkg.oneLiner}</p>
      <ul className="list" aria-label="Included features">
        {pkg.includes.map((item) => (
          <li key={item}>
            <span />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <Link className="btn btn-primary" to={`/packages/${pkg.id}`} aria-label={`View ${pkg.name} details`}>
          View details
        </Link>
        <Link className="btn btn-secondary" to="/contact" aria-label="Talk to us about this package">
          Talk to us
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
