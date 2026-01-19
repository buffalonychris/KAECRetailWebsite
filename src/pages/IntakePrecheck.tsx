import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IntakeType, loadIntakeState, updateIntakeDraft } from '../lib/intakeFlow';

const IntakePrecheck = () => {
  const navigate = useNavigate();
  const storedDraft = loadIntakeState().draft;
  const [intakeType, setIntakeType] = useState<IntakeType>(storedDraft.intakeType ?? 'residential');
  const [confirmed, setConfirmed] = useState<boolean>(storedDraft.precheckConfirmed ?? false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateIntakeDraft({ intakeType, precheckConfirmed: confirmed });
    navigate(intakeType === 'business' ? '/business/intake' : '/residential/intake');
  };

  return (
    <div className="container section" style={{ display: 'grid', gap: '1.25rem' }}>
      <div>
        <p className="badge">Step001 precheck</p>
        <h1 style={{ margin: 0 }}>Safety precheck</h1>
        <p style={{ maxWidth: 760, color: '#e6ddc7' }}>
          This intake flow is informational only and does not provide medical advice. If this is urgent, call 911 or local
          emergency services.
        </p>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <label className="form-field">
            <span>Choose your intake path</span>
            <select value={intakeType} onChange={(event) => setIntakeType(event.target.value as IntakeType)} required>
              <option value="residential">Residential intake</option>
              <option value="business">Business intake</option>
            </select>
          </label>

          <label className="form-field" style={{ alignItems: 'flex-start', gap: '0.5rem' }}>
            <span>Safety confirmation</span>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
              <span>I confirm this intake is non-emergency.</span>
            </label>
            <small style={{ color: '#c8c0aa' }}>Proceed only if it is safe to do so.</small>
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary" disabled={!confirmed}>
              Continue to intake
            </button>
            {!confirmed && <small style={{ color: '#c8c0aa' }}>Confirmation required.</small>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakePrecheck;
