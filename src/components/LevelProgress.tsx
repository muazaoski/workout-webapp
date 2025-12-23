import React from 'react';
import { motion } from 'framer-motion';
import type { UserLevel } from '../stores/workoutStore';
import ProgressRing from './ui/ProgressRing';
import { Star, Zap, Crown, Flame } from 'lucide-react';

interface LevelProgressProps {
  userLevel: UserLevel;
  compact?: boolean;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ userLevel, compact = false }) => {
  const progress = (userLevel.currentXP / userLevel.xpToNext) * 100;

  const getLevelIcon = () => {
    if (userLevel.level >= 50) return <Crown className="w-4 h-4" />;
    if (userLevel.level >= 30) return <Zap className="w-4 h-4" />;
    if (userLevel.level >= 10) return <Flame className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const getLevelColor = () => {
    if (userLevel.level >= 50) return 'text-yellow-400';
    if (userLevel.level >= 30) return 'text-purple-400';
    if (userLevel.level >= 10) return 'text-blue-400';
    return 'text-gray-400';
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-dark-tertiary border border-white/20 ${getLevelColor()}`}>
          {getLevelIcon()}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">
            Level {userLevel.level} {userLevel.title}
          </span>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-dark-tertiary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-white to-white/80"
              />
            </div>
            <span className="text-xs text-gray-400">
              {userLevel.currentXP}/{userLevel.xpToNext}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-secondary border border-white/20 rounded-xl p-6 space-y-4"
    >
      {/* Level Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-dark-tertiary border-2 border-white/30 ${getLevelColor()}`}
          >
            {getLevelIcon()}
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Level {userLevel.level}
            </h3>
            <p className={`text-sm font-medium ${getLevelColor()}`}>
              {userLevel.title}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {userLevel.totalXP}
          </div>
          <div className="text-xs text-gray-400">Total XP</div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center">
        <ProgressRing
          progress={progress}
          size={120}
          strokeWidth={8}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.floor(progress)}%
            </div>
            <div className="text-sm text-gray-400">
              {userLevel.currentXP} / {userLevel.xpToNext} XP
            </div>
          </div>
        </ProgressRing>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress to Level {userLevel.level + 1}</span>
          <span className="text-white font-medium">{userLevel.xpToNext - userLevel.currentXP} XP to go</span>
        </div>
        <div className="h-3 bg-dark-tertiary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-white via-white to-white/80 relative"
          >
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.div>
        </div>
      </div>

      {/* Level Milestones */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-dark-tertiary/50 rounded-lg p-2">
          <div className="text-lg font-bold text-white">{userLevel.level}</div>
          <div className="text-xs text-gray-400">Current</div>
        </div>
        <div className="bg-dark-tertiary/50 rounded-lg p-2">
          <div className="text-lg font-bold text-blue-400">{userLevel.level + 1}</div>
          <div className="text-xs text-gray-400">Next</div>
        </div>
        <div className="bg-dark-tertiary/50 rounded-lg p-2">
          <div className="text-lg font-bold text-purple-400">{userLevel.level + 5}</div>
          <div className="text-xs text-gray-400">Goal</div>
        </div>
      </div>
    </motion.div>
  );
};

export default LevelProgress;