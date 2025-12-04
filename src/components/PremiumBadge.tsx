import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Diamond } from 'lucide-react';

interface PremiumBadgeProps {
  className?: string;
  onClick?: () => void;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ className = '', onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/premium');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-semibold hover:opacity-90 transition-opacity ${className}`}
    >
      <Diamond className="w-3 h-3" />
      Premium
    </button>
  );
};

export default PremiumBadge;
