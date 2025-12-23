import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Zap } from 'lucide-react';

const LevelProgress: React.FC = () => {
  const { userLevel } = useWorkoutStore();
  const progress = (userLevel.currentXP / userLevel.xpToNext) * 100;

  return (
    <div className="w-full space-y-8 pt-4">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <Trophy size={20} className="text-black" />
            </div>
            <h4 className="font-black text-4xl italic tracking-tighter uppercase text-white leading-none">
              {userLevel.title.toUpperCase()}_PROTOCOL
            </h4>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground ml-1">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20">OPERATIONAL_RANK {String(userLevel.level).padStart(2, '0')}</span>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 italic">Evolution_Continuum</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black italic text-primary drop-shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all tabular-nums leading-none">
              {userLevel.currentXP}
            </span>
            <span className="text-xl font-black text-white/20 italic">/ {userLevel.xpToNext}</span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 mt-3 italic">Exp_Data_Accumulation</p>
        </div>
      </div>

      <div className="relative h-8 bg-black/60 rounded-[1.25rem] border border-white/5 p-1.5 overflow-hidden shadow-inner flex items-center">
        {/* Dynamic Energy Wave */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent z-10 skew-x-[30deg]"
        />

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-yellow-600 via-primary to-yellow-300 rounded-xl relative shadow-[0_0_25px_rgba(250,204,21,0.5)] group"
        >
          {/* Inner texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />

          {/* Leading Glow */}
          <div className="absolute top-0 right-0 h-full w-2 bg-white rounded-full blur-[4px] opacity-40" />
        </motion.div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.35em] italic">
        <div className="flex items-center gap-2 group cursor-help">
          <Sparkles size={11} className="text-primary animate-pulse" />
          <span className="group-hover:text-primary transition-colors">NEXT_MOD_UNLOCK</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={11} className="text-primary/40" />
          <span>{Math.round(userLevel.xpToNext - userLevel.currentXP)} XP_DELTA REQUIRED</span>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;