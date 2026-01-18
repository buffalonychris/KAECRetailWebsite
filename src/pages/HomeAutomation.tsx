import { Link } from 'react-router-dom';

const HomeAutomation = () => {
  return (
    <div className="container section" style={{ display: 'grid', gap: '2.5rem' }}>
      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Home Automation Systems</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Smart routines for every room</h1>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Automation bundles that unify lighting, climate, and device control. Package details and pricing
          are TBD.
        </p>
      </section>

      <section className="card-grid" aria-label="Home automation tiers">
        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-bronze">Bronze</div>
          <h2 style={{ margin: 0 }}>Starter automation</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Core room routines: TBD</li>
            <li>Mobile control setup: TBD</li>
            <li>Device integrations: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>

        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-silver">Silver</div>
          <h2 style={{ margin: 0 }}>Whole-home comfort</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Expanded automation zones: TBD</li>
            <li>Energy optimization rules: TBD</li>
            <li>Voice control options: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>

        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-gold">Gold</div>
          <h2 style={{ margin: 0 }}>Premium automation suite</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Advanced scenes & scheduling: TBD</li>
            <li>Sensor-driven automation: TBD</li>
            <li>Custom dashboards: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>
      </section>

      <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Plan your automation roadmap</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Share your priorities and we will map the right tier and integrations. Equipment availability and
          timelines are TBD until assessment.
        </p>
        <div>
          <Link className="btn btn-secondary" to="/contact">
            Contact the team
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeAutomation;
