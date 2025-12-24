import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const supportTiles = [
  {
    title: 'Run Test & Verified again',
    body: 'Re-run the verification test at a safe time for ongoing confidence.',
    href: '/halo/setup#start',
    isExternal: false,
  },
  {
    title: 'Update contacts',
    body: 'Update who gets notified and how.',
    href: '/halo/setup#start',
    isExternal: false,
  },
  {
    title: 'Troubleshooting',
    body: 'Fix common issues with plain-language steps, then re-test only what failed.',
    href: '#troubleshooting',
    isExternal: true,
  },
];

const troubleshootingTopics = [
  'Connection not ready',
  'Contact details incomplete',
  'SMS not delivered',
  'Email not delivered',
  'App notifications not delivered',
  'Voice check failed',
  'Pendant wearable not responding',
  'Wrist wearable not responding (if owned)',
  'Wall button not responding (if owned)',
];

const HaloSupport = () => {
  return (
    <div className="container section">
      <Seo
        title="Support — HALO PushButton"
        description="Re-run verification, update contacts, or troubleshoot."
      />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ textAlign: 'center' }}>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            HALO Support
          </p>
          <h2 style={{ margin: 0 }}>Support tools for HALO PushButton</h2>
          <p style={{ maxWidth: 760, margin: '0.75rem auto 0' }}>
            Re-run verification, update contacts, or walk through plain-language troubleshooting steps.
          </p>
        </section>

        <section className="card" aria-labelledby="support-tiles">
          <h3 id="support-tiles" style={{ marginTop: 0, color: '#fff7e6' }}>
            What would you like to do?
          </h3>
          <div className="card-grid">
            {supportTiles.map((tile) => (
              <div className="card" key={tile.title}>
                <h4 style={{ marginTop: 0, color: '#fff7e6' }}>{tile.title}</h4>
                <p>{tile.body}</p>
                {tile.isExternal ? (
                  <a className="btn btn-primary" href={tile.href}>
                    View steps
                  </a>
                ) : (
                  <Link className="btn btn-primary" to={tile.href}>
                    View steps
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="card" id="troubleshooting">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Troubleshooting topics</h3>
          <ul className="list">
            {troubleshootingTopics.map((topic) => (
              <li key={topic}>
                <span />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '1rem' }}>
            Troubleshooting content should map to Step019 Fix Screens (F01–F12) in implementation.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HaloSupport;
