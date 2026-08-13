import React from 'react';
import { Sparkles } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface TrendCardProps {
  category: string;
  alignmentScore: number;
  isTop?: boolean;
}

export function TrendCard({ category, alignmentScore, isTop = false }: TrendCardProps) {
  return (
    <div 
      className={`glass-panel p-4.5 transition-all relative overflow-hidden ${
        isTop 
          ? 'border-violet-500/30 bg-violet-600/5 shadow-[0_0_15px_rgba(124,58,237,0.15)] ring-1 ring-violet-500/20' 
          : 'hover:border-white/12'
      }`}
    >
      {isTop && (
        <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 fill-white" />
          Niche Nailing
        </div>
      )}

      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-sm font-bold ${isTop ? 'text-white' : 'text-slate-300'}`}>
          {category}
        </span>
        <span className={`text-xs font-extrabold ${isTop ? 'text-violet-400' : 'text-slate-400'}`}>
          {alignmentScore}%
        </span>
      </div>

      <div className="mt-1">
        <ProgressBar 
          value={alignmentScore} 
          colorFrom={isTop ? 'from-violet-500' : 'from-slate-600'}
          colorTo={isTop ? 'to-indigo-500' : 'to-slate-700'}
        />
      </div>
      
      <p className="text-[10px] text-slate-500 mt-2 font-normal">
        {isTop 
          ? 'Excellent keyword alignment with rising algorithms' 
          : 'Secondary keyword coverage for broader search discovery'}
      </p>
    </div>
  );
}
