import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Video, 
  Percent, 
  Trophy, 
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Tag
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { apiService } from '../services/api';
import { PageHeader } from '../components/PageHeader';

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const stats = await apiService.getDashboard();
        setData(stats);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard:', err);
        setError(err.message || 'Could not fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded-lg mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <div className="h-72 bg-slate-800 rounded-2xl lg:col-span-3" />
          <div className="h-72 bg-slate-800 rounded-2xl lg:col-span-2" />
        </div>
        <div className="h-48 bg-slate-800 rounded-2xl mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel border-red-500/20 text-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Failed to load dashboard</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-slate-900 border border-white/10 hover:border-white/20 text-sm font-bold text-white rounded-xl transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    totalVideosAnalyzed,
    averageVpi,
    highestVpi,
    videosThisWeek,
    bestCategory,
    vpiTrend,
    recentAnalyses
  } = data;

  const hasData = totalVideosAnalyzed > 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Dashboard" 
        subtitle="Manage your video reports and review performance aggregates"
        actions={
          <Link 
            to="/analyze" 
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-xs font-extrabold text-white rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            Quick Analyze
          </Link>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-violet-400 shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Analyzed</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{totalVideosAnalyzed}</h3>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-400 shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average VPI</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{averageVpi}</h3>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Highest VPI</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{highestVpi}</h3>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Analyzed This Week</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{videosThisWeek}</h3>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-12 glass-panel text-center min-h-[40vh] mt-6">
          <Video className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No analyses yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
            Upload your first video to generate detailed structural metrics, hook timelines, and simulated improvements.
          </p>
          <Link 
            to="/analyze" 
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-sm font-bold text-white rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.25)] flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            Analyze a Video
          </Link>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-2">
            {/* Left Column - VPI Trend */}
            <div className="glass-panel p-6 lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  <h3 className="text-base font-bold text-white">VPI Progress Trend</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Estimated Algorithm Fit</span>
              </div>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vpiTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" tickFormatter={formatDate} stroke="#475569" fontSize={9} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d111a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#8b5cf6', fontSize: '11px' }}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="vpi" 
                      name="Avg VPI" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      activeDot={{ r: 6 }} 
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column - Best category */}
            <div className="glass-panel p-6 lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-5 h-5 text-teal-400" />
                  <h3 className="text-base font-bold text-white">Algorithm Category Focus</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Top Niche Nailing</span>
                <h4 className="text-4xl font-extrabold text-white mt-2 leading-none">{bestCategory.name}</h4>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-normal">
                  Your videos categorized under <span className="text-teal-400 font-bold">{bestCategory.name}</span> currently achieve the highest average predicted Virality Index.
                </p>
              </div>
              <div className="mt-6 border-t border-white/5 pt-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
                  <span>Category Average VPI</span>
                  <span className="text-white font-bold">{bestCategory.averageVpi} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                    style={{ width: `${bestCategory.averageVpi}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent list */}
          <div className="glass-panel p-6 mt-2">
            <h3 className="text-base font-bold text-white mb-6">Recent Analyses</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">
                    <th className="pb-3 font-semibold">Video Filename</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Processed Date</th>
                    <th className="pb-3 font-semibold text-center">Score</th>
                    <th className="pb-3 font-semibold text-center">Classification</th>
                    <th className="pb-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {recentAnalyses.map((a: any) => {
                    const getClassificationColor = (val: number) => {
                      if (val >= 85) return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
                      if (val >= 65) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
                      if (val >= 40) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
                      return 'text-red-500 bg-red-500/10 border-red-500/20';
                    };

                    return (
                      <tr key={a.id} className="group hover:bg-white/1 transition-all">
                        <td className="py-4 font-bold text-white truncate max-w-xs">{a.filename}</td>
                        <td className="py-4 text-slate-300 font-medium">{a.category}</td>
                        <td className="py-4 text-slate-400 text-xs flex items-center gap-1.5 mt-1.5"><Clock className="w-3.5 h-3.5" />{formatDate(a.createdAt)}</td>
                        <td className="py-4 text-center font-extrabold text-white text-base">{a.vpi}</td>
                        <td className="py-4 text-center">
                          <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${getClassificationColor(a.vpi)} uppercase tracking-wider`}>
                            {a.classification}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link 
                            to={`/analysis/${a.id}`} 
                            className="inline-flex p-1.5 rounded-lg bg-slate-900 border border-white/5 group-hover:border-violet-500/30 group-hover:text-violet-400 text-slate-400 transition-all hover:bg-violet-500/10"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
