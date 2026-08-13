import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

interface ScoreRingProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function ScoreRing({ score, label, size = 'md', animate = true }: ScoreRingProps) {
  const displayScore = useCountUp(score, animate ? 1000 : 0);

  // Threshold-based styling
  const getColor = (val: number) => {
    if (val >= 85) return { stroke: '#14b8a6', text: 'text-teal-400', bg: 'rgba(20, 184, 166, 0.1)' };
    if (val >= 65) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'rgba(245, 158, 11, 0.1)' };
    if (val >= 40) return { stroke: '#f97316', text: 'text-orange-500', bg: 'rgba(249, 115, 22, 0.1)' };
    return { stroke: '#ef4444', text: 'text-red-500', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const { stroke, text, bg } = getColor(score);

  // SVG parameters
  let radius = 40;
  let strokeWidth = 6;
  let svgSize = 100;
  let textClass = 'text-2xl font-bold';
  let labelClass = 'text-xs text-slate-400 mt-1';

  if (size === 'sm') {
    radius = 24;
    strokeWidth = 4;
    svgSize = 60;
    textClass = 'text-sm font-semibold';
  } else if (size === 'lg') {
    radius = 70;
    strokeWidth = 10;
    svgSize = 180;
    textClass = 'text-5xl font-extrabold';
    labelClass = 'text-sm text-slate-400 mt-2 font-medium tracking-wide';
  }

  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="relative flex items-center justify-center rounded-full" 
        style={{ width: svgSize, height: svgSize, background: bg }}
      >
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Active progress circle */}
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="transparent"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: animate ? 1.2 : 0, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Floating text inside ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${text} ${textClass}`}>
            {displayScore.toFixed(displayScore % 1 === 0 ? 0 : 1)}
          </span>
          {size === 'lg' && <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">VPI</span>}
        </div>
      </div>
      {label && <span className={labelClass}>{label}</span>}
    </div>
  );
}
