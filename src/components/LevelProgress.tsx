import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { motion } from 'framer-motion';

const LevelProgress: React.FC = () => {
  const { userLevel } = useWorkoutStore();
  const progress = (userLevel.currentXP / userLevel.xpToNext) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm font-black italic mr-2 uppercase">{userLevel.title}</span>
          <span className="text-[10px] font-bold text-brand-white/40 tracking-widest">RANK_STABILITY</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-black tabular-nums">{userLevel.currentXP}</span>
          <span className="text-[10px] text-brand-white/20 mx-1">/</span>
          <span className="text-sm font-black text-brand-white/40 tabular-nums">{userLevel.xpToNext} XP</span>
        </div>
      </div>

      <div className="h-4 bg-brand-white/5 border border-brand-white/10 relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-brand-yellow"
        />
      </div>

      <div className="flex justify-between items-center text-[9px] font-black text-brand-white/20 tracking-[0.3em] uppercase">
        <span>ID_{userLevel.level.toString().padStart(2, '0')}</span>
        <span>LVL_EVOLUTION_ACTIVE</span>
        <span>NEXT_{userLevel.level + 1}</span>
      </div>
    </div>
  );
};

export default LevelProgress;