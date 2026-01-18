const Support = () => (
  <div className="container section" style={{ display: 'grid', gap: '2rem' }}>
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <div className="badge">Support</div>
      <h1 style={{ margin: 0, color: '#fff7e6' }}>How to reach support</h1>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        We respond to scheduling assistant questions and demo requests in the order received.
      </p>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>Email</h2>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        Use the placeholder email below until your team provides a dedicated inbox.
      </p>
      <p style={{ margin: 0 }}>
        <strong>support@example.com</strong>
      </p>
    </section>

    <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2 style={{ marginTop: 0 }}>Response expectations</h2>
      <p style={{ margin: 0, color: '#c8c0aa' }}>
        We aim to respond within 1-2 business days. If your request is urgent, note that in the subject line so
        we can prioritize scheduling-related questions.
      </p>
    </section>
  </div>
);

export default Support;
