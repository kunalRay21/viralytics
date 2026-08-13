import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface EmotionPoint {
  second: number;
  curiosity: number;
  excitement: number;
  humor: number;
  surprise: number;
}

interface EmotionChartProps {
  data: EmotionPoint[];
}

export function EmotionChart({ data }: EmotionChartProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
        >
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
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(13, 17, 26, 0.9)', 
              borderColor: 'rgba(255,255,255,0.08)',
              borderRadius: '12px'
            }}
            itemStyle={{ fontSize: '11px' }}
            labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '11px' }}
            labelFormatter={(label) => `Time: ${formatTime(label)}`}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="curiosity"
            name="Curiosity"
            stroke="#a78bfa" // purple
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="excitement"
            name="Excitement"
            stroke="#3b82f6" // blue
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="humor"
            name="Humor"
            stroke="#14b8a6" // teal
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="surprise"
            name="Surprise"
            stroke="#f59e0b" // amber
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
