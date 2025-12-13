const Privacy = () => (
  <div className="container section">
    <h2 style={{ marginTop: 0 }}>Privacy</h2>
    <p>
      We use Home Assistant as the single control platform so you know exactly where your data is
      flowing. Local recording is prioritized wherever possible.
    </p>
    <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <div>
        <strong>Data minimization</strong>
        <p style={{ margin: '0.35rem 0' }}>
          We avoid sending footage or sensor data to third-party clouds unless you explicitly opt in
          for remote viewing. Local storage is recommended for Reolink NVR and camera deployments.
        </p>
      </div>
      <div>
        <strong>Access control</strong>
        <p style={{ margin: '0.35rem 0' }}>
          Home Assistant roles keep caregivers and family on one secure platform. We recommend strong
          passwords and multi-factor authentication where available.
        </p>
      </div>
      <div>
        <strong>Retention</strong>
        <p style={{ margin: '0.35rem 0' }}>
          Recording retention depends on your chosen local storage. You can adjust retention policies
          in Home Assistant or the included NVR to match property requirements.
        </p>
      </div>
    </div>
  </div>
);

export default Privacy;
