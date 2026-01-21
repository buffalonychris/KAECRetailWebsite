import { Link } from 'react-router-dom';

const IntakeHub = () => {
  return (
    <div className="container section" style={{ display: 'grid', gap: '1.25rem' }}>
      <div>
        <p className="badge">Intake hub</p>
        <h1 style={{ margin: 0 }}>Start an intake</h1>
        <p style={{ maxWidth: 760, color: '#e6ddc7' }}>
          Choose the intake path that matches your household or business. Each path auto-recommends the right package tier and
          still lets you override before submission.
        </p>
      </div>

      <div className="card-grid">
        <div className="card" style={{ display: 'grid', gap: '0.5rem' }}>
          <strong style={{ color: '#fff7e6' }}>Guided precheck</strong>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Confirm non-emergency status, select a path, and continue into the guided intake.
          </p>
          <Link className="btn btn-primary" to="/intake/precheck">
            Start precheck
          </Link>
        </div>
        <div className="card" style={{ display: 'grid', gap: '0.5rem' }}>
          <strong style={{ color: '#fff7e6' }}>Residential intake</strong>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            For households, caregivers, and families who need a package recommendation.
          </p>
          <Link className="btn btn-secondary" to="/residential/intake">
            Start residential intake
          </Link>
        </div>
        <div className="card" style={{ display: 'grid', gap: '0.5rem' }}>
          <strong style={{ color: '#fff7e6' }}>Business intake</strong>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            For organizations, agencies, and multi-location partners who need a package fit.
          </p>
          <Link className="btn btn-secondary" to="/business/intake">
            Start business intake
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntakeHub;
