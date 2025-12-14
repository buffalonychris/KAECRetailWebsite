const Schedule = () => {
  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem' }}>
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Scheduling placeholder</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Scheduling opens after deposit confirmation</h1>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          This placeholder confirms the retail flow. When enabled, scheduling will pull the same quote context and respect deposit status.
        </p>
      </div>
      <div className="card" style={{ display: 'grid', gap: '0.5rem' }}>
        <strong>Next steps</strong>
        <ul className="list" style={{ marginTop: 0 }}>
          <li>
            <span />
            <span>Confirm deposit status as completed on the Payment page.</span>
          </li>
          <li>
            <span />
            <span>We will add a calendar integration and installer availability here.</span>
          </li>
          <li>
            <span />
            <span>No payment is taken on this page. No monthly subscriptions required.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Schedule;
