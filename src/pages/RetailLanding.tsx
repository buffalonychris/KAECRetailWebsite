import { Link } from 'react-router-dom';

const tierList = [
  { label: 'Bronze', className: 'tier-badge tier-badge-bronze', summary: 'Core starter bundle (details TBD).' },
  { label: 'Silver', className: 'tier-badge tier-badge-silver', summary: 'Expanded coverage and automation (details TBD).' },
  { label: 'Gold', className: 'tier-badge tier-badge-gold', summary: 'Full-coverage system with premium options (details TBD).' },
];

const RetailLanding = () => {
  return (
    <div className="container section" style={{ display: 'grid', gap: '2.5rem' }}>
      <section style={{ textAlign: 'center', display: 'grid', gap: '0.75rem' }}>
        <div className="badge" style={{ justifySelf: 'center' }}>Retail Entry</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Choose your system lineup</h1>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Explore our four product lines and select the tier that best fits your home. Pricing and full
          specifications are TBD.
        </p>
      </section>

      <section className="card-grid" aria-label="Retail product lines">
        <article className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>HALO</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              The flagship privacy-first safety platform for daily living and rapid response.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {tierList.map((tier) => (
              <div key={tier.label} style={{ display: 'grid', gap: '0.35rem' }}>
                <span className={tier.className}>{tier.label}</span>
                <small style={{ color: '#c8c0aa' }}>{tier.summary}</small>
              </div>
            ))}
          </div>
          <div>
            <Link className="btn btn-primary" to="/halo">
              View HALO options
            </Link>
          </div>
        </article>

        <article className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Home Security Systems</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Sensors, monitoring, and deterrence tools built for whole-home protection.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {tierList.map((tier) => (
              <div key={tier.label} style={{ display: 'grid', gap: '0.35rem' }}>
                <span className={tier.className}>{tier.label}</span>
                <small style={{ color: '#c8c0aa' }}>{tier.summary}</small>
              </div>
            ))}
          </div>
          <div>
            <Link className="btn btn-primary" to="/home-security">
              Explore Home Security
            </Link>
          </div>
        </article>

        <article className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Home Automation Systems</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Smart routines, energy awareness, and unified control for the modern home.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {tierList.map((tier) => (
              <div key={tier.label} style={{ display: 'grid', gap: '0.35rem' }}>
                <span className={tier.className}>{tier.label}</span>
                <small style={{ color: '#c8c0aa' }}>{tier.summary}</small>
              </div>
            ))}
          </div>
          <div>
            <Link className="btn btn-primary" to="/home-automation">
              Explore Home Automation
            </Link>
          </div>
        </article>

        <article className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Elder Care System</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Safety, wellness, and caregiver coordination tailored for aging-in-place.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {tierList.map((tier) => (
              <div key={tier.label} style={{ display: 'grid', gap: '0.35rem' }}>
                <span className={tier.className}>{tier.label}</span>
                <small style={{ color: '#c8c0aa' }}>{tier.summary}</small>
              </div>
            ))}
          </div>
          <div>
            <Link className="btn btn-primary" to="/elder-care">
              Explore Elder Care
            </Link>
          </div>
        </article>
      </section>

      <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Need guidance?</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Tell us about your goals and we will recommend the right tier. Availability, hardware lists,
          and pricing are TBD until your consultation.
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

export default RetailLanding;
