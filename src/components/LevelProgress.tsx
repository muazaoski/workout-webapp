import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';

const LevelProgress: React.FC = () => {
  const { userLevel } = useWorkoutStore();
  const progress = (userLevel.currentXP / userLevel.xpToNext) * 100;

  return (
    <div className="w-full space-y-6 pt-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-primary" />
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Level {userLevel.level}</span>
          </div>
          <h4 className="font-bold text-2xl tracking-tight">
            {userLevel.title}
          </h4>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary tabular-nums">
              {userLevel.currentXP}
            </span>
            <span className="text-sm font-medium text-muted-foreground">/ {userLevel.xpToNext} XP</span>
          </div>
        </div>
      </div>

      <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-primary relative shadow-lg shadow-primary/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        </motion.div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-primary" />
          <span>Progress to Next Rank</span>
        </div>
        <span>{Math.round(userLevel.xpToNext - userLevel.currentXP)} XP Remaining</span>
      </div>
    </div>
  );
};

export default LevelProgress;