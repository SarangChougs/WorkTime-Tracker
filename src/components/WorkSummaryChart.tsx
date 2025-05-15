"use client";

import type React from 'react';
import type { TimeLog } from '@/types/timetracker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartHorizontal } from 'lucide-react';

interface WorkSummaryChartProps {
  logs: TimeLog[];
}

const WorkSummaryChart: React.FC<WorkSummaryChartProps> = ({ logs }) => {
  const processDataForChart = () => {
    const categoryTotals: { [key: string]: number } = {};
    logs.forEach(log => {
      categoryTotals[log.category] = (categoryTotals[log.category] || 0) + log.duration;
    });

    return Object.entries(categoryTotals).map(([name, totalDuration]) => ({
      name,
      // Convert duration from ms to hours for better readability in chart
      hours: parseFloat((totalDuration / (1000 * 60 * 60)).toFixed(2)), 
    }));
  };

  const chartData = processDataForChart();

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BarChartHorizontal className="mx-auto h-12 w-12 mb-4" />
        <p className="text-lg">No data for summary yet.</p>
        <p>Log some activities to see a summary here.</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          itemStyle={{ color: 'hsl(var(--primary))' }}
        />
        <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
        <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WorkSummaryChart;
