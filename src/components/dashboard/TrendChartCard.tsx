import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendChartCardProps {
  title: string;
  change: number;
  data: number[];
  delay?: number;
}

const TrendChartCard: React.FC<TrendChartCardProps> = ({
  title,
  change,
  data,
  delay = 0,
}) => {
  const isPositive = change > 0;
  const maxValue = Math.max(...data);
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPositive ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-1 h-24 mb-3">
        {data.map((value, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ delay: delay + 0.1 * index, duration: 0.5 }}
            className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-md min-h-[4px]"
          />
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{months[0]}</span>
        <span>{months[months.length - 1]}</span>
      </div>
    </motion.div>
  );
};

export default TrendChartCard;
