import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import ComparisonLadder from '../components/ComparisonLadder';
import { packages } from '../content/packages';
import { markFlowStep } from '../lib/retailFlow';

const Packages = () => {
  useEffect(() => {
    markFlowStep('select');
  }, []);

  return (
    <div className="container section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            One-time pricing only
          </p>
          <h2 style={{ margin: 0 }}>Choose the KickAss package that fits</h2>
          <p style={{ maxWidth: 640 }}>
            Every tier is delivered with Home Assistant as the single control surface. Pricing is
            upfront—no subscriptions required for included capabilities.
          </p>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem', justifyItems: 'end' }}>
          <Link className="btn btn-primary" to="/quote">
            Build my quote
          </Link>
          <small style={{ color: '#c8c0aa' }}>Pro install, offline-first setup, transparent pricing.</small>
        </div>
      </div>
      <div className="card-grid">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <ComparisonLadder />
    </div>
  );
};

export default Packages;
