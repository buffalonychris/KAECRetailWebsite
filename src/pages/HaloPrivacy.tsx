import Seo from '../components/Seo';

const privacyBlocks = [
  {
    title: 'Privacy, plainly',
    body: 'We aim to keep the HALO experience focused on safety and usability. Privacy commitments published here must be specific, enforceable, and consistent with our policies and agreements.',
  },
  {
    title: 'What this page is not',
    body: 'This page is not a promise of absolutes unless explicitly stated in enforceable terms. We avoid broad claims that cannot be verified or controlled.',
  },
  {
    title: 'Your choices',
    body: 'You choose who gets notified and how. Verification is documented through Test & Verified.',
  },
];

const HaloPrivacy = () => {
  return (
    <div className="container section">
      <Seo
        title="Privacy — HALO — Reliable Elder Care"
        description="Plain-language privacy posture. Avoid absolutes unless enforceable."
      />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ textAlign: 'center' }}>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            HALO Privacy
          </p>
          <h2 style={{ margin: 0 }}>Privacy, plainly</h2>
        </section>

        {privacyBlocks.map((block) => (
          <section className="card" key={block.title}>
            <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{block.title}</h3>
            <p>{block.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default HaloPrivacy;
