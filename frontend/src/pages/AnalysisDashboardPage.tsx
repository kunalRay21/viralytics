import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Video, 
  ChevronRight, 
  AlertCircle, 
  HelpCircle,
  Menu
} from 'lucide-react';
import { apiService } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { ScoreRing } from '../components/ScoreRing';
import { MetricCard } from '../components/MetricCard';

// Sub-sections imports
import { HookAnalyzerSection } from '../components/analysis/HookAnalyzerSection';
import { RetentionSection } from '../components/analysis/RetentionSection';
import { EmotionSection } from '../components/analysis/EmotionSection';
import { ShareabilitySection } from '../components/analysis/ShareabilitySection';
import { TrendRadarSection } from '../components/analysis/TrendRadarSection';
import { CaptionAnalyzerSection } from '../components/analysis/CaptionAnalyzerSection';
import { HashtagIntelligenceSection } from '../components/analysis/HashtagIntelligenceSection';
import { AudioAnalysisSection } from '../components/analysis/AudioAnalysisSection';
import { ViralitySimulatorSection } from '../components/analysis/ViralitySimulatorSection';
import { AIVideoDoctorSection } from '../components/analysis/AIVideoDoctorSection';

const NAVIGATION_ITEMS = [
  { label: 'Overview', id: 'overview' },
  { label: 'Hook Analyzer', id: 'hook' },
  { label: 'Retention Model', id: 'retention' },
  { label: 'Emotion Spectrum', id: 'emotion' },
  { label: 'Shareability', id: 'shareability' },
  { label: 'Trend Radar', id: 'trends' },
  { label: 'Caption Analyzer', id: 'caption' },
  { label: 'Hashtag intelligence', id: 'hashtags' },
  { label: 'Audio Analysis', id: 'audio' },
  { label: 'Virality Simulator', id: 'simulator' },
  { label: 'AI Video Doctor', id: 'videoDoctor' },
];

export function AnalysisDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    async function loadAnalysis() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await apiService.getAnalysis(id);
        setData(res);
        setError(null);
        // Clear any previous simulation data
        sessionStorage.removeItem(`simulation_${id}`);
      } catch (err: any) {
        console.error('Error fetching analysis report:', err);
        setError(err.message || 'Analysis record could not be located.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [id]);

  // Handle intersection observer to highlight sticky nav links on scroll
  useEffect(() => {
    if (!data) return;
    
    const observers = NAVIGATION_ITEMS.map(item => {
      const el = document.getElementById(item.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(item.id);
          }
        },
        { threshold: 0.25, rootMargin: '-64px 0px -40% 0px' }
      );
      
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(obs => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [data]);

  const scrollToId = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -80; // offset navbar height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(targetId);
    }
  };

  // Helper to determine status dynamically based on score thresholds
  const getStatus = (score: number): 'excellent' | 'good' | 'needs-improvement' | 'weak' => {
    if (score >= 85) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 40) return 'needs-improvement';
    return 'weak';
  };

  // Callback when simulator sliders are edited
  const handleSimulate = (simulatedVpi: number, delta: number, simulatedScores: any) => {
    if (id) {
      sessionStorage.setItem(
        `simulation_${id}`,
        JSON.stringify({ simulatedVpi, delta, simulatedScores })
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-800 rounded-lg mb-6" />
        <div className="flex gap-8">
          <div className="flex-1 flex flex-col gap-6">
            <div className="h-96 bg-slate-800 rounded-2xl" />
            <div className="h-80 bg-slate-800 rounded-2xl" />
          </div>
          <div className="w-56 shrink-0 hidden lg:block h-96 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel border-red-500/20 text-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Analysis Not Found</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
          The requested viral potential report does not exist or has been removed.
        </p>
        <Link 
          to="/dashboard"
          className="px-6 py-2.5 bg-slate-900 border border-white/10 hover:border-white/20 text-sm font-bold text-white rounded-xl transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const getClassificationColor = (val: number) => {
    if (val >= 85) return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    if (val >= 65) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    if (val >= 40) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="relative">
      <PageHeader 
        title="Video Evaluation Dashboard" 
        subtitle="Detailed analysis scores, curves, and interactive simulator adjustments"
        actions={
          <Link 
            to={`/analysis/${id}/report`}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-xs font-extrabold text-white rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4.5 h-4.5" />
            Generate Report
          </Link>
        }
      />

      {/* Mobile Sticky Tab Nav */}
      <div className="lg:hidden sticky top-16 bg-slate-950/90 backdrop-blur border-b border-white/5 py-3 z-30 flex items-center gap-2 overflow-x-auto -mx-4 px-4 scrollbar-none">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToId(item.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border shrink-0 transition-all cursor-pointer ${
              activeSection === item.id 
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20' 
                : 'bg-transparent text-slate-400 border-transparent hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex gap-8 items-start mt-6">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          
          {/* OVERVIEW SECTION */}
          <div id="overview" className="glass-panel p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-glow-violet pointer-events-none rounded-full" />
            
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              
              {/* Left Column: Video Placeholder and Score Ring */}
              <div className="w-full lg:w-[35%] shrink-0 flex flex-col justify-between items-center text-center p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                <div className="w-full flex items-center gap-2 px-3 py-2 bg-slate-900/60 border border-white/5 rounded-xl text-left mb-6">
                  <Video className="w-5 h-5 text-violet-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block leading-none">Analyzed file</span>
                    <span className="text-xs font-bold text-white truncate block mt-0.5">{data.id.replace('analysis_', '')}.mp4</span>
                  </div>
                </div>

                <div className="my-2">
                  <ScoreRing score={data.vpi} size="lg" />
                </div>
                
                <span className={`text-[9.5px] font-extrabold px-3 py-1 mt-6 rounded-full border ${getClassificationColor(data.vpi)} uppercase tracking-widest`}>
                  {data.classification} Potential
                </span>
              </div>

              {/* Right Column: MetricCard Grid (8 cards) */}
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetricCard 
                  title="Hook Strength" 
                  score={data.breakdown.hookStrength}
                  explanation="Quality score of pacing changes and voice triggers during initial 3 seconds."
                  status={getStatus(data.breakdown.hookStrength)}
                />
                
                <MetricCard 
                  title="Retention Potential" 
                  score={data.breakdown.retentionPotential}
                  explanation="Predicted hold speed calculated from pacing and layout changes."
                  status={getStatus(data.breakdown.retentionPotential)}
                />

                <MetricCard 
                  title="Shareability Drivers" 
                  score={data.breakdown.shareability}
                  explanation="Send affinity calculated from relatable scripts and emotional prompts."
                  status={getStatus(data.breakdown.shareability)}
                />

                <MetricCard 
                  title="Emotional Impact" 
                  score={data.breakdown.emotionalImpact}
                  explanation="Aggregated intensities of curiosity, excitement, shock, and humor spikes."
                  status={getStatus(data.breakdown.emotionalImpact)}
                />

                <MetricCard 
                  title="Trend Alignment" 
                  score={data.breakdown.trendAlignment}
                  explanation="Keyword and thematic matches against current viral category averages."
                  status={getStatus(data.breakdown.trendAlignment)}
                />

                <MetricCard 
                  title="Visual Production" 
                  score={data.breakdown.visualQuality}
                  explanation="Lighting ratings, editing cuts rate, and framerate stabilization."
                  status={getStatus(data.breakdown.visualQuality)}
                />

                <MetricCard 
                  title="Audio Quality" 
                  score={data.breakdown.audioQuality}
                  explanation="Speech clarity rating, background noise suppression levels."
                  status={getStatus(data.breakdown.audioQuality)}
                />

                <MetricCard 
                  title="Engagement Potential" 
                  score={data.breakdown.engagementPotential}
                  explanation="Estimated likelihood of comments and saves generated by caption cues."
                  status={getStatus(data.breakdown.engagementPotential)}
                />
              </div>
            </div>
          </div>

          {/* SUB-SECTIONS (Hook, Retention, etc.) */}
          <HookAnalyzerSection hook={data.hook} />
          <RetentionSection retention={data.retention} />
          <EmotionSection emotions={data.emotions} />
          <ShareabilitySection shareability={data.shareability} />
          <TrendRadarSection trendAlignment={data.trendAlignment} />
          <CaptionAnalyzerSection caption={data.caption} category={data.category} />
          <HashtagIntelligenceSection category={data.category} />
          <AudioAnalysisSection audio={data.audio} analysisId={data.id} />
          
          <ViralitySimulatorSection 
            scores={data.scores} 
            originalVpi={data.vpi} 
            onSimulate={handleSimulate} 
          />
          
          <AIVideoDoctorSection videoDoctor={data.videoDoctor} />

          {/* Bottom CTA to Report */}
          <div className="flex justify-center mt-4">
            <Link
              to={`/analysis/${id}/report`}
              className="px-10 py-4 bg-violet-600 hover:bg-violet-500 active:scale-98 text-sm font-extrabold text-white rounded-xl transition-all shadow-[0_0_25px_rgba(124,58,237,0.35)] flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              Generate Final Audit Report
            </Link>
          </div>

        </div>

        {/* Sticky Desktop Side Nav */}
        <div className="w-56 shrink-0 sticky top-24 hidden lg:flex flex-col gap-6">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-3">
            Audits Menu
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5 pl-2">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all border border-transparent cursor-pointer ${
                  activeSection === item.id
                    ? 'text-violet-400 bg-violet-600/5 font-extrabold border-violet-500/10'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/1'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
