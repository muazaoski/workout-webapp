import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Zap } from 'lucide-react';
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
            className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0, y: -20 }}
            className="relative w-full max-w-sm bg-brand-dark border-2 border-brand-yellow p-10 text-center shadow-[20px_20px_60px_rgba(0,0,0,0.8)]"
          >
            <div className="w-20 h-20 bg-brand-yellow mx-auto flex items-center justify-center mb-8">
              <Trophy size={40} className="text-brand-black" />
            </div>

            <div className="space-y-2 mb-10">
              <p className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.4em]">MISSION_COMPLETE</p>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{achievement.name}</h2>
            </div>

            <p className="text-sm font-bold text-brand-white/40 uppercase tracking-widest leading-relaxed mb-10">
              "{achievement.description}"
            </p>

            <div className="bg-brand-black border border-brand-white/10 p-6 mb-10">
              <p className="text-[10px] font-black text-brand-white/40 mb-2 tracking-[0.2em] uppercase">SYSTEM_CREDIT</p>
              <p className="text-3xl font-black italic">+{achievement.xpReward} XP</p>
            </div>

            <Button
              fullWidth
              variant="primary"
              size="lg"
              onClick={onClose}
            >
              ACKNOWLEDGE_EVOLUTION
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;