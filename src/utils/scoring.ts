import { Claim, Weights, RiskBucket, SHAPFactor } from '../types';

export function calculateRiskScore(claim: Claim, weights: Weights): number | null {
  if (!claim.providerId) return null; // Insufficient Data Case

  let score = 20; // base score
  const ratio = claim.claimAmount / (claim.premiumAmount || 1);

  // Policy age calculation
  const pDate = new Date(claim.policyStartDate);
  const iDate = new Date(claim.incidentDate);
  const diffDays = Math.max(0, (iDate.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 30) score += weights.policyAge;
  if (ratio > 3) score += Math.min(35, ratio * (weights.ratioMultiplier / 10));
  if (claim.providerHistoryCount > 5) score += weights.providerHistory;
  if (!claim.policeReport && claim.claimAmount > 5000) score += weights.noPoliceReport;

  return Math.min(99, Math.max(5, Math.round(score)));
}

export function getRiskBucket(score: number | null, riskThreshold: number): RiskBucket {
  if (score === null) {
    return {
      label: 'Insufficient Data',
      color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
    };
  }
  if (score >= riskThreshold) {
    return {
      label: 'High Risk',
      color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/50'
    };
  }
  if (score >= 40) {
    return {
      label: 'Medium Risk',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
    };
  }
  return {
    label: 'Low Risk',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
  };
}

export function generateSHAPFactors(claim: Partial<Claim>): SHAPFactor[] {
  const factors: SHAPFactor[] = [];
  const ratio = (claim.claimAmount || 1) / (claim.premiumAmount || 1);

  if (ratio > 5) {
    factors.push({ factor: `Claim-to-premium ratio extreme: ${ratio.toFixed(1)}x`, weight: 35, impact: 'positive' });
  } else if (ratio > 2.5) {
    factors.push({ factor: `Claim-to-premium ratio elevated: ${ratio.toFixed(1)}x`, weight: 22, impact: 'positive' });
  } else {
    factors.push({ factor: `Normal claim-to-premium ratio (${ratio.toFixed(1)}x)`, weight: 20, impact: 'negative' });
  }

  if (claim.providerId === 'GAR-402') {
    factors.push({ factor: 'Associated with flagged provider network (GAR-402)', weight: 32, impact: 'positive' });
  } else if (!claim.providerId) {
    factors.push({ factor: 'No certified provider ID attached', weight: 28, impact: 'positive' });
  } else {
    factors.push({ factor: 'Certified provider with positive rating', weight: 15, impact: 'negative' });
  }

  if (claim.policeReport) {
    factors.push({ factor: 'Official police incident report verified', weight: 18, impact: 'negative' });
  } else if ((claim.claimAmount || 0) > 4000) {
    factors.push({ factor: 'High value claim lacking police verification', weight: 25, impact: 'positive' });
  }

  return factors;
}
