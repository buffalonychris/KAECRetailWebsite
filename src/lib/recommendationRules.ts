export type HomeSize = 'small' | 'medium' | 'large';
export type CaregiverSituation = 'solo' | 'shared' | 'professional';
export type RiskLevel = 'low' | 'medium' | 'high';
export type TechComfort = 'low' | 'medium' | 'high';
export type InternetReliability = 'good' | 'spotty' | 'none';
export type BudgetRange = 'entry' | 'core' | 'expanded' | 'flexible';

export type RecommendationInput = {
  homeSize: HomeSize;
  caregiverSituation: CaregiverSituation;
  fallRisk: RiskLevel;
  techComfort: TechComfort;
  internetReliability: InternetReliability;
  budgetRange: BudgetRange;
};

export type RecommendationResult = {
  tier: 'A1' | 'A2' | 'A3';
  rationale: string;
  suggestedAddOns: string[];
  installComplexity: number; // 1-5
  offlineReadiness: number; // 1-5
};

const clampTierByBudget = (tier: RecommendationResult['tier'], budget: BudgetRange) => {
  if (budget === 'entry') return 'A1';
  if (budget === 'core') return tier === 'A3' ? 'A2' : tier;
  if (budget === 'expanded') return tier === 'A1' ? 'A2' : tier;
  return tier;
};

const baseRationale: Record<RecommendationResult['tier'], string> = {
  A1: 'Elder Care Bronze keeps essentials covered with a single Home Assistant hub and a straightforward install.',
  A2: 'Elder Care Silver expands lighting, cameras, and alerts so caregivers can see issues sooner without more apps.',
  A3: 'Elder Care Gold hardens the whole property with pro-grade recording, redundancy, and cellular options.',
};

const offlineBaseline: Record<RecommendationResult['tier'], number> = {
  A1: 3,
  A2: 4,
  A3: 5,
};

const complexityBaseline: Record<RecommendationResult['tier'], number> = {
  A1: 2,
  A2: 3,
  A3: 4,
};

export const buildRecommendation = (input: RecommendationInput): RecommendationResult => {
  let score = 0;

  if (input.homeSize === 'medium') score += 1;
  if (input.homeSize === 'large') score += 3;

  if (input.caregiverSituation === 'shared') score += 1;
  if (input.caregiverSituation === 'professional') score += 2;

  if (input.fallRisk === 'medium') score += 2;
  if (input.fallRisk === 'high') score += 3;

  if (input.techComfort === 'high') score += 1;
  if (input.techComfort === 'low') score -= 1;

  if (input.internetReliability === 'spotty') score += 1;
  if (input.internetReliability === 'none') score += 2;

  let tier: RecommendationResult['tier'];
  if (score >= 6) {
    tier = 'A3';
  } else if (score >= 3) {
    tier = 'A2';
  } else {
    tier = 'A1';
  }

  tier = clampTierByBudget(tier, input.budgetRange);

  const suggestedAddOns: string[] = [];

  if (input.internetReliability !== 'good') {
    suggestedAddOns.push('Cellular backup path for alerts when available');
  }

  if (input.homeSize === 'large') {
    suggestedAddOns.push('Extra exterior lighting and entry sensors for wide footprints');
  }

  if (input.fallRisk !== 'low') {
    suggestedAddOns.push('Voice-friendly panic triggers mapped to Home Assistant');
  }

  if (input.caregiverSituation === 'solo') {
    suggestedAddOns.push('Automated daily check-ins with simple acknowledgments');
  }

  const installComplexity = Math.min(
    5,
    complexityBaseline[tier] + (input.homeSize === 'large' ? 1 : 0) + (input.techComfort === 'low' ? 0 : 1),
  );

  const offlineReadiness = Math.max(
    1,
    Math.min(5, offlineBaseline[tier] - (input.internetReliability === 'good' ? 0 : -1)),
  );

  const rationaleParts = [baseRationale[tier]];

  if (input.internetReliability !== 'good') {
    rationaleParts.push('Built to keep automations running on-site when the connection drops.');
  }

  if (input.fallRisk !== 'low') {
    rationaleParts.push('Adds clearer pathways and alerts to reduce fall impact.');
  }

  if (input.caregiverSituation === 'professional') {
    rationaleParts.push('Supports team access controls and local recording for accountability.');
  }

  return {
    tier,
    rationale: rationaleParts.join(' '),
    suggestedAddOns,
    installComplexity,
    offlineReadiness,
  };
};
