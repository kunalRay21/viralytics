import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AnalysisCard } from '../AnalysisCard';
import { RetentionChart } from '../RetentionChart';
import { RetentionPoint, TimedNote } from '../../types/shared';

interface RetentionSectionProps {
  retention: {
    points: RetentionPoint[];
    dropOffPoints: TimedNote[];
    strongPoints: TimedNote[];
  };
}

export function RetentionSection({ retention }: RetentionSectionProps) {
  return (
    <AnalysisCard
      id="retention"
      title="Retention Prediction Model"
      icon={<TrendingUp className="w-5 h-5" />}
    >
      <div className="flex flex-col gap-8">
        {/* Retention Area Chart */}
        <div className="glass-panel p-4 md:p-6 bg-slate-900/20 border border-white/5">
          <RetentionChart 
            data={retention.points} 
            dropOffPoints={retention.dropOffPoints} 
            strongPoints={retention.strongPoints} 
          />
        </div>

        {/* Breakdown Moments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weak Moments */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Weak Retention Moments
            </h4>
            <div className="flex flex-col gap-3">
              {retention.dropOffPoints.map((pt, idx) => (
                <div key={idx} className="glass-panel p-4 border-red-500/10 bg-red-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                      Timestamp: {pt.second}s
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Audience Dip</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold mb-2">
                    {pt.note}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-normal font-normal">
                    <span className="text-red-300 font-bold">Recommended fix:</span> Add a dynamic zoom cut or overlay an explanatory infographic at this mark.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Moments */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-teal-400 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Strong Retention Moments
            </h4>
            <div className="flex flex-col gap-3">
              {retention.strongPoints.map((pt, idx) => (
                <div key={idx} className="glass-panel p-4 border-teal-500/10 bg-teal-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                      Timestamp: {pt.second}s
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Retention Peak</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {pt.note}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-normal font-normal mt-2">
                    <span className="text-teal-300 font-bold">Analysis:</span> The visual pacing matched the high value content delivery perfectly, locking viewer retention.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnalysisCard>
  );
}
