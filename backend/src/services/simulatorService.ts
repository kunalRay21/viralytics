import { VideoAnalysis } from '../types/shared';
import { calculateVPI } from './scoringEngine';

export interface SimulatorAdjustments {
  hookStrength?: number;
  durationDeltaSeconds?: number;
  captionStrength?: number;
  emotionalIntensity?: number;
  endingStrength?: number;
  ctaStrength?: number;
}

export function runVPISimulation(
  originalScores: VideoAnalysis,
  adjustments: SimulatorAdjustments
): { simulatedScores: VideoAnalysis; simulatedVpi: number } {
  const simulatedScores = { ...originalScores };

  // 1. Hook Strength maps directly
  if (adjustments.hookStrength !== undefined) {
    simulatedScores.hookStrength = Math.max(0, Math.min(100, adjustments.hookStrength));
  }

  // 2. Video Duration maps indirectly: shorter relative durations trend retention up, longer down.
  // Formula: retentionPotential = original - (durationDeltaSeconds * 0.5)
  if (adjustments.durationDeltaSeconds !== undefined) {
    const originalRetention = originalScores.retentionPotential;
    // We adjust retention based on duration change, and also factor in ending strength if provided
    let endingOffset = 0;
    if (adjustments.endingStrength !== undefined) {
      endingOffset = (adjustments.endingStrength - 50) * 0.3; // slider 0-100 centered at 50
    }
    const durationOffset = adjustments.durationDeltaSeconds * 0.5;
    simulatedScores.retentionPotential = Math.max(0, Math.min(100, Math.round(originalRetention - durationOffset + endingOffset)));
  } else if (adjustments.endingStrength !== undefined) {
    // If only endingStrength is provided
    const endingOffset = (adjustments.endingStrength - 50) * 0.3;
    simulatedScores.retentionPotential = Math.max(0, Math.min(100, Math.round(originalScores.retentionPotential + endingOffset)));
  }

  // 3. Caption Strength, Emotional Intensity, and CTA Strength modify engagementPotential
  let engagementOffset = 0;
  if (adjustments.captionStrength !== undefined) {
    engagementOffset += (adjustments.captionStrength - 50) * 0.2;
  }
  if (adjustments.ctaStrength !== undefined) {
    engagementOffset += (adjustments.ctaStrength - 50) * 0.25;
  }
  
  if (adjustments.emotionalIntensity !== undefined) {
    // Emotional Intensity sets contentQuality directly
    simulatedScores.contentQuality = Math.max(0, Math.min(100, adjustments.emotionalIntensity));
    // And offsets engagement potential
    engagementOffset += (adjustments.emotionalIntensity - 50) * 0.2;
  }

  simulatedScores.engagementPotential = Math.max(0, Math.min(100, Math.round(originalScores.engagementPotential + engagementOffset)));

  const simulatedVpi = calculateVPI(simulatedScores);

  return {
    simulatedScores,
    simulatedVpi
  };
}
