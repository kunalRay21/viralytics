import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function ProgressBar({ value, max = 100, colorFrom = 'from-violet-500', colorTo = 'to-indigo-500' }: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${colorFrom} ${colorTo} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}
