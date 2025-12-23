import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '../types/workout';

interface BadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  achievement,
  size = 'md',
  showTooltip = true,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const isUnlocked = achievement.unlocked;

  return (
    <div className="relative inline-block group">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`
          relative rounded-full border-2 transition-all duration-300
          ${sizeClasses[size]}
          ${isUnlocked
            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
            : 'border-white/10 bg-white/5'
          }
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        {/* Badge Content */}
        <div className="flex items-center justify-center h-full">
          <span
            className={`
              transition-all duration-300
              ${isUnlocked ? 'opacity-100' : 'opacity-20 grayscale'}
            `}
          >
            {achievement.icon}
          </span>
        </div>

        {/* Lock icon for locked badges */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0110 0v4"></path>
            </svg>
          </div>
        )}
      </motion.button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-card border border-white/5 rounded-2xl text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
          <div className="font-bold text-sm text-primary">{achievement.name}</div>
          <div className="text-muted-foreground mt-1">{achievement.description}</div>
          {achievement.unlockedAt && (
            <div className="text-primary/60 mt-2 font-bold uppercase tracking-tighter text-[10px]">
              Earned {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-[6px] border-transparent border-t-card"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Badge;