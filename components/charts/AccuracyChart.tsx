// src/components/charts/AccuracyChart.tsx

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AccuracyChartProps {
  data: Array<{
    date: string;
    accuracy: number;
    precision: number;
    recall: number;
  }>;
}

export function AccuracyChart({ data }: AccuracyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="date" 
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8' }}
          tickLine={{ stroke: '#334155' }}
        />
        <YAxis 
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8' }}
          tickLine={{ stroke: '#334155' }}
          domain={[0, 100]}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1E293B', 
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#F1F5F9'
          }}
          formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}%` : 'N/A'}
        />
        <Legend 
          wrapperStyle={{ color: '#F1F5F9' }}
        />
        <Line 
          type="monotone" 
          dataKey="accuracy" 
          stroke="#0D9488" 
          strokeWidth={2}
          dot={{ fill: '#0D9488', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="precision" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={{ fill: '#3B82F6', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="recall" 
          stroke="#F59E0B" 
          strokeWidth={2}
          dot={{ fill: '#F59E0B', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}