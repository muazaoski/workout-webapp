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
            <Trophy size={18} className="text-amber-500" />
            <h4 className="font-extrabold text-2xl italic tracking-tighter uppercase">{userLevel.title}</h4>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/5">Rank_{userLevel.level}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span className="text-xs font-bold uppercase tracking-wider">Evolution Progress</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black italic text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">{userLevel.currentXP}</span>
            <span className="text-sm font-bold text-muted-foreground/50">/ {userLevel.xpToNext}</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mt-1">Experience_Points</p>
        </div>
      </div>

      <div className="relative h-6 bg-white/5 rounded-2xl border border-white/5 p-1 overflow-hidden shadow-inner">
        {/* Dynamic Shine */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 skew-x-12"
        />

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 rounded-xl relative shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </motion.div>
      </div>

      <div className="flex justify-between items-center text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2">
          <Sparkles size={10} className="text-primary" />
          <span>Next_Unlock</span>
        </div>
        <span>{Math.round(userLevel.xpToNext - userLevel.currentXP)} XP Required</span>
      </div>
    </div>
  );
};

export default LevelProgress;