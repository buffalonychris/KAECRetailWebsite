import { Link } from 'react-router-dom';

const ElderCare = () => {
  return (
    <div className="container section" style={{ display: 'grid', gap: '2.5rem' }}>
      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Elder Care System</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Supportive living, simplified</h1>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Safety monitoring and caregiver coordination tailored for aging-in-place. Package scope and
          pricing are TBD.
        </p>
      </section>

      <section className="card-grid" aria-label="Elder care tiers">
        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-bronze">Bronze</div>
          <h2 style={{ margin: 0 }}>Daily safety essentials</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Core safety sensors: TBD</li>
            <li>Caregiver notifications: TBD</li>
            <li>Setup guidance: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>

        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-silver">Silver</div>
          <h2 style={{ margin: 0 }}>Enhanced monitoring</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Expanded sensor coverage: TBD</li>
            <li>Wellness check-ins: TBD</li>
            <li>Automation assist options: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>

        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-gold">Gold</div>
          <h2 style={{ margin: 0 }}>Comprehensive care system</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Full-home safety plan: TBD</li>
            <li>Priority response pathways: TBD</li>
            <li>Care team dashboard: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>
      </section>

      <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Coordinate a care consult</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          We will confirm the right tier, caregiver access needs, and install scope. Timelines and pricing
          are TBD until assessment.
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

export default ElderCare;
