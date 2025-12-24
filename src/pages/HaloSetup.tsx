import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const HaloSetup = () => {
  return (
    <div className="container section">
      <Seo
        title="Setup — HALO PushButton"
        description="Start the HALO PushButton launch checklist, confirm contacts, and complete Test & Verified."
      />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ textAlign: 'center' }}>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            HALO Setup
          </p>
          <h2 style={{ margin: 0 }}>Start your HALO PushButton launch</h2>
          <p style={{ maxWidth: 760, margin: '0.75rem auto 0' }}>
            Use this checklist to get set up, confirm contacts, and run Test &amp; Verified when it is safe.
          </p>
        </section>

        <section className="card" id="start">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Start checklist</h3>
          <ul className="list">
            <li>
              <span />
              <span>Place the pushbutton where it is easy to reach.</span>
            </li>
            <li>
              <span />
              <span>Add primary and backup contacts.</span>
            </li>
            <li>
              <span />
              <span>Confirm the device and contacts are ready before testing.</span>
            </li>
            <li>
              <span />
              <span>Run Test &amp; Verified at a safe time.</span>
            </li>
            <li>
              <span />
              <span>Review any add-ons you own.</span>
            </li>
          </ul>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>After setup</h3>
          <p>
            If anything fails during Test &amp; Verified, use the support steps to fix only what failed and re-test.
          </p>
          <Link className="btn btn-primary" to="/halo/support">
            Go to support
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HaloSetup;
