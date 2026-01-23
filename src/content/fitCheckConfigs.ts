import { VerticalKey } from '../lib/verticals';

export type FitCheckAnswer = string | string[];
export type FitCheckAnswers = Record<string, FitCheckAnswer>;

export type FitCheckOption = {
  value: string;
  label: string;
  helper?: string;
  uncertain?: boolean;
  exclusive?: boolean;
};

export type FitCheckQuestion = {
  id: string;
  prompt: string;
  helper?: string;
  type: 'single' | 'multi';
  options: FitCheckOption[];
  limit?: number;
  required?: boolean;
};

export type FitCheckTier = 'bronze' | 'silver' | 'gold';

export type FitCheckRecommendation = {
  tier: FitCheckTier;
  basedOn: string;
  why: string[];
};

export type FitCheckTierContent = {
  label: string;
  included: string[];
};

export type FitCheckCta = {
  label: string;
  to: string;
  variant?: 'primary' | 'secondary' | 'link';
};

export type FitCheckConfig = {
  verticalId: VerticalKey;
  heroTitle: string;
  heroSubtitle: string;
  breadcrumb: { label: string; href?: string }[];
  questions: FitCheckQuestion[];
  tiers: Record<FitCheckTier, FitCheckTierContent>;
  ctas: FitCheckCta[];
  getRecommendation: (answers: FitCheckAnswers) => FitCheckRecommendation;
};

const getSingle = (answers: FitCheckAnswers, id: string) => (typeof answers[id] === 'string' ? answers[id] : '');
const getMulti = (answers: FitCheckAnswers, id: string) => (Array.isArray(answers[id]) ? answers[id] : []);

const buildHomeSecurityRecommendation = (answers: FitCheckAnswers): FitCheckRecommendation => {
  const q1 = getSingle(answers, 'perimeter-video');
  const q2 = getSingle(answers, 'live-view');
  const q3 = getSingle(answers, 'entry-points');
  const q4 = getMulti(answers, 'exterior-areas');
  const q5 = getSingle(answers, 'indoor-areas');
  const q6 = getMulti(answers, 'special-rooms').filter((value) => value !== 'not-really');
  const q7 = getSingle(answers, 'home-size');

  const q1Full = q1 === 'full';
  const q3AtLeastThree = q3 === '3-4' || q3 === '5+';
  const q3FivePlus = q3 === '5+';
  const q5ThreePlus = q5 === '3+';
  const q7Large = q7 === 'large-complex';
  const q2Regular = q2 === 'regularly';

  const exteriorCoverageSet = new Set(['driveway', 'back-door', 'side-yard']);
  const exteriorCoverageCount = q4.filter((value) => exteriorCoverageSet.has(value)).length;
  const hasSpecialRooms = q6.length > 0;

  const bronzeOnly = q1 === 'none' && q3 === '1-2' && q5 === 'none';
  const goldFit =
    (q1Full && q3AtLeastThree) ||
    q3FivePlus ||
    q5ThreePlus ||
    (q7Large && q2Regular) ||
    (hasSpecialRooms && exteriorCoverageCount >= 2);

  const tier: FitCheckTier = bronzeOnly ? 'bronze' : goldFit ? 'gold' : 'silver';

  const videoSummary =
    q1 === 'full' ? 'full perimeter video' : q1 === 'couple' ? 'select perimeter cameras' : 'no perimeter cameras yet';
  const entrySummary = q3 === '5+' ? '5+ entry points' : q3 === '3-4' ? '3–4 entry points' : '1–2 entry points';
  const indoorSummary =
    q5 === '3+' ? '3+ indoor areas' : q5 === '1-2' ? '1–2 indoor areas' : 'no indoor areas';

  const basedOn = [videoSummary, entrySummary, indoorSummary].join(', ');

  const whyCandidates: string[] = [];

  if (hasSpecialRooms) {
    whyCandidates.push('Special rooms add priority zones to cover.');
  }
  if (exteriorCoverageCount >= 2) {
    whyCandidates.push('Multiple exterior zones need video coverage.');
  }
  if (q7Large && q2Regular) {
    whyCandidates.push('Regular live viewing in a large home needs more headroom.');
  }

  if (q1 === 'full') {
    whyCandidates.push('Full perimeter video suggests wider exterior coverage.');
  } else if (q1 === 'couple') {
    whyCandidates.push('A couple of exterior angles keeps the plan focused.');
  } else {
    whyCandidates.push('You’re starting without perimeter video.');
  }

  if (q3 === '5+') {
    whyCandidates.push('Many entry points need consistent sensor coverage.');
  } else if (q3 === '3-4') {
    whyCandidates.push('Multiple entry points call for balanced protection.');
  } else {
    whyCandidates.push('A small number of entry points keeps the setup lean.');
  }

  if (q5 === '3+') {
    whyCandidates.push('Several indoor areas benefit from added visibility.');
  } else if (q5 === '1-2') {
    whyCandidates.push('A few indoor areas need coverage.');
  } else {
    whyCandidates.push('No indoor areas were selected for coverage.');
  }

  return {
    tier,
    basedOn,
    why: whyCandidates.slice(0, 3),
  };
};

const homeSecurityConfig: FitCheckConfig = {
  verticalId: 'home-security',
  heroTitle: 'Find the Home Security tier that fits your space.',
  heroSubtitle: 'Answer eight quick questions and get an instant Bronze / Silver / Gold recommendation.',
  breadcrumb: [
    { label: 'Home Security', href: '/home-security' },
    { label: 'Fit Check' },
  ],
  questions: [
    {
      id: 'perimeter-video',
      prompt: 'How much perimeter video coverage do you want?',
      type: 'single',
      options: [
        { value: 'none', label: 'None yet' },
        { value: 'couple', label: 'A couple of exterior angles' },
        { value: 'full', label: 'Full perimeter coverage' },
      ],
    },
    {
      id: 'live-view',
      prompt: 'How often do you plan to check live video?',
      type: 'single',
      options: [
        { value: 'no', label: 'Rarely or never' },
        { value: 'occasionally', label: 'Occasionally' },
        { value: 'regularly', label: 'Regularly' },
      ],
    },
    {
      id: 'entry-points',
      prompt: 'How many exterior entry points need coverage?',
      type: 'single',
      options: [
        { value: '1-2', label: '1–2' },
        { value: '3-4', label: '3–4' },
        { value: '5+', label: '5+' },
      ],
    },
    {
      id: 'exterior-areas',
      prompt: 'Which exterior areas matter most? (Pick up to 2.)',
      helper: 'We’ll prioritize these for exterior coverage.',
      type: 'multi',
      limit: 2,
      options: [
        { value: 'front-door', label: 'Front door' },
        { value: 'driveway', label: 'Driveway' },
        { value: 'back-door', label: 'Back door' },
        { value: 'side-yard', label: 'Side yard' },
        { value: 'garage-outbuilding', label: 'Garage / outbuilding' },
      ],
    },
    {
      id: 'indoor-areas',
      prompt: 'How many indoor areas need coverage?',
      type: 'single',
      options: [
        { value: 'none', label: 'None' },
        { value: '1-2', label: '1–2' },
        { value: '3+', label: '3+' },
      ],
    },
    {
      id: 'special-rooms',
      prompt: 'Any special rooms that need extra attention?',
      helper: 'Pick all that apply.',
      type: 'multi',
      options: [
        { value: 'home-office', label: 'Home office / valuables' },
        { value: 'safe-room', label: 'Safe room' },
        { value: 'theater', label: 'Mancave / theater' },
        { value: 'nursery', label: 'Nursery / caregiver area' },
        { value: 'not-really', label: 'Not really', exclusive: true },
      ],
    },
    {
      id: 'home-size',
      prompt: 'How would you describe the home size?',
      type: 'single',
      options: [
        { value: 'small', label: 'Small / simple layout' },
        { value: 'typical', label: 'Typical' },
        { value: 'large-complex', label: 'Large / complex' },
      ],
    },
    {
      id: 'preference',
      prompt: 'What best matches your preference?',
      type: 'single',
      options: [
        { value: 'simple', label: 'Keep it simple' },
        { value: 'balanced', label: 'Balanced coverage' },
        { value: 'maximum', label: 'Maximum coverage' },
      ],
    },
  ],
  tiers: {
    bronze: {
      label: 'Bronze',
      included: [
        'Entry sensors focused on the primary doors or windows.',
        'Local-first siren + alert automations for quick response.',
        'Home Assistant dashboard setup and handoff walkthrough.',
      ],
    },
    silver: {
      label: 'Silver',
      included: [
        'Expanded entry sensors plus exterior video at key angles.',
        'Indoor visibility for the most important rooms.',
        'Balanced automation playbooks (lights, siren, alerts).',
      ],
    },
    gold: {
      label: 'Gold',
      included: [
        'Full perimeter coverage plus multiple indoor zones.',
        'Priority coverage for special rooms and larger layouts.',
        'Advanced automation tuning and white-glove install support.',
      ],
    },
  },
  ctas: [
    { label: 'Schedule a walkthrough', to: '/schedule?vertical=home-security', variant: 'primary' },
    { label: 'Request a quote', to: '/quote?vertical=home-security', variant: 'secondary' },
    { label: 'Email us', to: '/contact?vertical=home-security', variant: 'link' },
  ],
  getRecommendation: buildHomeSecurityRecommendation,
};

export const fitCheckConfigs: Partial<Record<VerticalKey, FitCheckConfig>> = {
  'home-security': homeSecurityConfig,
};

export const getFitCheckConfig = (vertical: VerticalKey) => fitCheckConfigs[vertical];
