import React, { useEffect } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Button from './ui/Button';

const Timer: React.FC = () => {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, updateTimer } = useWorkoutStore();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timer.isRunning && timer.timeLeft > 0) {
      intervalId = setInterval(() => {
        updateTimer();
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer.isRunning, timer.timeLeft, updateTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const durations = [30, 45, 60, 90];

  return (
    <div className="w-full space-y-6">
      <div className="relative text-center">
        <div className={`text-6xl font-black italic tracking-tighter tabular-nums transition-colors duration-300 ${timer.isRunning ? 'text-brand-yellow' : 'text-brand-white'}`}>
          {formatTime(timer.timeLeft)}
        </div>
        <p className="text-[10px] font-black tracking-[0.4em] text-brand-white/20 mt-2">CHRONO_READOUT</p>
      </div>

      <div className="flex justify-center gap-2">
        {timer.timeLeft === 0 || !timer.isRunning ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => timer.timeLeft > 0 ? resumeTimer() : startTimer(60, 'rest')}
            className="flex-1"
          >
            <Play size={16} />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={pauseTimer}
            className="flex-1"
          >
            <Pause size={16} />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={stopTimer}
          className="aspect-square !px-3 hover:text-red-500"
        >
          <RotateCcw size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => startTimer(d, 'rest')}
            className={`py-2 text-[10px] font-black border-2 transition-all ${timer.duration === d
                ? 'bg-brand-white text-brand-black border-brand-white'
                : 'border-brand-white/10 text-brand-white/40 hover:border-brand-white/40'
              }`}
          >
            {d}S
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timer;