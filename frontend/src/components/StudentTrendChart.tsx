
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StudentData } from '../types';

interface Props {
  data: StudentData[];
}

const StudentTrendChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
            minTickGap={20}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                padding: '12px'
            }}
            itemStyle={{ fontSize: '12px', fontWeight: 600, padding: '2px 0' }}
            labelStyle={{ fontWeight: 800, marginBottom: '8px', color: '#1e293b' }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingBottom: '30px', color: '#64748b' }} 
          />
          <Line 
            type="monotone" 
            dataKey="stressLevel" 
            name="Stress Index" 
            stroke="#6366f1" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
          />
          <Line 
            type="monotone" 
            dataKey="moodScore" 
            name="Mood Score" 
            stroke="#f59e0b" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} 
          />
          <Line 
            type="monotone" 
            dataKey="sleepHours" 
            name="Sleep (Hrs)" 
            stroke="#10b981" 
            strokeWidth={3} 
            strokeDasharray="6 6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentTrendChart;
