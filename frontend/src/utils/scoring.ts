import { VideoAnalysis } from '../types/shared';

export const VPI_WEIGHTS = {
  hookStrength: 0.20,
  retentionPotential: 0.20,
  shareability: 0.15,
  engagementPotential: 0.15,
  trendAlignment: 0.10,
  contentQuality: 0.10,
  audioVisualQuality: 0.10,
} as const;

export function calculateVPI(input: VideoAnalysis): number {
  const raw =
    input.hookStrength * VPI_WEIGHTS.hookStrength +
    input.retentionPotential * VPI_WEIGHTS.retentionPotential +
    input.shareability * VPI_WEIGHTS.shareability +
    input.engagementPotential * VPI_WEIGHTS.engagementPotential +
    input.trendAlignment * VPI_WEIGHTS.trendAlignment +
    input.contentQuality * VPI_WEIGHTS.contentQuality +
    input.audioVisualQuality * VPI_WEIGHTS.audioVisualQuality;
  return Math.round(raw * 10) / 10; // one decimal place
}

export function classifyVPI(vpi: number): 'HIGH' | 'MODERATE' | 'LOW_MODERATE' | 'LOW' {
  if (vpi >= 85) return 'HIGH';
  if (vpi >= 65) return 'MODERATE';
  if (vpi >= 40) return 'LOW_MODERATE';
  return 'LOW';
}
