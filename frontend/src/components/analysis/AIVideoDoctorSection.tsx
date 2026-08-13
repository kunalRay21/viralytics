import React from 'react';
import { Stethoscope, CheckCircle2, AlertTriangle, XCircle, HeartPulse, Info } from 'lucide-react';
import { AnalysisCard } from '../AnalysisCard';
import { RecommendationCard } from '../RecommendationCard';

interface AIVideoDoctorSectionProps {
  videoDoctor: {
    diagnosis: { label: string; rating: string }[];
    prescription: string[];
  };
}

export function AIVideoDoctorSection({ videoDoctor }: AIVideoDoctorSectionProps) {
  const getRatingIcon = (rating: string) => {
    const r = rating.toLowerCase();
    if (r === 'excellent') {
      return <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />;
    }
    if (r === 'strong') {
      return <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />;
    }
    if (r === 'needs improvement') {
      return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    return <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
  };

  const getRatingBadgeClass = (rating: string) => {
    const r = rating.toLowerCase();
    if (r === 'excellent') return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    if (r === 'strong') return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
    if (r === 'needs improvement') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <AnalysisCard
      id="videoDoctor"
      title="AI Video Doctor Diagnostics"
      icon={<Stethoscope className="w-5 h-5" />}
      className="border-violet-500/20 shadow-[0_0_20px_rgba(124,58,237,0.05)] ring-1 ring-violet-500/10"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Video Health Report Card */}
        <div className="w-full lg:w-[40%] bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5 uppercase tracking-wider">
              <HeartPulse className="w-4 h-4 text-violet-400" />
              Content Vital Signs
            </h4>
            <p className="text-[10px] text-slate-500 mb-6 leading-normal font-normal">
              Algorithm checklist based on structural video pacings.
            </p>
            
            <div className="flex flex-col gap-4">
              {videoDoctor.diagnosis.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-xs font-bold text-slate-300">{d.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${getRatingBadgeClass(d.rating)}`}>
                      {d.rating}
                    </span>
                    {getRatingIcon(d.rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-white/5 flex items-start gap-2 text-[10px] text-slate-500 leading-normal font-normal">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Ratings represent suitability levels against competitive benchmarks within your category.</span>
          </div>
        </div>

        {/* Right Panel: Editing Prescriptions */}
        <div className="flex-1 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">
            Active Video Prescriptions
          </h4>
          <div className="flex flex-col gap-3">
            {videoDoctor.prescription.map((text, idx) => {
              // deterministically set impact: first is high, rest medium/low
              const impact = idx === 0 ? 'high' : idx === 1 ? 'medium' : 'low';
              return (
                <RecommendationCard
                  key={idx}
                  text={text}
                  impact={impact}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AnalysisCard>
  );
}
