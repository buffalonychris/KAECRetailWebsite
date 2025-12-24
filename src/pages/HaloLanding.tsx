import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import haloContent from '../content/halo.json';

const HaloLanding = () => {
  const { landing } = haloContent;
  return (
    <div className="container section">
      <Seo title={landing.seo.title} description={landing.seo.description} />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ textAlign: 'center' }}>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            {landing.badge}
          </p>
          <h2 style={{ margin: 0 }}>{landing.title}</h2>
          <p style={{ maxWidth: 760, margin: '0.75rem auto 0' }}>
            {landing.intro}
          </p>
        </section>

        <section className="card" aria-labelledby="halo-launch-links">
          <h3 id="halo-launch-links" style={{ marginTop: 0, color: '#fff7e6' }}>
            {landing.launch_essentials.title}
          </h3>
          <div className="card-grid">
            {landing.launch_essentials.items.map((item) => (
              <div className="card" key={item.title}>
                <h4 style={{ marginTop: 0, color: '#fff7e6' }}>{item.title}</h4>
                <p>{item.body}</p>
                <Link className={`btn btn-${item.variant}`} to={item.href}>
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{landing.package_cta.title}</h3>
          <p>{landing.package_cta.body}</p>
          <Link className="btn btn-secondary" to={landing.package_cta.href}>
            {landing.package_cta.label}
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HaloLanding;
