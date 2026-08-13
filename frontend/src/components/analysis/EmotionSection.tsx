import React from 'react';
import { Heart, Activity } from 'lucide-react';
import { AnalysisCard } from '../AnalysisCard';
import { EmotionChart } from '../EmotionChart';
import { EmotionPoint } from '../../types/shared';

interface EmotionSectionProps {
  emotions: EmotionPoint[];
}

export function EmotionSection({ emotions }: EmotionSectionProps) {
  // Dynamically compute dominant emotion from average score
  const getDominantEmotion = (data: EmotionPoint[]) => {
    if (data.length === 0) return { name: 'N/A', score: 0 };
    
    let sumCuriosity = 0;
    let sumExcitement = 0;
    let sumHumor = 0;
    let sumSurprise = 0;

    for (const pt of data) {
      sumCuriosity += pt.curiosity;
      sumExcitement += pt.excitement;
      sumHumor += pt.humor;
      sumSurprise += pt.surprise;
    }

    const n = data.length;
    const averages = [
      { name: 'Curiosity', score: Math.round(sumCuriosity / n) },
      { name: 'Excitement', score: Math.round(sumExcitement / n) },
      { name: 'Humor', score: Math.round(sumHumor / n) },
      { name: 'Surprise', score: Math.round(sumSurprise / n) }
    ];

    return averages.sort((a, b) => b.score - a.score)[0];
  };

  const dominant = getDominantEmotion(emotions);

  const getDominantExplanation = (name: string) => {
    switch (name.toLowerCase()) {
      case 'curiosity':
        return 'High curiosity gap keeps users watching to find answers or payoffs. Extremely effective for educational or coding reels.';
      case 'excitement':
        return 'High energy pacing and exciting audio transitions stimulate high adrenaline spikes. Great for fitness or transformation content.';
      case 'humor':
        return 'Sustained comedic elements keep viewers relaxed and highly likely to tag comments or share with peer networks.';
      case 'surprise':
        return 'Sudden unexpected pacing changes or visual twists trigger shock reflexes, generating massive conversation in the replies.';
      default:
        return 'Balanced emotional triggers support consistent information delivery.';
    }
  };

  return (
    <AnalysisCard
      id="emotion"
      title="Emotion Analysis Spectrum"
      icon={<Heart className="w-5 h-5" />}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Emotion Chart */}
        <div className="flex-1 glass-panel p-4 md:p-6 bg-slate-900/20 border border-white/5">
          <EmotionChart data={emotions} />
        </div>

        {/* Breakdown Card */}
        <div className="w-full lg:w-[35%] flex flex-col justify-between gap-6">
          <div className="glass-panel p-6 bg-violet-600/5 border-violet-500/10 h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 text-violet-400 mb-3">
              <Activity className="w-5 h-5" />
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Growth Engine</span>
            </div>
            <h4 className="text-xs font-bold text-slate-400">Dominant Emotional State</h4>
            <h3 className="text-3xl font-extrabold text-white mt-1 leading-none uppercase tracking-wide">
              {dominant.name}
            </h3>
            
            <div className="flex items-baseline gap-2 mt-4 mb-3">
              <span className="text-2xl font-extrabold text-violet-400">{dominant.score}%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Average Intensity</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {getDominantExplanation(dominant.name)}
            </p>
          </div>
        </div>
      </div>
    </AnalysisCard>
  );
}
