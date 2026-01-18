import { Link } from 'react-router-dom';

const NeverMissAnotherEstimate = () => (
  <div className="container section" style={{ display: 'grid', gap: '2rem' }}>
    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <div className="badge">Never Miss Another Estimate</div>
      <h1 style={{ margin: 0, color: '#fff7e6' }}>Never Miss Another Estimate — 24/7 Estimate Scheduling Assistant</h1>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        A scheduling-only assistant that captures estimate requests, collects the essentials, and books the
        appointment directly on your calendar.
      </p>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        Core promise: every estimate request gets an immediate response and a clear scheduling path — even
        after hours.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link className="btn btn-primary" to="/demo">
          See a Live Demo
        </Link>
        <Link className="btn btn-secondary" to="/pricing">
          View Pricing
        </Link>
        <Link className="btn" to="/5-day-demo">
          Start Free 5-Day Demo
        </Link>
        <Link className="btn" to="/partners">
          Become a Partner
        </Link>
      </div>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>Trust &amp; safety expectations</h2>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        This assistant is scheduling-only. It does not provide pricing, guarantees, promises, emergency
        handling, or staff replacement.
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
        <li>No pricing, guarantees, or promises are given by the assistant.</li>
        <li>No emergency diagnosis or emergency response.</li>
        <li>No staff replacement — it supports your team by capturing and scheduling.</li>
        <li>Scheduling-only role with clear audit trails for every interaction.</li>
      </ul>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>What it does</h2>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
        <li>Answers calls and texts 24/7 to capture estimate requests.</li>
        <li>Asks only the required questions to schedule an estimate.</li>
        <li>Books the appointment on your calendar and confirms with the customer.</li>
        <li>Logs the interaction in an operator console for review.</li>
      </ul>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>What it will NOT do</h2>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
        <li>No pricing</li>
        <li>No guarantees</li>
        <li>No emergency diagnosis</li>
        <li>No staff replacement</li>
      </ul>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>Compatibility</h2>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        Works with iPhone &amp; Android, Google Calendar, Apple Calendar, Outlook / Office 365, and is
        CRM-friendly (Jobber, ServiceTitan, Salesforce, HubSpot).
      </p>
    </section>
  </div>
);

export default NeverMissAnotherEstimate;
