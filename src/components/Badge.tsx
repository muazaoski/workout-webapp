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
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`
          relative rounded-full border-2 transition-all duration-300
          ${sizeClasses[size]}
          ${isUnlocked
            ? 'border-white bg-gradient-to-br from-white/20 to-white/10 shadow-lg shadow-white/20'
            : 'border-gray-700 bg-dark-tertiary/50'
          }
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        {/* Badge Content */}
        <div className="flex items-center justify-center h-full">
          <span
            className={`
              transition-all duration-300
              ${isUnlocked ? 'opacity-100' : 'opacity-30 grayscale'}
            `}
          >
            {achievement.icon}
          </span>
        </div>

        {/* Unlock Animation Overlay */}
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-white"
            />
          </motion.div>
        )}

        {/* Glow effect for unlocked badges */}
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-0 rounded-full bg-white/20 blur-md"
          />
        )}

        {/* Lock icon for locked badges */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-500"
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark-primary border border-white/20 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
          style={{ display: 'none' }}
        >
          <div className="font-medium">{achievement.name}</div>
          <div className="text-xs text-gray-400 mt-1">{achievement.description}</div>
          {achievement.unlockedAt && (
            <div className="text-xs text-green-400 mt-1">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-dark-primary"></div>
          </div>
        </motion.div>
      )}

      {/* Hover trigger for tooltip */}
      <div className="absolute inset-0 group" />
    </div>
  );
};

export default Badge;