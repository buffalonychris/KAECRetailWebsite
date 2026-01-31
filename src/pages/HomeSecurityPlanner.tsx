import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeSecurityFunnelSteps from '../components/HomeSecurityFunnelSteps';
import { useLayoutConfig } from '../components/LayoutConfig';
import type { EntryPoints, HomeSecurityFitCheckAnswers, PrecisionPlannerDraft } from '../lib/homeSecurityFunnel';
import { loadRetailFlow, updateRetailFlow } from '../lib/retailFlow';

const priorityOptions = ['Security', 'Packages', 'Water'] as const;

const deriveExteriorDoors = (entryPoints?: EntryPoints): string[] | undefined => {
  if (!entryPoints) return undefined;
  if (entryPoints === '1-2') {
    return ['Front door'];
  }
  if (entryPoints === '3-4') {
    return ['Front door', 'Back door', 'Garage entry'];
  }
  return ['Front door', 'Back door', 'Side door', 'Patio slider', 'Garage entry'];
};

const deriveDraftFromFitCheck = (answers?: HomeSecurityFitCheckAnswers): PrecisionPlannerDraft => {
  if (!answers) return {};
  const derivedDoors = deriveExteriorDoors(answers.entryPoints);
  const sizeBand =
    answers.homeSize === 'small' ? 'small' : answers.homeSize === 'typical' ? 'medium' : answers.homeSize === 'large' ? 'large' : undefined;
  return {
    exteriorDoors: derivedDoors,
    sizeBand,
  };
};

const HomeSecurityPlanner = () => {
  useLayoutConfig({
    layoutVariant: 'funnel',
    showBreadcrumbs: true,
    breadcrumb: [
      { label: 'Home Security', href: '/home-security' },
      { label: 'Precision Planner' },
    ],
  });

  const initialDraft = (() => {
    const stored = loadRetailFlow().homeSecurity?.precisionPlannerDraft;
    if (stored && Object.keys(stored).length > 0) {
      return stored;
    }
    return deriveDraftFromFitCheck(loadRetailFlow().homeSecurity?.fitCheckAnswers);
  })();

  const [draft, setDraft] = useState<PrecisionPlannerDraft>(initialDraft);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const exteriorDoors = draft.exteriorDoors ?? [];
  const priorities = draft.priorities ?? [];

  const handleDoorLabelChange = (index: number, value: string) => {
    setDraft((prev) => {
      const nextDoors = [...(prev.exteriorDoors ?? [])];
      nextDoors[index] = value;
      return { ...prev, exteriorDoors: nextDoors };
    });
  };

  const handleRemoveDoor = (index: number) => {
    setDraft((prev) => {
      const nextDoors = [...(prev.exteriorDoors ?? [])];
      nextDoors.splice(index, 1);
      return { ...prev, exteriorDoors: nextDoors };
    });
  };

  const handleAddDoor = () => {
    setDraft((prev) => ({
      ...prev,
      exteriorDoors: [...(prev.exteriorDoors ?? []), ''],
    }));
  };

  const handlePriorityToggle = (value: (typeof priorityOptions)[number]) => {
    setDraft((prev) => {
      const nextPriorities = new Set(prev.priorities ?? []);
      if (nextPriorities.has(value)) {
        nextPriorities.delete(value);
      } else if (nextPriorities.size < 2) {
        nextPriorities.add(value);
      }
      return { ...prev, priorities: Array.from(nextPriorities) };
    });
  };

  const handleSaveDraft = () => {
    updateRetailFlow({ homeSecurity: { precisionPlannerDraft: draft } });
  };

  const handleContinue = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <HomeSecurityFunnelSteps currentStep="fit-check" />
        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <h1 style={{ margin: 0 }}>Home Security Precision Planner</h1>
          <p style={{ margin: 0, color: '#c8c0aa' }}>Optional. For customers who want surgical precision.</p>
          <p style={{ margin: 0, color: '#c8c0aa' }}>This does not change your package unless you choose to.</p>
        </div>

        <div className="card" style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Property type</label>
            <select
              value={draft.propertyType ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  propertyType: (event.target.value || undefined) as PrecisionPlannerDraft['propertyType'],
                }))
              }
            >
              <option value="">Select</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="rental">Rental</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Floors</label>
            <select
              value={draft.floors ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  floors: event.target.value ? (Number(event.target.value) as PrecisionPlannerDraft['floors']) : undefined,
                }))
              }
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Size band</label>
            <select
              value={draft.sizeBand ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  sizeBand: (event.target.value || undefined) as PrecisionPlannerDraft['sizeBand'],
                }))
              }
            >
              <option value="">Select</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Garage</label>
            <select
              value={draft.garage ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  garage: (event.target.value || undefined) as PrecisionPlannerDraft['garage'],
                }))
              }
            >
              <option value="">Select</option>
              <option value="none">None</option>
              <option value="attached">Attached</option>
              <option value="detached">Detached</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <label style={{ fontWeight: 600 }}>Exterior doors</label>
            {exteriorDoors.length === 0 ? (
              <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No doors added yet.</p>
            ) : null}
            {exteriorDoors.map((door, index) => (
              <div key={`door-${index}`} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={door}
                  placeholder="Door label"
                  onChange={(event) => handleDoorLabelChange(index, event.target.value)}
                />
                <button type="button" className="btn btn-secondary" onClick={() => handleRemoveDoor(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={handleAddDoor}>
              Add exterior door
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Ground-level windows</label>
            <select
              value={draft.groundWindows ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  groundWindows: (event.target.value || undefined) as PrecisionPlannerDraft['groundWindows'],
                }))
              }
            >
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="some">Some</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={draft.pets ?? false}
                onChange={(event) => setDraft((prev) => ({ ...prev, pets: event.target.checked }))}
              />
              Pets
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={draft.elders ?? false}
                onChange={(event) => setDraft((prev) => ({ ...prev, elders: event.target.checked }))}
              />
              Elders
            </label>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Priorities (choose up to 2)</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {priorityOptions.map((option) => {
                const checked = priorities.includes(option);
                const disabled = !checked && priorities.length >= 2;
                return (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => handlePriorityToggle(option)}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleSaveDraft}>
              Save draft
            </button>
            <Link className="btn btn-link" to="/discovery?vertical=home-security">
              Back to Fit Check
            </Link>
            <Link className="btn btn-link" to="/packages?vertical=home-security">
              Back to Packages
            </Link>
            <button type="button" className="btn btn-secondary" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>

        <div ref={resultsRef} className="card" style={{ display: 'grid', gap: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>Planner results will appear here next.</h3>
          <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.8)' }}>
            Next step: device placement and coverage check vs Bronze / Silver / Gold.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeSecurityPlanner;
