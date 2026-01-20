import OwnershipOfflineGuarantee from '../components/OwnershipOfflineGuarantee';

const Reliability = () => {
  return (
    <div className="container section">
      <h1 style={{ marginTop: 0 }}>How it Works</h1>
      <h2>Offline reliability</h2>
      <p>
        We prioritize local control so that critical automations continue during internet outages as
        long as the equipment has power.
      </p>
      <OwnershipOfflineGuarantee intro="Home Assistant orchestrates every workflow while keeping privacy and ownership intact." />
      <div className="card-grid">
        <div className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Home Assistant at the core</h3>
          <p>
            Every device is integrated through Home Assistant. Families and caregivers learn one
            interface, and local automations live there—not in cloud accounts.
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Local-first automations</h3>
          <p>
            Lighting, lock schedules, and sensor-based routines execute on-site. Remote viewing may
            pause when connectivity drops, but safety flows continue.
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Power-aware design</h3>
          <p>
            Controllers and networking gear include backup power where listed. We document power
            requirements so you know how long core features can ride through outages.
          </p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginTop: 0, color: '#fff7e6' }}>What stays available during outages?</h3>
        <ul className="list">
          <li>
            <span />
            <span>Local lighting automations for safe nighttime navigation.</span>
          </li>
          <li>
            <span />
            <span>Lock control and PIN entry at the door.</span>
          </li>
          <li>
            <span />
            <span>Sensor alerts configured for local-only notifications.</span>
          </li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Remote notifications and viewing may require available internet or cellular backup, but core
          on-site controls remain centralized in Home Assistant.
        </p>
      </div>
    </div>
  );
};

export default Reliability;
