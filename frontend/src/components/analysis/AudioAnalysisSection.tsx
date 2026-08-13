import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Music, Mic, Zap, Eye, Headphones } from 'lucide-react';
import { AudioDetail } from '../../types/shared';
import { AnalysisCard } from '../AnalysisCard';
import { ProgressBar } from '../ProgressBar';

interface AudioAnalysisSectionProps {
  audio: AudioDetail;
  analysisId: string;
}

export function AudioAnalysisSection({ audio, analysisId }: AudioAnalysisSectionProps) {
  // Generate a mock waveform deterministically from the analysis ID
  const generateWaveform = (id: string, count: number = 32) => {
    const heights: number[] = [];
    for (let i = 0; i < count; i++) {
      const code = id.charCodeAt(i % id.length);
      // Height between 10% and 90%
      const h = 10 + (code * (i + 1)) % 80;
      heights.push(h);
    }
    return heights;
  };

  const heights = generateWaveform(analysisId);

  return (
    <AnalysisCard
      id="audio"
      title="Audio & Dialogue Analysis"
      icon={<Volume2 className="w-5 h-5" />}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Waveform and Quality highlights */}
        <div className="flex-grow bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-2">
              Voice Signal Waveform (Synthetic mapping)
            </span>
            
            {/* Animated Waveform */}
            <div className="h-28 flex items-end justify-center gap-1.5 px-4 bg-slate-950/60 rounded-xl border border-white/5 overflow-hidden">
              {heights.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 md:w-2 bg-gradient-to-t from-violet-600 to-teal-400 rounded-full"
                  style={{ height: `${h}%` }}
                  animate={{ 
                    scaleY: [1, 1.25, 0.75, 1.1, 1],
                    // shift heights a bit
                  }}
                  transition={{
                    duration: 1.5 + (i % 3) * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.04
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-6">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-violet-400" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Master Quality</span>
                <span className="text-sm font-extrabold text-white">{audio.audioQuality} / 100</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Vocal Clarity</span>
                <span className="text-sm font-extrabold text-white">{audio.voiceClarity} / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed ratings progress bars */}
        <div className="w-full lg:w-[45%] flex flex-col gap-4.5">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span>Dialogue Vocal Energy</span>
              <span className="text-white font-bold">{audio.energy}%</span>
            </div>
            <ProgressBar value={audio.energy} colorFrom="from-slate-600" colorTo="to-slate-500" />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span>Background Noise Suppression (Higher = cleaner)</span>
              <span className="text-white font-bold">{audio.backgroundNoise}%</span>
            </div>
            <ProgressBar value={audio.backgroundNoise} colorFrom="from-slate-600" colorTo="to-slate-500" />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span>Beat Sync pacing (Cut alignments)</span>
              <span className="text-white font-bold">{audio.beatSync}%</span>
            </div>
            <ProgressBar value={audio.beatSync} colorFrom="from-slate-600" colorTo="to-slate-500" />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span>Trending Audio track alignment</span>
              <span className="text-white font-bold">{audio.trendAlignment}%</span>
            </div>
            <ProgressBar value={audio.trendAlignment} colorFrom="from-slate-600" colorTo="to-slate-500" />
          </div>
        </div>
      </div>
    </AnalysisCard>
  );
}
