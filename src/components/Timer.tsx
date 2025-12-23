import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import ProgressRing from './ui/ProgressRing';

const Timer: React.FC = () => {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, updateTimer } = useWorkoutStore();
  const [inputDuration, setInputDuration] = useState(60);

  const timerUpdate = useCallback(() => {
    updateTimer();
  }, [updateTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isActive && !timer.isPaused && timer.time > 0) {
      interval = setInterval(() => {
        timerUpdate();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isActive, timer.isPaused, timer.time, timerUpdate]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (timer.duration === 0) return 0;
    return ((timer.duration - timer.time) / timer.duration) * 100;
  };

  const getTypeColor = (): string => {
    switch (timer.type) {
      case 'work':
        return 'text-white';
      case 'rest':
        return 'text-white';
      case 'prepare':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  const getTypeLabel = (): string => {
    switch (timer.type) {
      case 'work':
        return 'Work';
      case 'rest':
        return 'Rest';
      case 'prepare':
        return 'Get Ready';
      default:
        return 'Timer';
    }
  };

  const handleStart = () => {
    startTimer(inputDuration, timer.type);
  };

  const handleReset = () => {
    stopTimer();
    setInputDuration(timer.duration || 60);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Timer Type Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className={`text-lg font-semibold ${getTypeColor()}`}>
          {getTypeLabel()}
        </span>
      </motion.div>

      {/* Timer Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ProgressRing
          progress={timer.duration > 0 ? getProgress() : 0}
          size={200}
          strokeWidth={12}
        >
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-white mb-2">
              {formatTime(timer.time)}
            </div>
            <div className="text-sm text-gray-400">
              {timer.duration > 0 && formatTime(timer.duration)}
            </div>
          </div>
        </ProgressRing>
      </motion.div>

      {/* Timer Controls */}
      <div className="flex items-center space-x-4">
        {!timer.isActive ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-dark-primary font-medium transition-all duration-300 hover:scale-105 hover:bg-gray-200 active:scale-95"
            >
              <Play size={20} className="mr-2 flex-shrink-0" />
              <span>Start</span>
            </motion.button>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={inputDuration}
                onChange={(e) => setInputDuration(Math.max(1, parseInt(e.target.value) || 60))}
                className="minimal-input w-20 text-center"
                min="1"
                max="999"
              />
              <span className="text-gray-400 text-sm">sec</span>
            </div>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={timer.isPaused ? resumeTimer : pauseTimer}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-dark-primary font-medium transition-all duration-300 hover:scale-105 hover:bg-gray-200 active:scale-95"
            >
              {timer.isPaused ? <Play size={20} className="mr-2 flex-shrink-0" /> : <Pause size={20} className="mr-2 flex-shrink-0" />}
              <span>{timer.isPaused ? 'Resume' : 'Pause'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-4 py-3 rounded-xl bg-dark-secondary border border-gray-700 text-white hover:border-white/50 transition-all duration-200"
            >
              <RotateCcw size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopTimer}
              className="px-4 py-3 rounded-xl bg-red-600/20 border border-red-600/50 text-red-400 hover:bg-red-600/30 transition-all duration-200"
            >
              <Square size={20} />
            </motion.button>
          </>
        )}
      </div>

      {/* Quick Duration Buttons */}
      {!timer.isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[30, 60, 90, 120, 180].map((duration) => (
            <motion.button
              key={duration}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInputDuration(duration)}
              className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                inputDuration === duration
                  ? 'bg-white/10 border border-white/30 text-white'
                  : 'bg-dark-secondary border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {duration < 60 ? `${duration}s` : `${duration / 60}m`}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Timer;