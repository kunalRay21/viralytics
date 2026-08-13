import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Share2, 
  Flame, 
  Activity, 
  BrainCircuit, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ScoreRing } from '../components/ScoreRing';
import { staggerContainer, fadeUp, scaleIn } from '../animations/variants';

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[85vh]">
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-600/5 text-violet-400 text-xs font-extrabold uppercase tracking-widest mb-6"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Empowering Content Creators
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Predict your next <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-teal-400">
              viral video
            </span> before you post.
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-base sm:text-lg text-slate-400 mt-6 max-w-xl leading-relaxed mx-auto lg:mx-0 font-normal"
          >
            Viralytics analyzes visual pacing, audio dynamics, speech, hook strength, and caption heuristics to estimate your video's viral potential index (VPI) before uploading it to social platforms.
          </motion.p>
          
          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10"
          >
            <Link 
              to="/analyze" 
              className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-500 active:scale-98 text-sm font-bold text-white rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              Analyze Your Video
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-white/10 hover:border-white/20 text-sm font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2"
            >
              View Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Visual Card (Animated VPI Ring) */}
        <motion.div 
          className="flex-1 flex justify-center items-center relative"
          initial="hidden"
          animate="visible"
          variants={scaleIn}
        >
          <div className="glass-panel p-8 md:p-10 w-full max-w-sm relative z-10 flex flex-col items-center">
            {/* Visual element backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 to-indigo-600/5 rounded-2xl pointer-events-none" />
            
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-2">Estimated Viral Potential</span>
            <h3 className="text-sm font-bold text-white mb-6">vscode_extensions_reel.mp4</h3>
            
            <ScoreRing score={87.4} label="HIGH VIRAL POTENTIAL" size="lg" />
            
            <div className="w-full grid grid-cols-2 gap-4 mt-8 border-t border-white/5 pt-6 text-center">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Hook Strength</p>
                <p className="text-base font-extrabold text-teal-400 mt-1">91 / 100</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Audience Hold</p>
                <p className="text-base font-extrabold text-violet-400 mt-1">85 / 100</p>
              </div>
            </div>
          </div>
          {/* Neon back glow */}
          <div className="absolute w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </section>

      {/* Accuracy Disclosure Banner */}
      <section className="bg-slate-950/80 border-y border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-left max-w-2xl">
            <span className="text-white font-bold">Important Estimate Notice:</span> All scoring systems and recommendations are scientific estimations simulated on observable content markers (visual pace, audio frequency, word choices). We do not claim access to Instagram, TikTok, or YouTube internal databases.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">AI-Powered Short-Form Evaluation</h2>
          <p className="text-slate-400 mt-3 text-sm max-w-md mx-auto">
            Everything you need to debug your visual hooks, speech pacing, and trend mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 w-fit mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hook Analyzer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detects first visual cuts, sound moment delays, and visual movement transitions within the critical first 3 seconds of your video to maximize initial user attention.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 w-fit mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Retention Prediction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Models a customized retention decay curve. Flags target drop-off segments where interest decays and guides you to pacing improvements.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 w-fit mb-4">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Shareability Scoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates share triggers by scoring relatability, emotional highlights, and conversation sparks. Reveals the primary growth engine driving viral send rates.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 w-fit mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Trend Radar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches your topics and hashtags against current viral category categories. Scores alignment strength to help position your content correctly.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 w-fit mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Virality Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live-simulate structural alterations. Adjust duration, visual hook ratings, or CTA strengths to see VPI updates recalculate instantly in real-time.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 w-fit mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Video Doctor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get a comprehensive diagnoses report card listing specific editing prescriptions to correct pacing bottlenecks and double retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center font-extrabold text-violet-400 text-sm mb-4">
              01
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Upload Video</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
              Drag in your video metadata or file payload prior to posting.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-extrabold text-indigo-400 text-sm mb-4">
              02
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Extract Signals</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
              Our engines scan frames, voice pacing, and metadata vectors.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-extrabold text-blue-400 text-sm mb-4">
              03
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Evaluate Core Metrics</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
              Review timeline-based hooks, emotion curves, and retention predictions.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-600/10 border border-teal-500/20 flex items-center justify-center font-extrabold text-teal-400 text-sm mb-4">
              04
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Simulate Adjustments</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
              Tweak parameters in the editor to boost your predicted output score.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-t from-violet-950/20 to-transparent py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
            Ready to debug your short-form content?
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-10 leading-relaxed">
            Upload your draft files, evaluate signals against our predictive models, and optimize before sharing with the world.
          </p>
          <Link 
            to="/analyze" 
            className="inline-flex px-8 py-4 bg-violet-600 hover:bg-violet-500 text-sm font-bold text-white rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] items-center gap-2 cursor-pointer"
          >
            Analyze Your Video
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
