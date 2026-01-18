import { Link } from 'react-router-dom';

const HomeSecurity = () => {
  return (
    <div className="container section" style={{ display: 'grid', gap: '2.5rem' }}>
      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Home Security Systems</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Protection-first security packages</h1>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Layered detection, deterrence, and response tools designed for residential security. Final equipment
          lists and pricing are TBD.
        </p>
      </section>

      <section className="card-grid" aria-label="Home security tiers">
        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-bronze">Bronze</div>
          <h2 style={{ margin: 0 }}>Essential coverage</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Entry-point sensors: TBD</li>
            <li>Core alerting workflow: TBD</li>
            <li>Install scope: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>

        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-silver">Silver</div>
          <h2 style={{ margin: 0 }}>Expanded perimeter</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Enhanced sensor mix: TBD</li>
            <li>Automation-ready alerts: TBD</li>
            <li>Video coverage options: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>

        <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="tier-badge tier-badge-gold">Gold</div>
          <h2 style={{ margin: 0 }}>Full-home security</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#c8c0aa' }}>
            <li>Comprehensive sensor plan: TBD</li>
            <li>Priority response routing: TBD</li>
            <li>Premium hardware options: TBD</li>
          </ul>
          <small style={{ color: '#c8c0aa' }}>Pricing: TBD</small>
        </article>
      </section>

      <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Request a security consult</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Tell us about your property and we will confirm the tier, scope, and timeline. Availability and
          installation requirements are TBD until assessment.
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

export default HomeSecurity;
