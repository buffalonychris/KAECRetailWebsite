import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccordionSection from '../components/AccordionSection';
import HomeSecurityFunnelSteps from '../components/HomeSecurityFunnelSteps';
import { useLayoutConfig } from '../components/LayoutConfig';
import { track } from '../lib/analytics';
import type { EntryPoints, HomeSecurityFitCheckAnswers, PrecisionPlannerDraft } from '../lib/homeSecurityFunnel';
import {
  buildHomeSecurityPlannerPlan,
  deriveHomeSecurityQuoteAddOns,
  type PlannerPlan,
  type PlannerTierKey,
} from '../lib/homeSecurityPlannerEngine';
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

  const storedFlow = loadRetailFlow();
  const storedDraft = storedFlow.homeSecurity?.precisionPlannerDraft;
  const fitCheckTier = storedFlow.homeSecurity?.fitCheckResult?.tier;
  const defaultTier: PlannerTierKey =
    fitCheckTier === 'Bronze' ? 'bronze' : fitCheckTier === 'Silver' ? 'silver' : fitCheckTier === 'Gold' ? 'gold' : 'silver';

  const initialDraft = (() => {
    if (storedDraft && Object.keys(storedDraft).length > 0) {
      return { ...storedDraft, selectedTier: storedDraft.selectedTier ?? defaultTier };
    }
    return { ...deriveDraftFromFitCheck(storedFlow.homeSecurity?.fitCheckAnswers), selectedTier: defaultTier };
  })();

  const [draft, setDraft] = useState<PrecisionPlannerDraft>(initialDraft);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [selectedTier, setSelectedTier] = useState<PlannerTierKey>(initialDraft.selectedTier ?? defaultTier);
  const [plan, setPlan] = useState<PlannerPlan | null>(null);
  const navigate = useNavigate();

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
    track('hs_planner_results_generated', {
      tier: selectedTier,
      doors_count: exteriorDoors.length,
      pets: Boolean(draft.pets),
      elders: Boolean(draft.elders),
      ground_windows: draft.groundWindows ?? 'unknown',
    });
    const nextPlan = buildHomeSecurityPlannerPlan(draft, selectedTier);
    setPlan(nextPlan);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTierChange = (value: PlannerTierKey) => {
    setSelectedTier(value);
    setDraft((prev) => ({ ...prev, selectedTier: value }));
  };

  const handleApplyToQuote = () => {
    const nextPlan = plan ?? buildHomeSecurityPlannerPlan(draft, selectedTier);
    if (!plan) {
      setPlan(nextPlan);
    }
    const recommendedTierKey = nextPlan.selectedTier;
    const recommendedPackageId = recommendedTierKey === 'bronze' ? 'A1' : recommendedTierKey === 'silver' ? 'A2' : 'A3';
    const derivedAddOns = deriveHomeSecurityQuoteAddOns(nextPlan, draft);
    track('hs_planner_applied_to_quote', {
      recommendedTier: recommendedTierKey,
      add_ons_count: derivedAddOns.ids.length,
    });
    updateRetailFlow({
      homeSecurity: {
        plannerRecommendation: {
          recommendedTierKey,
          recommendedPackageId,
          recommendedAddOnIds: derivedAddOns.ids,
          recommendedAddOnNotes: Object.keys(derivedAddOns.notes).length > 0 ? derivedAddOns.notes : undefined,
          generatedAtISO: new Date().toISOString(),
        },
      },
    });
    navigate(`/quote?vertical=home-security&tier=${recommendedPackageId}`);
  };

  const tierComparisonNote = useMemo(() => {
    if (!plan || plan.coverage.status !== 'gap') return null;
    const order: PlannerTierKey[] = ['bronze', 'silver', 'gold'];
    const currentIndex = order.indexOf(selectedTier);
    const higherTier = plan.bundles.find(
      (bundle) => order.indexOf(bundle.tier) > currentIndex && bundle.coverage_status === 'complete',
    );
    if (!higherTier) return null;
    const label = higherTier.tier.charAt(0).toUpperCase() + higherTier.tier.slice(1);
    return `${label} covers your doors without add-ons.`;
  }, [plan, selectedTier]);

  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <HomeSecurityFunnelSteps currentStep="fit-check" />
        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <h1 style={{ margin: 0 }}>Home Security Precision Planner</h1>
          <p style={{ margin: 0, color: '#c8c0aa' }}>Optional. For customers who want surgical precision.</p>
          <p style={{ margin: 0, color: '#c8c0aa' }}>This does not change your package unless you choose to.</p>
        </div>

        <AccordionSection title="What the Precision Planner does" description="" defaultOpen={false}>
          <ul className="operator-list" style={{ margin: 0 }}>
            <li>Checks whether your exterior doors are fully covered.</li>
            <li>Suggests camera angles and water-risk coverage.</li>
            <li>Shows what Bronze/Silver/Gold cover for your layout.</li>
            <li>Optional add-ons are quoted separately.</li>
          </ul>
        </AccordionSection>

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
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
              Tip: count any door that leads outside, including garage entry doors.
            </p>
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

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Compare tier</label>
            <select value={selectedTier} onChange={(event) => handleTierChange(event.target.value as PlannerTierKey)}>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
              This only affects the planner comparison, not your checkout flow.
            </p>
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
          <h3 style={{ margin: 0 }}>Planner results</h3>
          {plan ? (
            <>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background:
                    plan.coverage.status === 'gap'
                      ? 'rgba(255, 107, 107, 0.12)'
                      : plan.coverage.status === 'complete_with_addons'
                        ? 'rgba(255, 206, 86, 0.12)'
                        : 'rgba(46, 204, 113, 0.12)',
                }}
              >
                <strong>
                  {plan.coverage.status === 'gap'
                    ? '❌ Gap — fix required items first'
                    : plan.coverage.status === 'complete_with_addons'
                      ? '⚠️ Covered + optional add-ons'
                      : '✅ Covered'}
                </strong>
              </div>

              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'rgba(214, 233, 248, 0.85)' }}>
                {plan.coverage.summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {plan.coverage.gaps.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.35rem' }}>
                  <strong>Coverage gaps</strong>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {plan.coverage.gaps.map((gap) => (
                      <li key={`${gap.key}-${gap.missing}`}>
                        {gap.impact}: missing {gap.missing}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div style={{ display: 'grid', gap: '0.35rem' }}>
                <strong>Required placements</strong>
                {plan.placements.length === 0 ? (
                  <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No placements yet.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {plan.placements.map((placement) => (
                      <li key={`${placement.key}-${placement.label}`}>
                        {placement.label} — {placement.quantity}
                        {placement.zones && placement.zones.length > 0 ? ` (${placement.zones.join(', ')})` : ''}
                        {placement.notes && placement.notes.length > 0 ? ` — ${placement.notes.join(' ')}` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ display: 'grid', gap: '0.35rem' }}>
                <strong>Optional add-ons</strong>
                {plan.optionalAddons.length === 0 ? (
                  <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No optional add-ons suggested.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {plan.optionalAddons.map((addon) => (
                      <li key={`${addon.key}-${addon.label}`}>
                        {addon.label} — {addon.quantity}
                        {addon.zones && addon.zones.length > 0 ? ` (${addon.zones.join(', ')})` : ''}
                        {addon.notes && addon.notes.length > 0 ? ` — ${addon.notes.join(' ')}` : ''}
                      </li>
                    ))}
                  </ul>
                )}
                <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
                  Passive suggestion: Wall-mounted tablet/dashboard (quoted separately).
                </p>
              </div>

              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <strong>Tier comparison</strong>
                <div style={{ display: 'grid', gap: '0.35rem' }}>
                  {plan.bundles.map((bundle) => (
                    <div key={bundle.tier} style={{ color: 'rgba(214, 233, 248, 0.85)' }}>
                      {bundle.top_line}
                    </div>
                  ))}
                </div>
                {tierComparisonNote ? (
                  <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.85)' }}>{tierComparisonNote}</p>
                ) : null}
              </div>
            </>
          ) : (
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.8)' }}>
              Run the planner to see placements, coverage, and tier comparisons.
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleApplyToQuote}>
              Apply to Quote
            </button>
            <button type="button" className="btn btn-link">
              Continue without applying
            </button>
          </div>
          <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.8)' }}>You can change anything on the quote page.</p>
        </div>
      </div>
    </section>
  );
};

export default HomeSecurityPlanner;
