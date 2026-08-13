import React from 'react';
import { Share2, Sparkles, Send, MessageSquare, Heart, Lightbulb, Users } from 'lucide-react';
import { ShareabilityDetail } from '../../types/shared';
import { AnalysisCard } from '../AnalysisCard';
import { ScoreRing } from '../ScoreRing';
import { ProgressBar } from '../ProgressBar';

interface ShareabilitySectionProps {
  shareability: ShareabilityDetail;
}

export function ShareabilitySection({ shareability }: ShareabilitySectionProps) {
  const getMechanismDetails = (mech: string) => {
    switch (mech) {
      case 'RELATABILITY':
        return {
          title: 'High Relatability',
          desc: 'Viewers see themselves in this content, driving them to share with friends saying "This is so us."',
          icon: <Users className="w-5 h-5" />
        };
      case 'HUMOR':
        return {
          title: 'Instant Humorous Payoff',
          desc: 'High comedic value stimulates endorphin responses, driving instant send rates inside peer DM threads.',
          icon: <Sparkles className="w-5 h-5 text-amber-400" />
        };
      case 'SURPRISE':
        return {
          title: 'Algorithm Shock Trigger',
          desc: 'Unexpected pacing adjustments trigger sudden surprise, generating heavy comments and shares.',
          icon: <Sparkles className="w-5 h-5 text-violet-400" />
        };
      case 'UTILITY':
        return {
          title: 'High Educational Utility',
          desc: 'Viewers save this video and forward it to teams/peers to bookmark code snippets or setup tips.',
          icon: <Lightbulb className="w-5 h-5 text-teal-400" />
        };
      case 'CONTROVERSY':
        return {
          title: 'Polarizing Debate Catalyst',
          desc: 'Triggering standard debate topics encourages viewers to share or reply, starting viral chat loops.',
          icon: <MessageSquare className="w-5 h-5 text-orange-400" />
        };
      case 'ASPIRATION':
      default:
        return {
          title: 'Aspirational Blueprint',
          desc: 'Inspirational footage of routines or setups triggers self-improvement drives, generating high save rates.',
          icon: <Send className="w-5 h-5 text-blue-400" />
        };
    }
  };

  const mechanism = getMechanismDetails(shareability.primaryMechanism);

  return (
    <AnalysisCard
      id="shareability"
      title="Shareability Evaluation"
      icon={<Share2 className="w-5 h-5" />}
    >
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Overall Ring on Left */}
        <div className="shrink-0 flex flex-col items-center">
          <ScoreRing score={shareability.score} size="md" label="Shareability Index" />
        </div>

        {/* Sliders in center */}
        <div className="flex-1 flex flex-col gap-4.5 w-full">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Relatability</span>
              <span className="text-white font-bold">{shareability.relatability}%</span>
            </div>
            <ProgressBar value={shareability.relatability} colorFrom="from-violet-500" colorTo="to-indigo-500" />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Friend-Send Potential</span>
              <span className="text-white font-bold">{shareability.friendSendPotential}%</span>
            </div>
            <ProgressBar value={shareability.friendSendPotential} colorFrom="from-indigo-500" colorTo="to-blue-500" />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Conversation Sparks</span>
              <span className="text-white font-bold">{shareability.conversationPotential}%</span>
            </div>
            <ProgressBar value={shareability.conversationPotential} colorFrom="from-blue-500" colorTo="to-teal-500" />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Emotional Triggers</span>
              <span className="text-white font-bold">{shareability.emotionalTrigger}%</span>
            </div>
            <ProgressBar value={shareability.emotionalTrigger} colorFrom="from-teal-500" colorTo="to-emerald-500" />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" /> Value Utility</span>
              <span className="text-white font-bold">{shareability.utility}%</span>
            </div>
            <ProgressBar value={shareability.utility} colorFrom="from-emerald-500" colorTo="to-green-500" />
          </div>
        </div>

        {/* Growth Signal Callout */}
        <div className="w-full md:w-[30%]">
          <div className="p-5 rounded-2xl border border-violet-500/20 bg-violet-600/5 shadow-[0_0_15px_rgba(124,58,237,0.05)] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-violet-400">
              {mechanism.icon}
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Share Engine</span>
            </div>
            <h4 className="text-sm font-extrabold text-white leading-tight">
              {mechanism.title}
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal font-normal">
              {mechanism.desc}
            </p>
          </div>
        </div>
      </div>
    </AnalysisCard>
  );
}
