const Partners = () => (
  <div className="container section" style={{ display: 'grid', gap: '2rem' }}>
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <div className="badge">Partner Program</div>
      <h1 style={{ margin: 0, color: '#fff7e6' }}>Partner with the estimate scheduling assistant</h1>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        Grow recurring revenue by offering a scheduling-only assistant that captures estimate requests 24/7.
      </p>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>Who it&apos;s for</h2>
      <p style={{ margin: 0, color: '#c8c0aa' }}>IT providers, MSPs, agencies, and telecom partners.</p>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>What partners get</h2>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c0aa', display: 'grid', gap: '0.4rem' }}>
        <li>Recurring margin</li>
        <li>Co-branded materials</li>
        <li>Demo scripts</li>
        <li>Onboarding checklist</li>
      </ul>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>Apply to Partner Program</h2>
      <form className="form" style={{ maxWidth: '520px' }}>
        <label>
          Name
          <input type="text" placeholder="Your name" required />
        </label>
        <label>
          Company
          <input type="text" placeholder="Company" required />
        </label>
        <label>
          Email
          <input type="email" placeholder="you@company.com" required />
        </label>
        <label>
          Partner type
          <select required>
            <option value="">Select</option>
            <option value="it">IT Provider</option>
            <option value="msp">MSP</option>
            <option value="agency">Agency</option>
            <option value="telecom">Telecom</option>
          </select>
        </label>
        <label>
          Message
          <textarea placeholder="Tell us about your clients and goals" rows={4} />
        </label>
        <button className="btn btn-primary" type="submit">
          Apply to Partner Program
        </button>
      </form>
    </section>
  </div>
);

export default Partners;
