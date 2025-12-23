import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Star } from 'lucide-react';
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md dark:bg-black/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0, y: -10 }}
            className="relative w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl dark:bg-slate-900 overflow-hidden"
          >
            {/* Sparkle background effects */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="relative mb-6">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center dark:bg-amber-900/20">
                <Trophy size={40} className="text-amber-500" />
              </div>
              <motion.div
                animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none"
              >
                <Star size={100} className="text-amber-500" />
              </motion.div>
            </div>

            <div className="space-y-2 mb-8">
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">New Achievement</h3>
              <h2 className="text-2xl font-bold tracking-tight">{achievement.name}</h2>
              <p className="text-slate-500 text-sm">{achievement.description}</p>
            </div>

            <div className="mb-8 p-4 bg-slate-50 rounded-2xl dark:bg-slate-800">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">+{achievement.xpReward} XP</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience Rewarded</p>
            </div>

            <Button
              fullWidth
              variant="primary"
              size="lg"
              onClick={onClose}
              className="rounded-2xl"
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