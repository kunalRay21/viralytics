import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Share2, 
  Heart, 
  Flame, 
  Eye, 
  Volume2, 
  MessageSquare,
  HelpCircle 
} from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface MetricCardProps {
  title: string;
  score: number;
  explanation: string;
  status: 'excellent' | 'good' | 'needs-improvement' | 'weak';
}

export function MetricCard({ title, score, explanation, status }: MetricCardProps) {
  // Determine Lucide Icon based on Title
  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('hook')) return <Zap className="w-5 h-5 text-violet-400" />;
    if (n.includes('retention')) return <TrendingUp className="w-5 h-5 text-indigo-400" />;
    if (n.includes('share')) return <Share2 className="w-5 h-5 text-blue-400" />;
    if (n.includes('emotion') || n.includes('quality') && n.includes('visual')) return <Heart className="w-5 h-5 text-pink-400" />;
    if (n.includes('trend')) return <Flame className="w-5 h-5 text-amber-400" />;
    if (n.includes('visual') || n.includes('eye')) return <Eye className="w-5 h-5 text-teal-400" />;
    if (n.includes('audio') || n.includes('volume')) return <Volume2 className="w-5 h-5 text-cyan-400" />;
    if (n.includes('engagement') || n.includes('message')) return <MessageSquare className="w-5 h-5 text-emerald-400" />;
    return <HelpCircle className="w-5 h-5 text-slate-400" />;
  };

  const getStatusConfig = (st: string) => {
    switch (st) {
      case 'excellent':
        return {
          label: 'Excellent',
          badgeClass: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
          gradient: { from: 'from-teal-500', to: 'to-emerald-500' }
        };
      case 'good':
        return {
          label: 'Good',
          badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          gradient: { from: 'from-amber-500', to: 'to-yellow-500' }
        };
      case 'needs-improvement':
        return {
          label: 'Needs Imp.',
          badgeClass: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
          gradient: { from: 'from-orange-500', to: 'to-amber-500' }
        };
      case 'weak':
      default:
        return {
          label: 'Weak',
          badgeClass: 'text-red-400 bg-red-500/10 border-red-500/20',
          gradient: { from: 'from-red-500', to: 'to-rose-500' }
        };
    }
  };

  const { label, badgeClass, gradient } = getStatusConfig(status);

  return (
    <div className="glass-panel glass-panel-hover p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon(title)}
            <h4 className="text-sm font-semibold text-slate-300 tracking-wide">{title}</h4>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass} uppercase tracking-wider`}>
            {label}
          </span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-white">{score}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
        
        <div className="my-3">
          <ProgressBar value={score} colorFrom={gradient.from} colorTo={gradient.to} />
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed font-normal mt-2">
        {explanation}
      </p>
    </div>
  );
}
