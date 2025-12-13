import PackageCard from '../components/PackageCard';
import { packages } from '../content/packages';

const Packages = () => {
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
      </div>
      <div className="card-grid">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
};

export default Packages;
