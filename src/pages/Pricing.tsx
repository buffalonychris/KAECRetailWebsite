import { Link } from 'react-router-dom';

const Pricing = () => (
  <div className="container section" style={{ display: 'grid', gap: '2rem' }}>
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <div className="badge">Pricing</div>
      <h1 style={{ margin: 0, color: '#fff7e6' }}>Simple plans for estimate scheduling</h1>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        Pick the tier that matches your call volume and team structure. No auto-billing without explicit consent.
      </p>
    </section>

    <section className="card-grid" aria-label="Pricing tiers">
      <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Starter Plan</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>$299 / month</p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
          <li>Up to 300 voice minutes</li>
          <li>24/7 call + text answering</li>
          <li>Calendar booking</li>
          <li>Confirmations &amp; reminders</li>
          <li>Operator console + audit trail</li>
        </ul>
        <Link className="btn btn-primary" to="/5-day-demo">
          Purchase / Start Plan
        </Link>
      </article>

      <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Pro Plan</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>Price: Request</p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
          <li>Multiple calendars / techs</li>
          <li>Advanced rules</li>
          <li>Higher minute bundles</li>
          <li>Priority onboarding</li>
        </ul>
        <a className="btn btn-secondary" href="#pro-request">
          Request Pro Pricing
        </a>
      </article>

      <article className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Partner / White-Label</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>CTA: Become a Partner</p>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Offer the assistant under your brand with co-branded materials and recurring margin.
        </p>
        <Link className="btn btn-primary" to="/partners">
          Become a Partner
        </Link>
      </article>
    </section>

    <section id="pro-request" className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>Request Pro Pricing</h2>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        Tell us about your team and scheduling volume and we will follow up with a tailored plan.
      </p>
      <form className="form" style={{ maxWidth: '520px' }}>
        <label>
          Name
          <input type="text" placeholder="Your name" required />
        </label>
        <label>
          Company
          <input type="text" placeholder="Company name" required />
        </label>
        <label>
          Email
          <input type="email" placeholder="you@company.com" required />
        </label>
        <label>
          Scheduling needs
          <textarea placeholder="Calendars, techs, and volume details" rows={4} />
        </label>
        <small style={{ color: '#c8c0aa' }}>
          We will contact you with pricing options. No auto-billing or implied purchase.
        </small>
        <button className="btn btn-primary" type="button">
          Request Pro Pricing
        </button>
      </form>
      <div>
        <Link className="btn btn-secondary" to="/support">
          Contact Support
        </Link>
      </div>
    </section>
  </div>
);

export default Pricing;
