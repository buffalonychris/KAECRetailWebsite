const PaymentProcessing = () => {
  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem' }}>
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Secure payment placeholder</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Payment processing coming next</h1>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          This retail experience does not connect to a live processor. Once enabled, secure provider fields will be injected here while keeping the quote context intact.
        </p>
      </div>
      <div className="card" style={{ display: 'grid', gap: '0.5rem' }}>
        <strong>What to expect</strong>
        <ul className="list" style={{ marginTop: 0 }}>
          <li>
            <span />
            <span>No card data is collected on this page today.</span>
          </li>
          <li>
            <span />
            <span>Once live, fields will come from the processor and will not be stored by KickAss.</span>
          </li>
          <li>
            <span />
            <span>Return to Payment to simulate deposit completion.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentProcessing;
