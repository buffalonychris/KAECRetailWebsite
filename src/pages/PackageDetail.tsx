import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getPackages } from '../content/packages';
import TierBadge from '../components/TierBadge';
import { PackageTierId } from '../data/pricing';
import { siteConfig } from '../config/site';
import { resolveVertical } from '../lib/verticals';

const PackageDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const vertical = resolveVertical(searchParams.get('vertical'));
  const packageList = getPackages(vertical);
  const pkg = packageList.find((item) => item.id === id);
  const verticalQuery = vertical === 'home-security' ? '?vertical=home-security' : '';

  if (!pkg) {
    return (
      <div className="container section">
        <h2>Package not found</h2>
        <p>Please return to the packages page.</p>
        <Link className="btn btn-primary" to={`/packages${verticalQuery}`}>
          Back to packages
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <Link to={`/packages${verticalQuery}`} className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        Back to packages
      </Link>
      <div className="card" aria-label={`${pkg.name} details`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <TierBadge
              tierId={(pkg.id.toUpperCase() as PackageTierId) ?? 'A1'}
              labelOverride={pkg.badge ?? undefined}
              vertical={vertical}
            />
            <h2 style={{ margin: 0 }}>{pkg.name}</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>{pkg.tagline}</p>
            <p style={{ maxWidth: 720 }}>{pkg.oneLiner}</p>
            <p style={{ fontWeight: 700, color: '#fff7e6' }}>
              {vertical === 'home-security' ? 'Who it is for' : 'Ideal for'}: {pkg.idealFor}
            </p>
            {pkg.typicalCoverage && (
              <p style={{ fontWeight: 700, color: '#fff7e6' }}>
                Typical coverage: {pkg.typicalCoverage}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--kaec-gold)' }}>{pkg.price}</div>
            <small style={{ color: 'var(--kaec-muted)' }}>One-time upfront cost</small>
          </div>
        </div>
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Package bio</h3>
          <p style={{ margin: 0, color: '#c8c0aa' }}>{pkg.bio}</p>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>
            {vertical === 'home-security' ? "What's included (plain-English)" : 'Included equipment + setup'}
          </h3>
          <ul className="list">
            {pkg.includes.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {vertical !== 'home-security' && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Bill of materials (BOM)</h3>
            <ul className="list">
              {pkg.billOfMaterials.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Differentiators</h3>
          <ul className="list">
            {pkg.differentiators.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>
            {vertical === 'home-security' ? 'What your system can and will do' : 'Automation flows'}
          </h3>
          <ul className="list">
            {pkg.automationFlows.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Intake → delivery journey</h3>
          <ul className="list">
            {pkg.journeyFlow.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Agreement + deposit checkpoints</h3>
          <ul className="list">
            {pkg.agreements.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
            <li>
              <span />
              <span>
                Deposit policy:{' '}
                {siteConfig.depositPolicy.type === 'flat'
                  ? `Flat $${siteConfig.depositPolicy.value}`
                  : `${siteConfig.depositPolicy.value * 100}% of the deterministic total`}
              </span>
            </li>
          </ul>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/contact">
            Ask about this package
          </Link>
          <Link
            className="btn btn-secondary"
            to={vertical === 'home-security' ? '/reliability?vertical=home-security' : '/reliability'}
          >
            Learn about offline readiness
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
