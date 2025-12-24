import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import haloContent from '../content/halo.json';

const HaloSetup = () => {
  const { setup } = haloContent;
  return (
    <div className="container section">
      <Seo title={setup.seo.title} description={setup.seo.description} />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ textAlign: 'center' }}>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            {setup.badge}
          </p>
          <h2 style={{ margin: 0 }}>{setup.title}</h2>
          <p style={{ maxWidth: 760, margin: '0.75rem auto 0' }}>
            {setup.intro}
          </p>
        </section>

        <section className="card" id="start">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{setup.checklist.title}</h3>
          <ul className="list">
            {setup.checklist.items.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{setup.after_setup.title}</h3>
          <p>{setup.after_setup.body}</p>
          <Link className="btn btn-primary" to={setup.after_setup.cta.href}>
            {setup.after_setup.cta.label}
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HaloSetup;
