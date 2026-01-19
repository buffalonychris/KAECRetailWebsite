import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TierBadge from './TierBadge';
import {
  IntakeRecord,
  IntakeDraft,
  IntakeStepId,
  IntakeType,
  buildIntakeRecommendation,
  finalizeIntake,
  loadIntakeState,
  updateIntakeDraft,
} from '../lib/intakeFlow';
import { PackageTierId, getTierLabel } from '../data/pricing';

const stepOrder: { id: IntakeStepId; title: string; description: string }[] = [
  {
    id: 'Step001',
    title: 'Precheck',
    description: 'Confirm this intake is non-emergency and ready for a guided package match.',
  },
  {
    id: 'Step002',
    title: 'Contact',
    description: 'Who should we coordinate with after the intake completes?',
  },
  {
    id: 'Step003',
    title: 'Property profile',
    description: 'Summarize the footprint so we right-size coverage.',
  },
  {
    id: 'Step004',
    title: 'Care team',
    description: 'Identify who will receive alerts and dashboards.',
  },
  {
    id: 'Step005',
    title: 'Risk signal',
    description: 'Highlight fall-risk signals that should shape alerts.',
  },
  {
    id: 'Step006',
    title: 'Tech comfort',
    description: 'Dial in training and interface simplicity.',
  },
  {
    id: 'Step007',
    title: 'Connectivity',
    description: 'Confirm how reliable the on-site connection is.',
  },
  {
    id: 'Step008',
    title: 'Budget & timing',
    description: 'Align on budget guardrails and desired start window.',
  },
  {
    id: 'Step009',
    title: 'Recommendation',
    description: 'Review the auto-recommended package and submit the intake.',
  },
];

const defaultDraft = (intakeType: IntakeType): IntakeDraft => ({
  ...loadIntakeState().draft,
  intakeType,
});

const IntakeWizard = ({ intakeType }: { intakeType: IntakeType }) => {
  const [draft, setDraft] = useState<IntakeDraft>(() => defaultDraft(intakeType));
  const [stepIndex, setStepIndex] = useState(0);
  const [submittedRecord, setSubmittedRecord] = useState<IntakeRecord | null>(null);
  const [leadStatus, setLeadStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const recommendation = useMemo(() => buildIntakeRecommendation(draft), [draft]);
  const overrideTier = draft.packageOverride && draft.packageOverride !== '' ? draft.packageOverride : undefined;
  const finalTier = overrideTier ?? recommendation.tier;

  const handleDraftChange = <Key extends keyof IntakeDraft>(key: Key, value: IntakeDraft[Key]) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      updateIntakeDraft({ [key]: value } as Partial<IntakeDraft>);
      return next;
    });
  };

  const currentStep = stepOrder[stepIndex];

  useEffect(() => {
    setDraft((prev) => ({ ...prev, intakeType }));
    updateIntakeDraft({ intakeType });
  }, [intakeType]);

  const isStepComplete = (stepId: IntakeStepId) => {
    switch (stepId) {
      case 'Step001':
        return draft.precheckConfirmed;
      case 'Step002':
        return (
          Boolean(draft.contactName && draft.contactEmail && draft.contactPhone) &&
          (draft.intakeType === 'business' ? Boolean(draft.organizationName) : true)
        );
      case 'Step003':
        return Boolean(draft.homeSize) && (draft.intakeType === 'business' ? Boolean(draft.locationCount) : Boolean(draft.propertyType));
      case 'Step004':
        return Boolean(draft.caregiverSituation);
      case 'Step005':
        return Boolean(draft.fallRisk);
      case 'Step006':
        return Boolean(draft.techComfort);
      case 'Step007':
        return Boolean(draft.internetReliability);
      case 'Step008':
        return Boolean(draft.budgetRange);
      case 'Step009':
        return true;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (stepIndex < stepOrder.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const record = finalizeIntake(draft);
    setSubmittedRecord(record);
    setLeadStatus('sending');

    const payload = {
      event: 'Lead Signal: Intake Completed',
      customerEmail: record.draft.contactEmail,
      referenceId: record.id,
      route: `${record.draft.intakeType}/intake`,
    };

    try {
      const response = await fetch('/api/lead-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      if (response.ok && data?.ok) {
        setLeadStatus('sent');
      } else {
        setLeadStatus('error');
      }
    } catch (error) {
      setLeadStatus('error');
    }
  };

  return (
    <div className="container section" style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <p className="badge">Step001–Step009 intake</p>
        <h1 style={{ margin: 0 }}>{draft.intakeType === 'business' ? 'Business intake' : 'Residential intake'}</h1>
        <p style={{ maxWidth: 760, color: '#e6ddc7' }}>
          Complete the guided intake to auto-recommend the right package tier. You can override the recommendation before submission.
        </p>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <strong style={{ color: '#fff7e6' }}>{currentStep.title}</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#c8c0aa' }}>{currentStep.description}</p>
            </div>
            <div style={{ color: '#c8c0aa' }}>Step {stepIndex + 1} of {stepOrder.length}</div>
          </div>

          {currentStep.id === 'Step001' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div className="grid grid-2" style={{ gap: '0.75rem' }}>
                <label className="form-field">
                  <span>Intake type</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <strong style={{ color: '#fff7e6' }}>{draft.intakeType === 'business' ? 'Business' : 'Residential'}</strong>
                    <Link className="btn btn-secondary" to="/intake/precheck">
                      Change type
                    </Link>
                  </div>
                </label>
                <label className="form-field" style={{ alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span>Safety confirmation</span>
                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={draft.precheckConfirmed}
                      onChange={(event) => handleDraftChange('precheckConfirmed', event.target.checked)}
                    />
                    <span>This intake is not for emergencies.</span>
                  </label>
                  <small style={{ color: '#c8c0aa' }}>If this is urgent, call 911 or local emergency services.</small>
                </label>
              </div>
            </div>
          )}

          {currentStep.id === 'Step002' && (
            <div className="grid grid-3" style={{ gap: '0.75rem' }}>
              <label className="form-field">
                <span>Primary contact name</span>
                <input
                  value={draft.contactName}
                  onChange={(event) => handleDraftChange('contactName', event.target.value)}
                  required
                />
              </label>
              <label className="form-field">
                <span>Contact email</span>
                <input
                  type="email"
                  value={draft.contactEmail}
                  onChange={(event) => handleDraftChange('contactEmail', event.target.value)}
                  required
                />
              </label>
              <label className="form-field">
                <span>Contact phone</span>
                <input
                  value={draft.contactPhone}
                  onChange={(event) => handleDraftChange('contactPhone', event.target.value)}
                  required
                />
              </label>
              {draft.intakeType === 'business' ? (
                <label className="form-field">
                  <span>Organization name</span>
                  <input
                    value={draft.organizationName}
                    onChange={(event) => handleDraftChange('organizationName', event.target.value)}
                    required
                  />
                </label>
              ) : (
                <label className="form-field">
                  <span>Resident name</span>
                  <input
                    value={draft.residentName}
                    onChange={(event) => handleDraftChange('residentName', event.target.value)}
                  />
                </label>
              )}
            </div>
          )}

          {currentStep.id === 'Step003' && (
            <div className="grid grid-2" style={{ gap: '0.75rem' }}>
              {draft.intakeType === 'business' ? (
                <label className="form-field">
                  <span>Location count</span>
                  <select
                    value={draft.locationCount}
                    onChange={(event) => handleDraftChange('locationCount', event.target.value)}
                    required
                  >
                    <option value="">Select range</option>
                    <option value="1">Single location</option>
                    <option value="2-5">2-5 locations</option>
                    <option value="6+">6+ locations</option>
                  </select>
                </label>
              ) : (
                <label className="form-field">
                  <span>Property type</span>
                  <select
                    value={draft.propertyType}
                    onChange={(event) => handleDraftChange('propertyType', event.target.value)}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="single-family">Single-family home</option>
                    <option value="condo">Condo / apartment</option>
                    <option value="multi-unit">Multi-unit / shared property</option>
                  </select>
                </label>
              )}
              <label className="form-field">
                <span>{draft.intakeType === 'business' ? 'Coverage footprint' : 'Home size'}</span>
                <select
                  value={draft.homeSize}
                  onChange={(event) => handleDraftChange('homeSize', event.target.value as IntakeDraft['homeSize'])}
                  required
                >
                  <option value="small">Small (condo or ADU)</option>
                  <option value="medium">Medium single-family</option>
                  <option value="large">Large or multi-unit</option>
                </select>
              </label>
            </div>
          )}

          {currentStep.id === 'Step004' && (
            <label className="form-field">
              <span>{draft.intakeType === 'business' ? 'Care team coverage' : 'Caregiver situation'}</span>
              <select
                value={draft.caregiverSituation}
                onChange={(event) => handleDraftChange('caregiverSituation', event.target.value as IntakeDraft['caregiverSituation'])}
                required
              >
                <option value="solo">Solo caregiver</option>
                <option value="shared">Shared family team</option>
                <option value="professional">Professional staff involved</option>
              </select>
            </label>
          )}

          {currentStep.id === 'Step005' && (
            <label className="form-field">
              <span>Fall-risk signal</span>
              <select
                value={draft.fallRisk}
                onChange={(event) => handleDraftChange('fallRisk', event.target.value as IntakeDraft['fallRisk'])}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          )}

          {currentStep.id === 'Step006' && (
            <label className="form-field">
              <span>Tech comfort</span>
              <select
                value={draft.techComfort}
                onChange={(event) => handleDraftChange('techComfort', event.target.value as IntakeDraft['techComfort'])}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          )}

          {currentStep.id === 'Step007' && (
            <label className="form-field">
              <span>Internet reliability</span>
              <select
                value={draft.internetReliability}
                onChange={(event) => handleDraftChange('internetReliability', event.target.value as IntakeDraft['internetReliability'])}
                required
              >
                <option value="good">Good</option>
                <option value="spotty">Spotty</option>
                <option value="none">Limited / none</option>
              </select>
            </label>
          )}

          {currentStep.id === 'Step008' && (
            <div className="grid grid-2" style={{ gap: '0.75rem' }}>
              <label className="form-field">
                <span>Budget guardrail</span>
                <select
                  value={draft.budgetRange}
                  onChange={(event) => handleDraftChange('budgetRange', event.target.value as IntakeDraft['budgetRange'])}
                  required
                >
                  <option value="entry">Entry: under $3k</option>
                  <option value="core">Core: $3k-$5k</option>
                  <option value="expanded">Expanded: $5k-$8k</option>
                  <option value="flexible">Flexible for the right fit</option>
                </select>
              </label>
              <label className="form-field">
                <span>Desired start window</span>
                <select
                  value={draft.timeline}
                  onChange={(event) => handleDraftChange('timeline', event.target.value)}
                >
                  <option value="">Select timing (optional)</option>
                  <option value="30-60">Next 30-60 days</option>
                  <option value="60-90">Next 60-90 days</option>
                  <option value="90-120">Next 90-120 days</option>
                  <option value="later">Later / to be scheduled</option>
                </select>
              </label>
              <label className="form-field" style={{ gridColumn: '1 / -1' }}>
                <span>Notes or site constraints (optional)</span>
                <textarea
                  value={draft.notes}
                  onChange={(event) => handleDraftChange('notes', event.target.value)}
                  rows={4}
                />
              </label>
            </div>
          )}

          {currentStep.id === 'Step009' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div className="card" style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 12 }}>
                <div style={{ display: 'grid', gap: '0.35rem' }}>
                  <strong style={{ color: '#fff7e6' }}>Auto-recommended package</strong>
                  <TierBadge tierId={recommendation.tier} />
                  <p style={{ margin: 0, color: '#c8c0aa' }}>{recommendation.rationale}</p>
                </div>
              </div>
              <label className="form-field">
                <span>Override package (optional)</span>
                <select
                  value={draft.packageOverride ?? ''}
                  onChange={(event) => handleDraftChange('packageOverride', event.target.value as PackageTierId | '')}
                >
                  <option value="">Use recommended {getTierLabel(recommendation.tier)}</option>
                  <option value="A1">Elder Care Bronze (A1)</option>
                  <option value="A2">Elder Care Silver (A2)</option>
                  <option value="A3">Elder Care Gold (A3)</option>
                </select>
              </label>
              <div className="card" style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 12 }}>
                <strong style={{ color: '#fff7e6' }}>Final package summary</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <TierBadge tierId={finalTier} />
                  <span style={{ color: '#c8c0aa' }}>{getTierLabel(finalTier)}</span>
                  {overrideTier && <span style={{ color: '#c8c0aa' }}>(override applied)</span>}
                </div>
                {recommendation.suggestedAddOns.length > 0 && (
                  <ul className="list" style={{ marginTop: '0.5rem' }}>
                    {recommendation.suggestedAddOns.map((item) => (
                      <li key={item}>
                        <span />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {stepIndex > 0 && (
              <button type="button" className="btn btn-secondary" onClick={goBack}>
                Back
              </button>
            )}
            {currentStep.id !== 'Step009' && (
              <button type="button" className="btn btn-primary" onClick={goNext} disabled={!isStepComplete(currentStep.id)}>
                Continue
              </button>
            )}
            {currentStep.id === 'Step009' && (
              <button type="submit" className="btn btn-primary" disabled={!isStepComplete(currentStep.id)}>
                Submit intake
              </button>
            )}
            {!isStepComplete(currentStep.id) && <small style={{ color: '#c8c0aa' }}>Complete this step to continue.</small>}
          </div>
        </form>
      </div>

      {submittedRecord && (
        <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <strong style={{ color: '#fff7e6' }}>Intake complete (Step012–Step013)</strong>
          <p style={{ margin: 0, color: '#c8c0aa' }}>Reference: {submittedRecord.id}</p>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <strong style={{ color: '#fff7e6' }}>Package recommendation summary</strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <TierBadge tierId={finalTier} />
              <span style={{ color: '#c8c0aa' }}>{getTierLabel(finalTier)}</span>
              {overrideTier && <span style={{ color: '#c8c0aa' }}>(override applied)</span>}
            </div>
            <p style={{ margin: 0, color: '#c8c0aa' }}>{recommendation.rationale}</p>
          </div>
          <div>
            <strong style={{ color: '#fff7e6' }}>Backend event status</strong>
            <p style={{ margin: '0.25rem 0 0', color: '#c8c0aa' }}>
              {leadStatus === 'sending' && 'Sending Step012 completion event…'}
              {leadStatus === 'sent' && 'Step012 completion event logged.'}
              {leadStatus === 'error' && 'Step012 event failed to send; retry later.'}
              {leadStatus === 'idle' && 'Step012 event queued.'}
            </p>
          </div>
          <div>
            <strong style={{ color: '#fff7e6' }}>Logged events</strong>
            <ul className="list" style={{ marginTop: '0.5rem' }}>
              {submittedRecord.events.map((event) => (
                <li key={event.id}>
                  <span />
                  <span>
                    {event.stepId}: {event.name} ({new Date(event.timestampISO).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong style={{ color: '#fff7e6' }}>Stub records</strong>
            <ul className="list" style={{ marginTop: '0.5rem' }}>
              {submittedRecord.stubs.map((stub) => (
                <li key={stub.id}>
                  <span />
                  <span>
                    {stub.type.toUpperCase()}: {stub.displayName} ({stub.status})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntakeWizard;
