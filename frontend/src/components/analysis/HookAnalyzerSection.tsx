import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { HookAnalysis } from '../../types/shared';
import { AnalysisCard } from '../AnalysisCard';
import { Zap, Eye, Mic, Star } from 'lucide-react';

interface HookAnalyzerSectionProps {
  hook: HookAnalysis;
}

export function HookAnalyzerSection({ hook }: HookAnalyzerSectionProps) {
  const getSignalBadgeColor = (sig: string) => {
    if (sig === 'High') return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    if (sig === 'Medium') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <AnalysisCard 
      id="hook"
      title={`Hook Analyzer (Score: ${hook.score}/100)`}
      icon={<Zap className="w-5 h-5" />}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Stats & Description */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-sm text-slate-300 leading-relaxed font-semibold mb-4">
              {hook.insight}
            </p>
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 mb-6">
              <span className="text-[10px] text-red-400 font-extrabold uppercase tracking-widest block mb-1">AI Recommendation</span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{hook.recommendation}</p>
            </div>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/5 pt-6">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Visual Change</span>
              <span className="text-sm font-extrabold text-white mt-1 flex items-center gap-1">
                <Eye className="w-4 h-4 text-violet-400" />
                {hook.firstVisualChangeSeconds}s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Speech Moment</span>
              <span className="text-sm font-extrabold text-white mt-1 flex items-center gap-1">
                <Mic className="w-4 h-4 text-indigo-400" />
                {hook.firstSpeechMomentSeconds}s
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Curiosity Signal</span>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 mt-1 rounded border uppercase tracking-wider ${getSignalBadgeColor(hook.curiositySignal)}`}>
                {hook.curiositySignal}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Mini chart of hook strength over 3 seconds */}
        <div className="w-full lg:w-[40%] bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
              Intro Retention Curve (0-3s)
            </h4>
            <p className="text-[10px] text-slate-500 mb-4 leading-normal font-normal">
              Estimates engagement rate during the first three seconds.
            </p>
          </div>
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hook.timeline} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="hookGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="second" unit="s" stroke="#475569" fontSize={8} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', color: '#a78bfa' }}
                  labelStyle={{ fontSize: '10px', color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="engagementPotential" 
                  name="Attention"
                  stroke="#8b5cf6" 
                  fillOpacity={1}
                  fill="url(#hookGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="text-[9px] text-slate-500 mt-4 leading-relaxed text-right italic font-normal">
        Estimate based on observable frame-rate signals, not platform-internal analytics data.
      </p>
    </AnalysisCard>
  );
}
