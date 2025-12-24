import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
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
            className="absolute inset-0 bg-background/60 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden glass-card !p-0 border-primary/20 bg-card shadow-2xl"
          >
            <div className="p-10 text-center relative z-10">
              <div className="flex justify-center mb-8">
                <div className="h-32 w-32 rounded-[2.5rem] bg-primary text-black flex items-center justify-center text-6xl shadow-xl shadow-primary/20">
                  {achievement.icon}
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Achievement Unlocked</p>
                <h2 className="text-4xl font-extrabold tracking-tight">{achievement.name}</h2>
                <p className="text-muted-foreground text-lg italic">
                  "{achievement.description}"
                </p>
              </div>

              <div className="flex justify-center gap-6 mb-10">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Experience</p>
                  <div className="flex items-center gap-2">
                    <Zap size={18} className="text-primary" />
                    <span className="text-2xl font-bold">{achievement.xpReward} XP</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onClose}
                className="h-16 rounded-2xl font-bold"
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;