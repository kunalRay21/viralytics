import React from 'react';
import { Flame, ShieldCheck } from 'lucide-react';
import { AnalysisCard } from '../AnalysisCard';
import { TrendCard } from '../TrendCard';

interface TrendRadarSectionProps {
  trendAlignment: {
    topCategory: string;
    categories: { name: string; alignmentScore: number }[];
  };
}

export function TrendRadarSection({ trendAlignment }: TrendRadarSectionProps) {
  // Sort categories so that the active topCategory is first, and then descending by alignmentScore
  const sortedCategories = [...trendAlignment.categories].sort((a, b) => {
    if (a.name === trendAlignment.topCategory) return -1;
    if (b.name === trendAlignment.topCategory) return 1;
    return b.alignmentScore - a.alignmentScore;
  });

  return (
    <AnalysisCard
      id="trends"
      title="Trend Radar Alignment"
      icon={<Flame className="w-5 h-5" />}
    >
      <div className="flex flex-col gap-6">
        {/* Disclosures header */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-900/40 border border-white/5 rounded-2xl">
          <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-extrabold uppercase tracking-wider shrink-0">
            Trend Alignment Estimate
          </div>
          <p className="text-[10.5px] text-slate-400 font-normal leading-normal">
            ℹ️ Estimated from visual descriptors and speech transcript themes. Not sourced from Instagram, TikTok, or YouTube's internal proprietary ranking or trend data pools.
          </p>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {sortedCategories.map((cat, idx) => (
            <TrendCard
              key={idx}
              category={cat.name}
              alignmentScore={cat.alignmentScore}
              isTop={cat.name === trendAlignment.topCategory}
            />
          ))}
        </div>
      </div>
    </AnalysisCard>
  );
}
