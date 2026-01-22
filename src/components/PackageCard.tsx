import { Link } from 'react-router-dom';
import type { PackageTier } from '../content/packages';
import TierBadge from './TierBadge';
import { PackageTierId } from '../data/pricing';
import { VerticalKey } from '../lib/verticals';

type Props = {
  pkg: PackageTier;
  vertical?: VerticalKey;
  image?: {
    alt: string;
    src: string;
    srcSet?: string;
    sizes?: string;
    sources?: Array<{
      type: string;
      srcSet: string;
    }>;
  };
};

const PackageCard = ({ pkg, vertical, image }: Props) => {
  const tierId = pkg.id.toUpperCase() as PackageTierId;
  const verticalQuery = vertical === 'home-security' ? '?vertical=home-security' : '';
  const isMostPopular = vertical === 'home-security' && pkg.id === 'a2';
  const contactLink = vertical === 'home-security' ? `/contact?vertical=home-security&package=${pkg.id}` : '/contact';
  return (
    <div className={`card package-card ${isMostPopular ? 'card-popular' : ''}`} aria-label={`${pkg.name} package`}>
      {image ? (
        <div className="package-card-media">
          <picture>
            {image.sources?.map((source) => (
              <source key={source.type} type={source.type} srcSet={source.srcSet} />
            ))}
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.sizes}
              alt={image.alt}
              loading="lazy"
            />
          </picture>
          <div className="package-card-media-overlay" aria-hidden="true" />
        </div>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <TierBadge tierId={tierId} labelOverride={pkg.badge ?? undefined} vertical={vertical} />
            {isMostPopular && <span className="popular-pill">Most popular</span>}
          </div>
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
        <Link
          className="btn btn-primary"
          to={`/packages/${pkg.id}${verticalQuery}`}
          aria-label={`View ${pkg.name} details`}
        >
          View details
        </Link>
        <Link
          className="btn btn-secondary"
          to={contactLink}
          aria-label="Talk to us about this package"
        >
          Talk to us
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
