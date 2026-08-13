import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, Circle } from 'lucide-react';
import { fadeUp } from '../animations/variants';

interface ProcessingPipelineProps {
  onComplete: () => void;
}

const STAGES = [
  { label: 'Uploading video metadata', duration: 800 },
  { label: 'Extracting keyframes', duration: 700 },
  { label: 'Analyzing visual pacing & hooks', duration: 900 },
  { label: 'Processing speech transcripts', duration: 700 },
  { label: 'Analyzing emotional vectors', duration: 800 },
  { label: 'Evaluating vocal clarity & audio quality', duration: 700 },
  { label: 'Predicting audience retention curves', duration: 800 },
  { label: 'Measuring shareability factors', duration: 700 },
  { label: 'Computing Viral Potential Index (VPI)', duration: 600 },
  { label: 'Generating actionable AI prescriptions', duration: 700 }
];

export function ProcessingPipeline({ onComplete }: ProcessingPipelineProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (currentIdx >= STAGES.length) {
      // Delay slightly before trigger
      const finishTimeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(finishTimeout);
    }

    const currentStage = STAGES[currentIdx];
    const timer = setTimeout(() => {
      setCompleted(prev => [...prev, currentIdx]);
      setCurrentIdx(prev => prev + 1);
    }, currentStage.duration);

    return () => clearTimeout(timer);
  }, [currentIdx, onComplete]);

  // Overall percentage helper
  const totalDuration = STAGES.reduce((sum, s) => sum + s.duration, 0);
  const completedDuration = STAGES.slice(0, currentIdx).reduce((sum, s) => sum + s.duration, 0);
  const progressPercent = Math.min(100, Math.round((completedDuration / totalDuration) * 100));

  return (
    <div className="w-full max-w-lg mx-auto glass-panel p-6 md:p-8 flex flex-col items-center">
      <div className="w-16 h-16 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mb-6">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Analyzing Video Content</h3>
      <p className="text-sm text-slate-400 text-center mb-8 max-w-sm leading-relaxed">
        Our mock multithreaded evaluation pipeline is analyzing hook strength, emotional response patterns, and retention models...
      </p>

      {/* Main Progress Bar */}
      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Stage Items */}
      <div className="w-full flex flex-col gap-3.5">
        {STAGES.map((stage, idx) => {
          const isCurrent = idx === currentIdx;
          const isDone = completed.includes(idx);
          const isPending = idx > currentIdx;

          let statusClass = 'text-slate-500 opacity-40';
          let borderGlow = 'border-transparent';

          if (isCurrent) {
            statusClass = 'text-violet-400 font-bold scale-102';
            borderGlow = 'bg-violet-600/5 border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]';
          } else if (isDone) {
            statusClass = 'text-slate-300';
          }

          return (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={`flex items-center gap-3.5 p-3 rounded-xl border border-transparent transition-all duration-300 ${borderGlow}`}
            >
              <div className="shrink-0 flex items-center justify-center">
                {isDone ? (
                  <div className="p-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : isCurrent ? (
                  <Loader2 className="w-4.5 h-4.5 text-violet-400 animate-spin" />
                ) : (
                  <Circle className="w-4.5 h-4.5 text-slate-700" />
                )}
              </div>
              <span className={`text-xs md:text-sm tracking-wide ${statusClass}`}>
                {stage.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
