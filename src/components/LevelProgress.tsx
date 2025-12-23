import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

const LevelProgress: React.FC = () => {
  const { userLevel } = useWorkoutStore();

  const progress = (userLevel.currentXP / userLevel.xpToNext) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-[10px] font-black text-punk-yellow tracking-widest uppercase mb-1 flex items-center gap-2">
            <Zap size={10} /> CURRENT_RANK
          </h4>
          <span className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            {userLevel.title}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">EVOLUTION_XP</div>
          <div className="text-xl font-black italic tabular-nums leading-none">
            {userLevel.currentXP} <span className="text-[10px] opacity-20">/</span> {userLevel.xpToNext}
          </div>
        </div>
      </div>

      {/* RAW PROGRESS BAR */}
      <div className="relative h-10 border-4 border-punk-white bg-punk-black overflow-hidden group">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-punk-yellow"
        >
          {/* Animated "energy" pulse in the bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full animate-in slide-in-from-left-full duration-1000 iteration-infinite"
            style={{ animation: 'shimmer 2s infinite linear' }} />
        </motion.div>

        {/* PROGRESS PERCENTAGE READOUT */}
        <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
          <span className="text-xs font-black italic tracking-[8px] uppercase">
            LOAD_PROGRESS: {Math.round(progress)}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* NEXT PHASE INDICATOR */}
      <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
        <TrendingUp size={12} className="text-punk-yellow" />
        <span className="text-[8px] font-black uppercase tracking-widest italic">
          REMAINING_XP_FOR_LEVEL_{userLevel.level + 1}_UPGRADE: {userLevel.xpToNext - userLevel.currentXP}
        </span>
      </div>
    </div>
  );
};

export default LevelProgress;