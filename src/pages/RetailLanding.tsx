import { Link } from 'react-router-dom';

const trustChips = [
  'Works with iPhone & Android',
  'Google Calendar',
  'Apple Calendar',
  'Outlook / Office 365',
  'CRM-friendly (Jobber, ServiceTitan, Salesforce, HubSpot)',
];

const workSteps = [
  'Customer calls or texts',
  'Assistant answers immediately',
  'Asks only necessary questions',
  'Schedules estimate',
  'Appointment appears on calendar',
];

const RetailLanding = () => {
  return (
    <div className="container section" style={{ display: 'grid', gap: '2.5rem' }}>
      <section style={{ textAlign: 'center', display: 'grid', gap: '0.75rem' }}>
        <div className="badge" style={{ justifySelf: 'center' }}>
          24/7 Estimate Scheduling Assistant
        </div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Never Miss Another Estimate — Even After Hours</h1>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          A scheduling-only assistant that answers calls and texts, gathers the essentials, and books estimate
          appointments directly on your calendar.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/demo">
            See a Live Demo
          </Link>
          <Link className="btn btn-secondary" to="/pricing">
            View Pricing
          </Link>
        </div>
        <div>
          <Link className="btn" to="/never-miss-another-estimate">
            Visit the full product page
          </Link>
        </div>
      </section>

      <section className="card" aria-label="Compatibility">
        <h2 style={{ marginTop: 0 }}>Works with your tools</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {trustChips.map((item) => (
            <span key={item} className="badge">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="card" aria-label="Problem statement" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ marginTop: 0 }}>Missed calls cost estimates</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Busy crews, on-the-road moments, and after-hours calls create missed opportunities. Voicemail often
          becomes a lost job because customers move on.
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa' }}>
          <li>Calls get missed while you are busy, driving, or closed.</li>
          <li>Voicemail = lost jobs.</li>
        </ul>
      </section>

      <section className="card" aria-label="How it works" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ marginTop: 0 }}>How it works</h2>
        <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
          {workSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="card" aria-label="What it will not do" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ marginTop: 0 }}>What it will NOT do</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
          <li>No pricing</li>
          <li>No guarantees</li>
          <li>No emergency diagnosis</li>
          <li>No staff replacement</li>
        </ul>
      </section>

      <section className="card" aria-label="Primary CTA" style={{ textAlign: 'center', display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ marginTop: 0 }}>Start a Free 5-Day Live Demo (We Pay for It)</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          See how the assistant books real estimate appointments while you stay in control of scheduling.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/5-day-demo">
            Start a Free 5-Day Live Demo (We Pay for It)
          </Link>
          <Link className="btn btn-secondary" to="/partners">
            Become a Partner
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RetailLanding;
