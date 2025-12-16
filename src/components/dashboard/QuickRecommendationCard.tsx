import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface QuickRecommendationCardProps {
  recommendations: string[];
  onViewAll?: () => void;
}

const QuickRecommendationCard: React.FC<QuickRecommendationCardProps> = ({
  recommendations,
  onViewAll,
}) => {
  const displayedRecommendations = recommendations.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Principais Recomendações</h3>
        {recommendations.length > 3 && (
          <button
            onClick={onViewAll}
            className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {displayedRecommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">{index + 1}</span>
            </div>
            <p className="text-sm text-foreground line-clamp-2">
              {rec.length > 100 ? `${rec.substring(0, 100)}...` : rec}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickRecommendationCard;
