import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';

interface RetentionPoint {
  second: number;
  retentionPercent: number;
}

interface TimedNote {
  second: number;
  note: string;
}

interface RetentionChartProps {
  data: RetentionPoint[];
  dropOffPoints?: TimedNote[];
  strongPoints?: TimedNote[];
}

export function RetentionChart({ data, dropOffPoints = [], strongPoints = [] }: RetentionChartProps) {
  // Format seconds to timeline ticks, e.g. "0:05"
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as RetentionPoint;
      
      // Check if there is a note for this second
      const dropNote = dropOffPoints.find(n => Math.abs(n.second - point.second) <= 1);
      const strongNote = strongPoints.find(n => Math.abs(n.second - point.second) <= 1);

      return (
        <div className="glass-panel p-3 border border-white/10 text-xs">
          <p className="font-extrabold text-white mb-1">Time: {formatTime(point.second)}</p>
          <p className="text-violet-400 font-bold">Retention: {point.retentionPercent}%</p>
          {dropNote && (
            <p className="text-red-400 mt-1 font-semibold max-w-44 leading-normal">
              ⚠️ {dropNote.note}
            </p>
          )}
          {strongNote && (
            <p className="text-teal-400 mt-1 font-semibold max-w-44 leading-normal">
              🌟 {strongNote.note}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="retentionColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis 
            dataKey="second" 
            tickFormatter={formatTime}
            stroke="#64748b" 
            fontSize={10}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="#64748b" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="retentionPercent" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#retentionColor)" 
            isAnimationActive={true}
            animationDuration={800}
          />

          {/* Reference Lines for drop offs */}
          {dropOffPoints.map((pt, idx) => (
            <ReferenceLine
              key={`drop-${idx}`}
              x={pt.second}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ 
                value: 'Drop-off', 
                position: 'top', 
                fill: '#f87171', 
                fontSize: 9, 
                fontWeight: 'bold' 
              }}
            />
          ))}

          {/* Reference Lines for strong retention peaks */}
          {strongPoints.map((pt, idx) => (
            <ReferenceLine
              key={`strong-${idx}`}
              x={pt.second}
              stroke="#14b8a6"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ 
                value: 'Peak', 
                position: 'top', 
                fill: '#2dd4bf', 
                fontSize: 9, 
                fontWeight: 'bold' 
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
