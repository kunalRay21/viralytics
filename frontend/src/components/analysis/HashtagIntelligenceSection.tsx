import React from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip,
  Cell
} from 'recharts';
import { Hash, Sparkles, AlertCircle } from 'lucide-react';
import { AnalysisCard } from '../AnalysisCard';

interface HashtagIntelligenceSectionProps {
  category: string;
}

interface HashtagItem {
  name: string;
  relevance: number;
  reach: number; // 0-100 score representation for chart
  type: 'Niche' | 'Medium' | 'Broad';
}

const HASHTAG_MAP: Record<string, { niche: string[]; medium: string[]; broad: string[] }> = {
  'AI': {
    niche: ['#llmops', '#localllm', '#comfyui', '#vectorsearch', '#promptengineering'],
    medium: ['#aiadvancements', '#artificialintelligence', '#generativeai', '#machinelearning', '#futureoftech'],
    broad: ['#ai', '#tech', '#innovation', '#automation', '#coding']
  },
  'Comedy': {
    niche: ['#officehumor', '#developerproblems', '#wfhlife', '#meetingfail', '#corporatehumor'],
    medium: ['#funnyreels', '#relatable', '#comedyvideos', '#dailyhumor', '#hilarious'],
    broad: ['#comedy', '#funny', '#joke', '#lol', '#meme']
  },
  'Programming': {
    niche: ['#neovim', '#rustlang', '#typescripttips', '#nextjs14', '#gitcommands'],
    medium: ['#programming', '#webdevelopment', '#softwareengineering', '#codelearning', '#developerlife'],
    broad: ['#coding', '#tech', '#developer', '#software', '#computer']
  },
  'Fitness': {
    niche: ['#calisthenicsprogression', '#zone2cardio', '#progressiveoverload', '#mealprepsunday', '#hypertrophy'],
    medium: ['#fitnessgoals', '#workoutmotivation', '#gymlife', '#healthylifestyle', '#fitfam'],
    broad: ['#fitness', '#workout', '#gym', '#health', '#motivation']
  },
  'Finance': {
    niche: ['#dividendgrowth', '#indexfundinvesting', '#rothira', '#highyieldsavings', '#budgeting101'],
    medium: ['#personalfinance', '#investingforbeginners', '#financialfreedom', '#wealthbuilding', '#moneytips'],
    broad: ['#money', '#finance', '#investing', '#wealth', '#saving']
  },
  'Education': {
    niche: ['#quantumphysics', '#historyfacts', '#psychologyhacks', '#speedreading', '#spacex'],
    medium: ['#learnonyoutube', '#sciencefacts', '#educational', '#knowledgesharing', '#mindblown'],
    broad: ['#education', '#learning', '#science', '#history', '#facts']
  },
  'Gaming': {
    niche: ['#eldenringclips', '#speedrunfail', '#steamdecktips', '#indiegamedev', '#fpsgames'],
    medium: ['#gamingshorts', '#gamingmoments', '#gameplay', '#letplay', '#gamerlife'],
    broad: ['#gaming', '#gamer', '#games', '#playstation', '#xbox']
  },
  'Lifestyle': {
    niche: ['#morningroutine', '#minimalistliving', '#solotraveler', '#desksetup', '#vlog'],
    medium: ['#aesthetics', '#lifestyleblog', '#dailyvlog', '#creativity', '#organization'],
    broad: ['#lifestyle', '#vlog', '#aesthetic', '#travel', '#setup']
  }
};

export function HashtagIntelligenceSection({ category }: HashtagIntelligenceSectionProps) {
  const bank = HASHTAG_MAP[category] || HASHTAG_MAP['AI'];

  // Construct chart data deterministically
  const buildHashtagData = (): HashtagItem[] => {
    const list: HashtagItem[] = [];
    
    // Niche: low reach, high relevance
    bank.niche.forEach((name, i) => {
      list.push({
        name,
        relevance: 80 + (i * 3) % 18,
        reach: 15 + (i * 7) % 20, // 15-35%
        type: 'Niche'
      });
    });

    // Medium: mid reach, mid relevance
    bank.medium.forEach((name, i) => {
      list.push({
        name,
        relevance: 70 + (i * 4) % 20,
        reach: 45 + (i * 6) % 20, // 45-65%
        type: 'Medium'
      });
    });

    // Broad: high reach, low-mid relevance
    bank.broad.forEach((name, i) => {
      list.push({
        name,
        relevance: 55 + (i * 5) % 25,
        reach: 75 + (i * 4) % 20, // 75-95%
        type: 'Broad'
      });
    });

    return list;
  };

  const chartData = buildHashtagData();

  const getGroupColor = (type: string) => {
    if (type === 'Niche') return '#14b8a6'; // teal
    if (type === 'Medium') return '#8b5cf6'; // violet
    return '#3b82f6'; // blue
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as HashtagItem;
      return (
        <div className="glass-panel p-3 border border-white/10 text-xs">
          <p className="font-extrabold text-white mb-1">{data.name}</p>
          <p className="text-slate-400">Targeting: <span className="font-semibold text-white">{data.type}</span></p>
          <p className="text-slate-400">Relevance score: <span className="font-semibold text-teal-400">{data.relevance}%</span></p>
          <p className="text-slate-400">Est. Reach: <span className="font-semibold text-violet-400">{data.reach === 25 ? 'Low' : data.reach > 70 ? 'High' : 'Medium'}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <AnalysisCard
      id="hashtags"
      title="Hashtag Intelligence Map"
      icon={<Hash className="w-5 h-5" />}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Categorized lists */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-widest block mb-2">
              Niche Nailing (Low Competition / High Affinity)
            </span>
            <div className="flex flex-wrap gap-2">
              {chartData.filter(h => h.type === 'Niche').map((h, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-lg hover:bg-teal-500/15 cursor-default transition-colors flex items-center gap-1"
                >
                  {h.name}
                  <span className="text-[9px] opacity-60">({h.relevance}%)</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-violet-400 font-extrabold uppercase tracking-widest block mb-2">
              Medium-Volume Growth (Balanced Reach)
            </span>
            <div className="flex flex-wrap gap-2">
              {chartData.filter(h => h.type === 'Medium').map((h, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg hover:bg-violet-500/15 cursor-default transition-colors flex items-center gap-1"
                >
                  {h.name}
                  <span className="text-[9px] opacity-60">({h.relevance}%)</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest block mb-2">
              Broad Category (High Competition / Mass Discovery)
            </span>
            <div className="flex flex-wrap gap-2">
              {chartData.filter(h => h.type === 'Broad').map((h, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/15 cursor-default transition-colors flex items-center gap-1"
                >
                  {h.name}
                  <span className="text-[9px] opacity-60">({h.relevance}%)</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scatter Plot visualization */}
        <div className="w-full lg:w-[45%] bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
              Reach vs Relevance Index
            </h4>
            <p className="text-[10px] text-slate-500 mb-4 leading-normal font-normal">
              Scatter plot positioning hashtags based on estimated reach (x) vs algorithm relevance (y).
            </p>
          </div>

          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
                <XAxis 
                  type="number" 
                  dataKey="reach" 
                  name="Est. Reach" 
                  unit="%" 
                  stroke="#475569" 
                  fontSize={8} 
                  tickLine={false} 
                />
                <YAxis 
                  type="number" 
                  dataKey="relevance" 
                  name="Relevance" 
                  unit="%" 
                  stroke="#475569" 
                  fontSize={8} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <ZAxis type="number" range={[50, 150]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={chartData}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getGroupColor(entry.type)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-400" /> Niche</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-400" /> Medium</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /> Broad</div>
          </div>
        </div>
      </div>
    </AnalysisCard>
  );
}
