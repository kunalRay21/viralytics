import React from 'react';
import { Lightbulb, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface RecommendationCardProps {
  text: string;
  impact?: 'high' | 'medium' | 'low';
}

export function RecommendationCard({ text, impact = 'medium' }: RecommendationCardProps) {
  const getImpactStyle = (imp: string) => {
    switch (imp) {
      case 'high':
        return {
          label: 'High Impact',
          badgeClass: 'text-red-400 bg-red-500/10 border-red-500/20',
          bulletColor: 'bg-red-400',
          icon: <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
        };
      case 'low':
        return {
          label: 'Low Impact',
          badgeClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          bulletColor: 'bg-blue-400',
          icon: <Lightbulb className="w-5 h-5 text-blue-400 shrink-0" />
        };
      case 'medium':
      default:
        return {
          label: 'Medium Impact',
          badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          bulletColor: 'bg-amber-400',
          icon: <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
        };
    }
  };

  const { label, badgeClass, bulletColor, icon } = getImpactStyle(impact);

  return (
    <div className="glass-panel p-4 flex gap-4 items-start relative overflow-hidden group hover:border-white/15 transition-all">
      {icon}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeClass} uppercase tracking-wider`}>
            {label}
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
          {text}
        </p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors shrink-0 self-center" />
    </div>
  );
}
