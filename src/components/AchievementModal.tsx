import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Zap, Target } from 'lucide-react';
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
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-punk-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* SCANLINE OVERLAY */}
            <div className="scanline opacity-10" />

            {/* CONTENT CARD */}
            <motion.div
              initial={{ scale: 0.8, rotate: -5, y: 50, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
              exit={{ scale: 1.1, rotate: 5, y: -50, opacity: 0 }}
              className="w-full max-w-md punk-card border-4 border-punk-yellow bg-punk-black p-0 overflow-visible relative shadow-[20px_20px_0px_white]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* STATUS BAR */}
              <div className="bg-punk-yellow flex justify-between items-center px-4 py-2 border-b-4 border-punk-black">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-punk-black" />
                  <span className="text-[10px] font-black text-punk-black uppercase tracking-[4px]">PHASE_COMPLETE</span>
                </div>
                <button onClick={onClose} className="text-punk-black hover:scale-125 transition-transform">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 text-center">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                  className="w-24 h-24 bg-punk-yellow mx-auto flex items-center justify-center border-4 border-punk-white shadow-[8px_8px_0px_#000] mb-8"
                >
                  <Trophy size={48} className="text-punk-black" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none"
                >
                  {achievement.name}
                </motion.h2>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="h-1 bg-punk-yellow w-24 mx-auto mb-6"
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="font-mono text-sm text-punk-white/60 uppercase tracking-widest leading-relaxed mb-10 px-4 italic"
                >
                  " {achievement.description} "
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-punk-dark border-2 border-punk-yellow/30 p-4 inline-block mb-10"
                >
                  <div className="text-[10px] font-black text-punk-yellow mb-1 tracking-widest uppercase">REWARD_CREDITED</div>
                  <div className="text-2xl font-black italic">+{achievement.xpReward} XP</div>
                </motion.div>

                <Button
                  fullWidth
                  variant="yellow"
                  size="lg"
                  onClick={onClose}
                  className="shadow-[8px_8px_0px_white] hover:shadow-none translate-x-1 translate-y-1"
                >
                  CONFIRM_AND_EVOLVE
                </Button>
              </div>

              {/* RAW DECORATION */}
              <div className="absolute -bottom-10 -left-4 text-[60px] font-black text-punk-white/5 pointer-events-none select-none italic uppercase -skew-x-12">
                VICTORY
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;