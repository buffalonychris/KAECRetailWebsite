import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const HaloLanding = () => {
  return (
    <div className="container section">
      <Seo
        title="HALO Launch — Reliable Elder Care"
        description="Launch guide for HALO PushButton owners: setup, support, privacy, and terms."
      />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ textAlign: 'center' }}>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            HALO Launch
          </p>
          <h2 style={{ margin: 0 }}>HALO PushButton launch hub</h2>
          <p style={{ maxWidth: 760, margin: '0.75rem auto 0' }}>
            Start here to set up your HALO PushButton, confirm verification, and review the plain-language
            privacy and terms pages for launch.
          </p>
        </section>

        <section className="card" aria-labelledby="halo-launch-links">
          <h3 id="halo-launch-links" style={{ marginTop: 0, color: '#fff7e6' }}>
            Launch essentials
          </h3>
          <div className="card-grid">
            <div className="card">
              <h4 style={{ marginTop: 0, color: '#fff7e6' }}>Setup</h4>
              <p>Follow the start checklist and verify contacts.</p>
              <Link className="btn btn-primary" to="/halo/setup">
                Go to setup
              </Link>
            </div>
            <div className="card">
              <h4 style={{ marginTop: 0, color: '#fff7e6' }}>Support</h4>
              <p>Re-run Test &amp; Verified or troubleshoot any issues.</p>
              <Link className="btn btn-primary" to="/halo/support">
                Get support
              </Link>
            </div>
            <div className="card">
              <h4 style={{ marginTop: 0, color: '#fff7e6' }}>Privacy</h4>
              <p>Review HALO privacy commitments in plain language.</p>
              <Link className="btn btn-primary" to="/halo/privacy">
                Read privacy
              </Link>
            </div>
            <div className="card">
              <h4 style={{ marginTop: 0, color: '#fff7e6' }}>Terms</h4>
              <p>Launch placeholder terms pending legal review.</p>
              <Link className="btn btn-primary" to="/halo/terms">
                Read terms
              </Link>
            </div>
          </div>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Need the full HALO experience?</h3>
          <p>
            HALO Pushbutton works as a standalone launch. For broader coverage, review the full
            Reliable Elder Care system.
          </p>
          <Link className="btn btn-secondary" to="/halo-package">
            Explore HALO Package
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HaloLanding;
