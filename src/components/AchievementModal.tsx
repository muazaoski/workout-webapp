import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '../stores/workoutStore';
import Button from './ui/Button';
import { X, Trophy, Sparkles } from 'lucide-react';

interface AchievementModalProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && achievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-dark-secondary border border-white/20 rounded-2xl shadow-2xl shadow-white/20 overflow-hidden"
          >
            {/* Celebration Header */}
            <div className="relative h-32 bg-gradient-to-br from-white/10 to-transparent overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-6xl">{achievement.icon}</div>
              </motion.div>

              {/* Sparkles animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="absolute top-4 left-4"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                className="absolute top-4 right-4"
              >
                <Sparkles className="w-6 h-6 text-blue-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                className="absolute bottom-4 left-8"
              >
                <Sparkles className="w-5 h-5 text-green-400" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5 }}
                className="absolute bottom-4 right-8"
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
              </motion.div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Achievement Info */}
            <div className="p-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center mb-4"
              >
                <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-lg font-semibold text-yellow-400">Achievement Unlocked!</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {achievement.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 mb-4"
              >
                {achievement.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white mb-6"
              >
                +50 XP
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button onClick={onClose} className="w-full">
                  Awesome!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;