import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Star, Zap, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import type { Achievement } from '../types/workout';

interface AchievementModalProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, isVisible, onClose }) => {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -30 }}
            className="relative w-full max-w-sm glass-card !p-12 text-center overflow-hidden border-indigo-500/30 glow-indigo"
          >
            {/* Ambient Background Rays */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

            <div className="relative mb-8 pt-4">
              <div className="w-24 h-24 bg-indigo-500 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/50 relative z-10">
                <Trophy size={48} className="text-white" />
              </div>

              {/* Outer Ring Animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-40 border border-indigo-500/10 rounded-full flex items-center justify-center opacity-40"
              >
                <div className="absolute top-0 h-2 w-2 bg-indigo-500 rounded-full" />
              </motion.div>
            </div>

            <div className="space-y-3 mb-10 relative z-10">
              <div className="flex items-center justify-center gap-2 text-indigo-400">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Achievement_Unlocked</span>
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter leading-none">{achievement.name}</h2>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed px-4">
                "{achievement.description}"
              </p>
            </div>

            <div className="mb-10 p-6 bg-white/5 rounded-3xl border border-white/5 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <Zap size={20} className="text-indigo-400" />
                <p className="text-4xl font-black italic text-white">+{achievement.xpReward} XP</p>
              </div>
              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-3 opacity-30">Experience_Reward_Issued</p>
            </div>

            <Button
              fullWidth
              variant="primary"
              size="lg"
              onClick={onClose}
              className="rounded-[2rem] h-20 text-xl font-black italic tracking-tighter shadow-2xl shadow-indigo-500/30 glow-indigo relative z-10"
            >
              Continue Journey
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;