import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
interface QuickRecommendationCardProps {
  recommendations: string[];
  onViewAll?: () => void;
}
const QuickRecommendationCard: React.FC<QuickRecommendationCardProps> = ({
  recommendations,
  onViewAll
}) => {
  const displayedRecommendations = recommendations.slice(0, 3);
  return;
};
export default QuickRecommendationCard;