import { Link } from 'react-router-dom';

const FiveDayDemo = () => (
  <div className="container section" style={{ display: 'grid', gap: '2rem' }}>
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <div className="badge">Free 5-Day Live Demo</div>
      <h1 style={{ margin: 0, color: '#fff7e6' }}>Start a Free 5-Day Live Demo (We Pay for It)</h1>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        Experience a live scheduling assistant capturing estimate requests with real calendar booking.
      </p>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>Offer details</h2>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        We cover the cost of the assistant for five days so you can evaluate real call handling and scheduling.
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
        <li>No auto-billing.</li>
        <li>Demo expires after Day 5.</li>
        <li>Read-only dashboard after expiration.</li>
      </ul>
      <div>
        <Link className="btn btn-primary" to="/5-day-demo">
          Start Free 5-Day Demo (Paid for by Us)
        </Link>
      </div>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>What happens next</h2>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        We confirm your call routing, calendar access, and estimate requirements. You stay in control of every
        appointment.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link className="btn btn-secondary" to="/demo">
          Review Live Demo
        </Link>
        <Link className="btn" to="/pricing">
          View Pricing
        </Link>
      </div>
    </section>
  </div>
);

export default FiveDayDemo;
