import React, { useState, useEffect } from 'react';
import { Activity, RotateCcw, TrendingUp, Sparkles } from 'lucide-react';
import { VideoAnalysis } from '../../types/shared';
import { AnalysisCard } from '../AnalysisCard';
import { SimulatorSlider } from '../SimulatorSlider';
import { runVPISimulation } from '../../utils/simulator';

interface ViralitySimulatorSectionProps {
  scores: VideoAnalysis;
  originalVpi: number;
  onSimulate: (simulatedVpi: number, delta: number, simulatedScores: VideoAnalysis) => void;
}

export function ViralitySimulatorSection({ scores, originalVpi, onSimulate }: ViralitySimulatorSectionProps) {
  // State for all simulator inputs
  const [hookStrength, setHookStrength] = useState(scores.hookStrength);
  const [durationDelta, setDurationDelta] = useState(0);
  const [captionStrength, setCaptionStrength] = useState(70);
  const [emotionalIntensity, setEmotionalIntensity] = useState(scores.contentQuality);
  const [endingStrength, setEndingStrength] = useState(70);
  const [ctaStrength, setCtaStrength] = useState(70);

  const [simulatedVpi, setSimulatedVpi] = useState(originalVpi);
  const [delta, setDelta] = useState(0);

  // Recalculate whenever inputs change
  useEffect(() => {
    const { simulatedScores, simulatedVpi: newVpi } = runVPISimulation(scores, {
      hookStrength,
      durationDeltaSeconds: durationDelta,
      captionStrength,
      emotionalIntensity,
      endingStrength,
      ctaStrength
    });

    const diff = Math.round((newVpi - originalVpi) * 10) / 10;
    setSimulatedVpi(newVpi);
    setDelta(diff);

    onSimulate(newVpi, diff, simulatedScores);
  }, [
    hookStrength,
    durationDelta,
    captionStrength,
    emotionalIntensity,
    endingStrength,
    ctaStrength,
    scores,
    originalVpi
  ]);

  const handleReset = () => {
    setHookStrength(scores.hookStrength);
    setDurationDelta(0);
    setCaptionStrength(70);
    setEmotionalIntensity(scores.contentQuality);
    setEndingStrength(70);
    setCtaStrength(70);
  };

  return (
    <AnalysisCard
      id="simulator"
      title="Interactive Virality Simulator"
      icon={<Activity className="w-5 h-5 animate-pulse" />}
    >
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Left Column: Sliders */}
        <div className="flex-grow flex flex-col gap-6">
          <SimulatorSlider
            label="Visual Hook Rate"
            value={hookStrength}
            min={0}
            max={100}
            onChange={setHookStrength}
            suffix="%"
          />

          <SimulatorSlider
            label="Video Duration Shift"
            value={durationDelta}
            min={-15}
            max={15}
            onChange={setDurationDelta}
            suffix="s"
          />

          <SimulatorSlider
            label="Caption Writing Strength"
            value={captionStrength}
            min={0}
            max={100}
            onChange={setCaptionStrength}
            suffix="%"
          />

          <SimulatorSlider
            label="Emotional Intensity Vector"
            value={emotionalIntensity}
            min={0}
            max={100}
            onChange={setEmotionalIntensity}
            suffix="%"
          />

          <SimulatorSlider
            label="Ending Hold Strength"
            value={endingStrength}
            min={0}
            max={100}
            onChange={setEndingStrength}
            suffix="%"
          />

          <SimulatorSlider
            label="Call-To-Action (CTA) Force"
            value={ctaStrength}
            min={0}
            max={100}
            onChange={setCtaStrength}
            suffix="%"
          />
        </div>

        {/* Right Column: Dynamic scoring readout */}
        <div className="w-full lg:w-[35%] shrink-0">
          <div className="glass-panel p-6 bg-slate-900/60 border-white/5 h-full flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-glow-violet pointer-events-none rounded-full" />
            
            <div>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-2">Simulated Outcome</span>
              <h3 className="text-sm font-bold text-white mb-6">Viral Potential Projection</h3>
            </div>

            <div className="my-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-extrabold text-white leading-none tracking-tight">
                  {simulatedVpi.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500 font-bold uppercase">VPI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-2">
                Original VPI: {originalVpi.toFixed(1)}
              </p>

              {/* Delta Badge */}
              <div className="mt-4 flex justify-center">
                {delta > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{delta.toFixed(1)} VPI Improvement
                  </span>
                ) : delta < 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {delta.toFixed(1)} VPI Decrease
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-400 bg-slate-500/10 border border-slate-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    No Delta Shift
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <p className="text-[10px] text-slate-500 leading-normal font-normal text-left">
                ℹ️ Recalculates dynamically client-side using identical weight formulas as the backend mock scoring engine.
              </p>
              <button
                onClick={handleReset}
                className="py-3 bg-slate-950 border border-white/8 hover:bg-slate-900 active:scale-98 text-xs font-extrabold text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Original
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnalysisCard>
  );
}
