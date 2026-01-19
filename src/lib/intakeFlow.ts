import {
  BudgetRange,
  CaregiverSituation,
  HomeSize,
  InternetReliability,
  RecommendationInput,
  RecommendationResult,
  RiskLevel,
  TechComfort,
  buildRecommendation,
} from './recommendationRules';
import { PackageTierId } from '../data/pricing';

export type IntakeType = 'residential' | 'business';

export type IntakeStepId =
  | 'Step001'
  | 'Step002'
  | 'Step003'
  | 'Step004'
  | 'Step005'
  | 'Step006'
  | 'Step007'
  | 'Step008'
  | 'Step009'
  | 'Step012'
  | 'Step013';

export type IntakeDraft = {
  intakeType: IntakeType;
  precheckConfirmed: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organizationName: string;
  residentName: string;
  propertyType: string;
  locationCount: string;
  homeSize: HomeSize;
  caregiverSituation: CaregiverSituation;
  fallRisk: RiskLevel;
  techComfort: TechComfort;
  internetReliability: InternetReliability;
  budgetRange: BudgetRange;
  timeline: string;
  notes: string;
  packageOverride?: PackageTierId | '';
};

export type IntakeEvent = {
  id: string;
  stepId: IntakeStepId;
  name: string;
  timestampISO: string;
  payload?: Record<string, unknown>;
};

export type IntakeStub = {
  id: string;
  type: 'owner' | 'customer' | 'installer';
  displayName: string;
  status: 'stub';
  createdAtISO: string;
};

export type IntakeRecord = {
  id: string;
  submittedAtISO: string;
  draft: IntakeDraft;
  recommendation: RecommendationResult;
  finalTier: PackageTierId;
  overrideApplied: boolean;
  events: IntakeEvent[];
  stubs: IntakeStub[];
};

export type IntakeState = {
  draft: IntakeDraft;
  lastRecord?: IntakeRecord;
  eventLog: IntakeEvent[];
};

export const INTAKE_STORAGE_KEY = 'kaecIntakeState';

export const defaultIntakeDraft: IntakeDraft = {
  intakeType: 'residential',
  precheckConfirmed: false,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  organizationName: '',
  residentName: '',
  propertyType: '',
  locationCount: '',
  homeSize: 'small',
  caregiverSituation: 'solo',
  fallRisk: 'low',
  techComfort: 'medium',
  internetReliability: 'good',
  budgetRange: 'core',
  timeline: '',
  notes: '',
  packageOverride: '',
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `intake-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const loadIntakeState = (): IntakeState => {
  try {
    const stored = localStorage.getItem(INTAKE_STORAGE_KEY);
    if (!stored) {
      return { draft: { ...defaultIntakeDraft }, eventLog: [] };
    }
    const parsed = JSON.parse(stored) as IntakeState;
    return {
      draft: { ...defaultIntakeDraft, ...parsed.draft },
      lastRecord: parsed.lastRecord,
      eventLog: parsed.eventLog ?? [],
    };
  } catch (error) {
    console.error('Error loading intake state', error);
    return { draft: { ...defaultIntakeDraft }, eventLog: [] };
  }
};

export const saveIntakeState = (state: IntakeState) => {
  localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(state));
  return state;
};

export const updateIntakeDraft = (patch: Partial<IntakeDraft>) => {
  const current = loadIntakeState();
  const draft = { ...current.draft, ...patch };
  saveIntakeState({ ...current, draft });
  return draft;
};

export const resetIntakeDraft = (overrides: Partial<IntakeDraft> = {}) => {
  const next = { ...defaultIntakeDraft, ...overrides };
  saveIntakeState({ draft: next, lastRecord: undefined, eventLog: [] });
  return next;
};

export const buildIntakeRecommendation = (draft: IntakeDraft): RecommendationResult => {
  const input: RecommendationInput = {
    homeSize: draft.homeSize,
    caregiverSituation: draft.caregiverSituation,
    fallRisk: draft.fallRisk,
    techComfort: draft.techComfort,
    internetReliability: draft.internetReliability,
    budgetRange: draft.budgetRange,
  };
  return buildRecommendation(input);
};

export const createIntakeEvent = (stepId: IntakeStepId, name: string, payload?: Record<string, unknown>): IntakeEvent => ({
  id: createId(),
  stepId,
  name,
  timestampISO: new Date().toISOString(),
  payload,
});

export const createIntakeStubs = (draft: IntakeDraft): IntakeStub[] => {
  const createdAtISO = new Date().toISOString();
  const orgLabel = draft.organizationName || 'Organization';
  const ownerLabel = draft.contactName || orgLabel;
  const customerLabel = draft.residentName || orgLabel;

  return [
    {
      id: createId(),
      type: 'owner',
      displayName: ownerLabel,
      status: 'stub',
      createdAtISO,
    },
    {
      id: createId(),
      type: 'customer',
      displayName: customerLabel,
      status: 'stub',
      createdAtISO,
    },
    {
      id: createId(),
      type: 'installer',
      displayName: 'Installer queue',
      status: 'stub',
      createdAtISO,
    },
  ];
};

export const finalizeIntake = (draft: IntakeDraft): IntakeRecord => {
  const recommendation = buildIntakeRecommendation(draft);
  const overrideTier = draft.packageOverride && draft.packageOverride !== '' ? draft.packageOverride : undefined;
  const finalTier = overrideTier ?? recommendation.tier;
  const events = [
    createIntakeEvent('Step012', 'Intake completion event emitted', {
      intakeType: draft.intakeType,
      recommendedTier: recommendation.tier,
      finalTier,
      overrideApplied: Boolean(overrideTier),
    }),
  ];

  const stubs = createIntakeStubs(draft);
  events.push(
    createIntakeEvent('Step013', 'Owner, customer, and installer stubs created', {
      stubCount: stubs.length,
    }),
  );

  const record: IntakeRecord = {
    id: createId(),
    submittedAtISO: new Date().toISOString(),
    draft,
    recommendation,
    finalTier,
    overrideApplied: Boolean(overrideTier),
    events,
    stubs,
  };

  const current = loadIntakeState();
  const eventLog = [...current.eventLog, ...events];
  saveIntakeState({ draft, lastRecord: record, eventLog });

  return record;
};
