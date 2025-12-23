import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Star, X } from 'lucide-react';
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
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl overflow-hidden glass-card !p-0 border-primary/20 bg-background/40 shadow-[0_0_100px_rgba(250,204,21,0.2)]"
          >
            {/* Top Shine/Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="p-12 text-center relative z-10">
              <div className="flex justify-center mb-10">
                <div className="relative">
                  {/* Rotating Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-[-40px] inset-y-[-40px] border border-dashed border-primary/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-[-25px] inset-y-[-25px] border-2 border-primary/10 rounded-full"
                  />

                  <div className="h-44 w-44 rounded-[3.5rem] bg-gradient-to-br from-yellow-400 to-primary text-black flex items-center justify-center text-7xl shadow-[0_0_60px_rgba(250,204,21,0.4)] rotate-12 transition-transform hover:rotate-0 duration-500">
                    {achievement.icon}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-10 bg-primary/30" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Mission_Complete</span>
                  <div className="h-px w-10 bg-primary/30" />
                </div>
                <h2 className="text-6xl font-black tracking-tighter uppercase italic">{achievement.name}</h2>
                <p className="text-muted-foreground text-xl font-medium max-w-md mx-auto opacity-70 leading-relaxed italic">
                  "{achievement.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center">
                  <Zap className="text-primary mb-2" size={24} />
                  <span className="text-2xl font-black italic tracking-tighter">{achievement.xpReward}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Merit_XP</span>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center">
                  <Star className="text-primary mb-2" size={24} />
                  <span className="text-2xl font-black italic tracking-tighter">ELITE</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Archive_Status</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onClose}
                className="h-20 text-2xl font-black italic tracking-tighter rounded-[2.5rem] shadow-2xl shadow-primary/30 glow-primary"
              >
                INITIALIZE_SYNC
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;