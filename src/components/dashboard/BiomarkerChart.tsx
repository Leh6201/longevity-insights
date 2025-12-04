import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface BiomarkerChartProps {
  title: string;
  data: { name: string; value: number | null; reference: { min: number; max: number } }[];
}

const BiomarkerChart: React.FC<BiomarkerChartProps> = ({ title, data }) => {
  const { t } = useTranslation();

  const getBarColor = (value: number | null, ref: { min: number; max: number }) => {
    if (value === null) return 'hsl(var(--muted))';
    if (value < ref.min || value > ref.max) return 'hsl(var(--warning))';
    return 'hsl(var(--primary))';
  };

  const chartData = data.map(item => ({
    name: item.name,
    value: item.value || 0,
    color: getBarColor(item.value, item.reference),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>Out of range</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerChart;
