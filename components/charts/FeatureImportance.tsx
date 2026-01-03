// src/components/charts/FeatureImportance.tsx - Bar chart for feature importance

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FeatureImportanceProps {
  data: Array<{
    feature: string;
    importance: number;
  }>;
}

const COLORS = ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4'];

export function FeatureImportance({ data }: FeatureImportanceProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={data} 
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          type="number" 
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8' }}
          tickLine={{ stroke: '#334155' }}
          domain={[0, 100]}
        />
        <YAxis 
          type="category"
          dataKey="feature" 
          stroke="#94A3B8"
          tick={{ fill: '#94A3B8' }}
          tickLine={{ stroke: '#334155' }}
          width={90}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1E293B', 
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#F1F5F9'
          }}
          formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}%` : 'N/A'}
          cursor={{ fill: '#334155' }}
        />
        <Bar 
          dataKey="importance" 
          radius={[0, 8, 8, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}