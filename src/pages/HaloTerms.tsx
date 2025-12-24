import Seo from '../components/Seo';

const HaloTerms = () => {
  return (
    <div className="container section">
      <Seo
        title="Terms — HALO — Reliable Elder Care"
        description="Terms of sale and site use (placeholder pending legal review)."
      />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ textAlign: 'center' }}>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            HALO Terms
          </p>
          <h2 style={{ margin: 0 }}>Terms</h2>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Terms</h3>
          <p>
            These terms are a launch placeholder pending legal review. Use final approved terms before scaling
            paid traffic.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HaloTerms;
