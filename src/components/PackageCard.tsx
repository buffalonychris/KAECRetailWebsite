import { Link } from 'react-router-dom';
import type { PackageTier } from '../content/packages';
import TierBadge from './TierBadge';
import { PackageTierId } from '../data/pricing';
import { VerticalKey } from '../lib/verticals';

type Props = {
  pkg: PackageTier;
  vertical?: VerticalKey;
  imageCaption?: string;
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

const PackageCard = ({ pkg, vertical, imageCaption, image }: Props) => {
  const tierId = pkg.id.toUpperCase() as PackageTierId;
  const verticalQuery = vertical === 'home-security' ? '?vertical=home-security' : '';
  const isMostPopular = vertical === 'home-security' && pkg.id === 'a2';
  const contactLink = vertical === 'home-security' ? `/contact?vertical=home-security&package=${pkg.id}` : '/contact';
  return (
    <div
      className={`card package-card${isMostPopular ? ' card-popular package-card--featured' : ''}`}
      aria-label={`${pkg.name} package`}
    >
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
              decoding="async"
            />
          </picture>
          <div className="package-card-media-overlay" aria-hidden="true" />
          {imageCaption ? <div className="package-card-caption">{imageCaption}</div> : null}
          {isMostPopular ? <div className="package-card-ribbon">Most popular</div> : null}
        </div>
      ) : null}
      <div className="package-card-body">
        <div className="package-card-header">
          <div className="package-card-intro">
            <div className="package-card-badges">
              <TierBadge tierId={tierId} labelOverride={pkg.badge ?? undefined} vertical={vertical} />
              {isMostPopular && <span className="popular-pill">Most popular</span>}
            </div>
            <h3 className="package-card-title">{pkg.name}</h3>
            <div className="package-card-tagline">{pkg.tagline}</div>
          </div>
          <div className="package-card-price">
            <div className="package-card-price-value">{pkg.price}</div>
            <small>One-time upfront</small>
          </div>
        </div>
        <div className="package-card-details">
          <p>{pkg.oneLiner}</p>
          <ul className="list" aria-label="Included features">
            {pkg.includes.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="package-card-actions">
          <Link
            className="btn btn-primary"
            to={`/packages/${pkg.id}${verticalQuery}`}
            aria-label={`View ${pkg.name} details`}
          >
            View details
          </Link>
          <Link className="btn btn-secondary" to={contactLink} aria-label="Talk to us about this package">
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
