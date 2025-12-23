import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { motion } from 'framer-motion';

const LevelProgress: React.FC = () => {
  const { userLevel } = useWorkoutStore();
  const progress = (userLevel.currentXP / userLevel.xpToNext) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="font-bold text-lg">{userLevel.title}</h4>
          <p className="text-xs text-slate-500 font-medium tracking-tight">Level {userLevel.level}</p>
        </div>
        <div className="text-right">
          <span className="font-bold text-slate-900 dark:text-white">{userLevel.currentXP}</span>
          <span className="text-sm text-slate-400"> / {userLevel.xpToNext} XP</span>
        </div>
      </div>

      <div className="h-3 bg-slate-100 rounded-full dark:bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-slate-900 dark:bg-white rounded-full"
        />
      </div>

      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider text-center">
        Approx. {Math.round(userLevel.xpToNext - userLevel.currentXP)} XP needed for next level
      </p>
    </div>
  );
};

export default LevelProgress;