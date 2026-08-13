import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  Share2, 
  Flame, 
  Info,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { ScoreRing } from '../components/ScoreRing';
import { RecommendationCard } from '../components/RecommendationCard';
import { RetentionChart } from '../components/RetentionChart';

export function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animation reload trigger
  const [animKey, setAnimKey] = useState(0);

  // Simulation adjustments loaded from sessionStorage
  const [simulation, setSimulation] = useState<any>(null);

  useEffect(() => {
    async function loadAnalysis() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await apiService.getAnalysis(id);
        setData(res);
        setError(null);

        // Load simulation results if present
        const simJson = sessionStorage.getItem(`simulation_${id}`);
        if (simJson) {
          setSimulation(JSON.parse(simJson));
        }
      } catch (err: any) {
        console.error('Error loading report data:', err);
        setError(err.message || 'Audit report could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [id, animKey]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegenerate = () => {
    // Incrementing key re-mounts/re-fetches triggering animations
    setAnimKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded-lg mb-8" />
        <div className="h-40 bg-slate-800 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="h-48 bg-slate-800 rounded-2xl" />
          <div className="h-48 bg-slate-800 rounded-2xl" />
        </div>
        <div className="h-96 bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Report Not Found</h3>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <Link 
          to="/dashboard"
          className="px-6 py-2.5 bg-slate-900 border border-white/10 text-sm font-bold text-white rounded-xl"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate Strengths & Weaknesses dynamically
  const metrics = [
    { label: 'Hook Strength', score: data.breakdown.hookStrength, desc: 'Pacing transitions & first sound triggers.' },
    { label: 'Retention Potential', score: data.breakdown.retentionPotential, desc: 'Viewer hold speed modeling.' },
    { label: 'Shareability Drivers', score: data.breakdown.shareability, desc: 'Friend-send affinity vectors.' },
    { label: 'Emotional Impact', score: data.breakdown.emotionalImpact, desc: 'Adrenaline curiosity, humor, & shock ratings.' },
    { label: 'Trend Alignment', score: data.breakdown.trendAlignment, desc: 'Niche search indexing matching.' },
    { label: 'Visual Production', score: data.breakdown.visualQuality, desc: 'Framerate, zoom pacing, and brightness metrics.' },
    { label: 'Audio Quality', score: data.breakdown.audioQuality, desc: 'Verbal sound frequency & noise suppression.' },
    { label: 'Engagement Potential', score: data.breakdown.engagementPotential, desc: 'Comment trigger cues and caption metrics.' },
  ];

  const sortedMetrics = [...metrics].sort((a, b) => b.score - a.score);
  const biggestStrength = sortedMetrics[0];
  const biggestWeakness = sortedMetrics[sortedMetrics.length - 1];

  const getClassificationColor = (val: number) => {
    if (val >= 85) return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    if (val >= 65) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (val >= 40) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div key={animKey} className="max-w-4xl mx-auto py-6 px-4">
      {/* Header Back Button & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-white/5 pb-6">
        <Link 
          to={`/analysis/${id}`}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            className="px-4 py-2 bg-slate-900 border border-white/8 hover:border-white/15 text-xs font-bold text-slate-300 rounded-xl transition-all cursor-pointer"
          >
            Regenerate Report
          </button>
          
          <button
            disabled
            className="px-4 py-2 bg-slate-900 border border-white/5 text-slate-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            Export as PDF (coming soon)
          </button>
        </div>
      </div>

      {/* Main Audit Report Header */}
      <div className="glass-panel p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-glow-blue pointer-events-none rounded-full" />
        
        <div>
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-2">Audit Status: Finalized</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight truncate max-w-lg">
            {id?.replace('analysis_', '')}.mp4 Report
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-normal">
            Generated on {formatDate(data.createdAt)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium italic">
            Estimated Algorithm virality auditing
          </p>
        </div>

        <div className="flex flex-col items-center shrink-0">
          <ScoreRing score={data.vpi} size="md" />
          <span className={`text-[9px] font-extrabold px-2.5 py-0.5 mt-3 rounded-full border ${getClassificationColor(data.vpi)} uppercase tracking-wider`}>
            {data.classification} Potential
          </span>
        </div>
      </div>

      {/* Strengths & Weaknesses Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strength */}
        <div className="glass-panel p-6 border-teal-500/10 bg-teal-500/2">
          <div className="flex items-center gap-2 text-teal-400 mb-3">
            <Sparkles className="w-5 h-5 fill-teal-400 text-teal-400" />
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Key Advantage</span>
          </div>
          <h4 className="text-xs font-bold text-slate-400">Biggest Video Strength</h4>
          <h3 className="text-xl font-extrabold text-white mt-1 leading-none uppercase tracking-wide">
            {biggestStrength.label}
          </h3>
          <div className="flex items-baseline gap-1.5 mt-3 mb-2">
            <span className="text-lg font-extrabold text-teal-400">{biggestStrength.score}</span>
            <span className="text-[9px] text-slate-600 font-bold">/100</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Your score in <span className="text-teal-400 font-bold">{biggestStrength.label}</span> is high, meaning {biggestStrength.desc}
          </p>
        </div>

        {/* Weakness */}
        <div className="glass-panel p-6 border-red-500/10 bg-red-500/2">
          <div className="flex items-center gap-2 text-red-400 mb-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Key Bottleneck</span>
          </div>
          <h4 className="text-xs font-bold text-slate-400">Biggest Video Weakness</h4>
          <h3 className="text-xl font-extrabold text-white mt-1 leading-none uppercase tracking-wide">
            {biggestWeakness.label}
          </h3>
          <div className="flex items-baseline gap-1.5 mt-3 mb-2">
            <span className="text-lg font-extrabold text-red-400">{biggestWeakness.score}</span>
            <span className="text-[9px] text-slate-600 font-bold">/100</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Your score in <span className="text-red-400 font-bold">{biggestWeakness.label}</span> is low. Fix this by optimizing {biggestWeakness.desc}
          </p>
        </div>
      </div>

      {/* Simulator Comparison */}
      <div className="glass-panel p-6 mb-8 border-violet-500/15 bg-violet-600/2">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-1.5">
          <TrendingUp className="w-5 h-5 text-violet-400 animate-pulse" />
          Virality Simulation Comparisons
        </h3>

        {simulation ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/5 rounded-2xl p-5 bg-slate-950/40">
            <div className="flex items-center gap-8 text-center sm:text-left">
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Baseline</span>
                <span className="text-3xl font-extrabold text-slate-400">{data.vpi.toFixed(1)}</span>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-700 hidden sm:block" />
              <div>
                <span className="text-[9px] text-violet-400 font-bold uppercase block mb-1">Simulated VPI</span>
                <span className="text-3xl font-extrabold text-white">{simulation.simulatedVpi.toFixed(1)}</span>
              </div>
            </div>

            <div className="shrink-0">
              {simulation.delta > 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3.5 py-2 rounded-xl uppercase tracking-wider shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                  Predicted Shift: +{simulation.delta.toFixed(1)} VPI
                </span>
              ) : simulation.delta < 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-red-400 bg-red-500/10 border border-red-500/20 px-3.5 py-2 rounded-xl uppercase tracking-wider">
                  Predicted Shift: {simulation.delta.toFixed(1)} VPI
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-400 bg-slate-500/10 border border-slate-500/20 px-3.5 py-2 rounded-xl uppercase tracking-wider">
                  No Predicted Change
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-dashed border-white/8 bg-slate-950/20">
            <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed font-normal">
              No simulation adjustments detected during this session. Simulate parameter updates to review projected outcome audits.
            </p>
            <Link
              to={`/analysis/${id}#simulator`}
              className="px-4 py-2 bg-slate-900 border border-white/10 hover:border-white/15 hover:text-white text-xs font-bold text-slate-300 rounded-xl transition-all"
            >
              Configure Simulator
            </Link>
          </div>
        )}
      </div>

      {/* AI Video Doctor Prescriptions list */}
      <div className="glass-panel p-6 mb-8">
        <h3 className="text-base font-bold text-white mb-6">Audited AI Recommendations</h3>
        <div className="flex flex-col gap-3.5">
          {data.recommendations.map((rec: string, idx: number) => {
            const impact = idx === 0 ? 'high' : idx === 1 ? 'medium' : 'low';
            return (
              <RecommendationCard 
                key={idx} 
                text={rec} 
                impact={impact} 
              />
            );
          })}
        </div>
      </div>

      {/* Retention Graph preview */}
      <div className="glass-panel p-6 mb-8">
        <h3 className="text-base font-bold text-white mb-6">Retention Curve Audit</h3>
        <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
          <RetentionChart data={data.retention.points} />
        </div>
      </div>

      {/* Section Summaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Hook */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-violet-400 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hook Summary</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Visual Hooking</h4>
            <p className="text-[11px] text-slate-400 leading-normal font-normal">
              {data.hook.insight}
            </p>
          </div>
          <div className="border-t border-white/5 pt-3 mt-4 text-xs font-extrabold text-white">
            Score: {data.hook.score} / 100
          </div>
        </div>

        {/* Shareability */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 mb-2">
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Shareability Summary</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Send Mechanism</h4>
            <p className="text-[11px] text-slate-400 leading-normal font-normal">
              Growth cataloged under primary mechanism: <span className="text-blue-400 font-bold font-semibold uppercase">{data.shareability.primaryMechanism}</span>.
            </p>
          </div>
          <div className="border-t border-white/5 pt-3 mt-4 text-xs font-extrabold text-white">
            Score: {data.shareability.score} / 100
          </div>
        </div>

        {/* Trend Radar */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 mb-2">
              <Flame className="w-4 h-4" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Trend Summary</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Category Alignment</h4>
            <p className="text-[11px] text-slate-400 leading-normal font-normal">
              Video categorized under <span className="text-amber-400 font-bold">{data.category}</span>.
            </p>
          </div>
          <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <Info className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            Trend Alignment Estimate
          </div>
        </div>
      </div>
    </div>
  );
}
