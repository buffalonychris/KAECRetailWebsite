import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packages } from '../content/packages';
import { markFlowStep } from '../lib/retailFlow';

const Home = () => {
  useEffect(() => {
    markFlowStep('learn');
  }, []);

  return (
    <div className="container">
      <section className="hero">
        <div style={{ display: 'grid', gap: '1rem' }}>
          <span className="badge">Local-first elder care safety</span>
          <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#fff7e6' }}>
            One Home Assistant hub. One-time pricing. Confidence when the internet blinks.
          </h1>
          <p style={{ color: '#e6ddc7', fontSize: '1.1rem' }}>
            KickAss Elder Care packages keep lights, locks, and cameras responsive on-site even when
            the internet is down. No subscriptions. One plainspoken app: Home Assistant.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link className="btn btn-primary" to="/recommendation?guided=1&start=1">
              Start Guided Setup
            </Link>
            <Link className="btn btn-secondary" to="/packages">
              Browse packages
            </Link>
            <Link className="btn btn-secondary" to="/reliability">
              Offline reliability
            </Link>
          </div>
          <small style={{ color: '#c8c0aa' }}>
            Professional installation. One-time pricing. Offline-first Home Assistant setup.
          </small>
          <div className="hero-card" role="note">
            <strong style={{ color: '#fff7e6' }}>Bounded differentiator:</strong>{' '}
            Home Assistant is the only control platform we deploy. We configure it so on-site
            automations run locally with powered equipment even if connectivity drops.
          </div>
        </div>
        <div className="hero-card" aria-label="Key assurances">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Why families pick KickAss</h3>
          <ul className="list">
            <li>
              <span />
              <span>One app to learn: Home Assistant for every included device.</span>
            </li>
            <li>
              <span />
              <span>No monthly fees. Clear one-time package pricing.</span>
            </li>
            <li>
              <span />
              <span>Local automations keep running during internet outages.</span>
            </li>
            <li>
              <span />
              <span>Support for Reolink cameras where included, with local recording.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="packages-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="packages-heading">Packages built for elder safety</h2>
          <Link to="/comparison" className="btn btn-secondary">
            Compare tiers
          </Link>
        </div>
        <div className="card-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="badge">{pkg.badge ?? 'Package'}</span>
                  <h3 style={{ margin: '0.5rem 0', color: '#fff7e6' }}>{pkg.name}</h3>
                  <p style={{ margin: 0, color: '#c8c0aa' }}>{pkg.tagline}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: 'var(--kaec-gold)', fontSize: '1.25rem' }}>{pkg.price}</strong>
                  <small style={{ display: 'block', color: 'var(--kaec-muted)' }}>One-time cost</small>
                </div>
              </div>
              <p style={{ color: '#e6ddc7' }}>{pkg.oneLiner}</p>
              <Link className="btn btn-primary" to={`/packages/${pkg.id}`} aria-label={`View ${pkg.name}`}>
                View details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="local-heading">
        <h2 id="local-heading">Offline-first by design</h2>
        <div className="card-grid">
          <div className="card">
            <h4 style={{ marginTop: 0, color: '#fff7e6' }}>Local automations stay active</h4>
            <p>
              Lights, locks, and sensors keep following your automations while the internet is out as
              long as the devices have power. Remote viewing may pause, but on-site safety keeps
              running.
            </p>
          </div>
          <div className="card">
            <h4 style={{ marginTop: 0, color: '#fff7e6' }}>Home Assistant only</h4>
            <p>
              We standardize on Home Assistant as the single point of control. No juggling multiple
              apps or vendor portals.
            </p>
          </div>
          <div className="card">
            <h4 style={{ marginTop: 0, color: '#fff7e6' }}>Clear pricing</h4>
            <p>
              Every package is sold upfront with no mandatory subscriptions. Optional add-ons are
              scoped and quoted transparently.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
