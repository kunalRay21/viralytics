import React, { useState, useEffect } from 'react';
import { Type, Sparkles, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { AnalysisCard } from '../AnalysisCard';
import { apiService } from '../../services/api';
import { ProgressBar } from '../ProgressBar';

interface CaptionAnalyzerSectionProps {
  caption: { current: string };
  category: string;
}

export function CaptionAnalyzerSection({ caption, category }: CaptionAnalyzerSectionProps) {
  const [captionText, setCaptionText] = useState(caption.current);
  const [scores, setScores] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial analyze run
  useEffect(() => {
    handleAnalyze(caption.current);
  }, [caption.current]);

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) return;
    try {
      setLoadingAnalyze(true);
      setErrorMsg(null);
      const res = await apiService.analyzeCaption(text);
      setScores(res);
    } catch (err: any) {
      console.error('Error analyzing caption:', err);
      setErrorMsg('Failed to analyze caption content.');
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoadingGenerate(true);
      setErrorMsg(null);
      const res = await apiService.generateCaptions(category);
      setSuggestions(res.suggestions);
    } catch (err: any) {
      console.error('Error generating captions:', err);
      setErrorMsg('Failed to generate suggestions.');
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleSelectSuggestion = (suggested: string) => {
    setCaptionText(suggested);
    handleAnalyze(suggested);
  };

  return (
    <AnalysisCard
      id="caption"
      title="Caption Analyzer & Copywriter"
      icon={<Type className="w-5 h-5" />}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Editable Input and Suggestion triggers */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Edit Caption</span>
            <button
              onClick={() => handleAnalyze(captionText)}
              disabled={loadingAnalyze}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalyze ? 'animate-spin' : ''}`} />
              Re-analyze
            </button>
          </div>

          <textarea
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            rows={4}
            className="w-full bg-slate-900/60 border border-white/8 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors placeholder-slate-600 resize-none font-medium leading-relaxed"
            placeholder="Type your video caption here..."
          />

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              onClick={handleGenerate}
              disabled={loadingGenerate}
              className="px-5 py-2.5 bg-violet-600/10 hover:bg-violet-600/15 border border-violet-500/20 hover:border-violet-500/30 text-xs font-extrabold text-violet-400 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {loadingGenerate ? 'Generating Copy...' : 'Generate AI Variations'}
            </button>
          </div>

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <div className="flex flex-col gap-2.5 mt-4 border-t border-white/5 pt-4">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Select an AI suggestion to swap:</span>
              <div className="grid grid-cols-1 gap-2.5">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSuggestion(sug)}
                    className="glass-panel p-3 border border-white/5 hover:border-violet-500/20 text-left text-xs text-slate-300 font-semibold hover:text-white transition-all bg-white/1 cursor-pointer leading-relaxed hover:bg-violet-950/5"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Score feedback */}
        <div className="w-full lg:w-[35%] bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          {scores ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Caption Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-violet-400 leading-none">{scores.score}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">/100</span>
                </div>
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                  style={{ width: `${scores.score}%` }}
                />
              </div>

              <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
                    <span>Clarity</span>
                    <span className="text-white font-bold">{scores.clarity}%</span>
                  </div>
                  <ProgressBar value={scores.clarity} colorFrom="from-slate-600" colorTo="to-slate-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
                    <span>Curiosity Gap</span>
                    <span className="text-white font-bold">{scores.curiosity}%</span>
                  </div>
                  <ProgressBar value={scores.curiosity} colorFrom="from-slate-600" colorTo="to-slate-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
                    <span>Search Discovery</span>
                    <span className="text-white font-bold">{scores.searchability}%</span>
                  </div>
                  <ProgressBar value={scores.searchability} colorFrom="from-slate-600" colorTo="to-slate-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
                    <span>Emotional Triggers</span>
                    <span className="text-white font-bold">{scores.emotionalTrigger}%</span>
                  </div>
                  <ProgressBar value={scores.emotionalTrigger} colorFrom="from-slate-600" colorTo="to-slate-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
                    <span>CTA Power</span>
                    <span className="text-white font-bold">{scores.ctaStrength}%</span>
                  </div>
                  <ProgressBar value={scores.ctaStrength} colorFrom="from-slate-600" colorTo="to-slate-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600">
              <MessageSquare className="w-8 h-8 mb-2" />
              <span className="text-xs font-semibold uppercase tracking-wider">No Caption Loaded</span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </AnalysisCard>
  );
}
