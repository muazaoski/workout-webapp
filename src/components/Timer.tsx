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
      <div className="text-center">
        <div className={`text-5xl font-bold tracking-tight tabular-nums transition-colors duration-300 ${timer.isRunning ? 'text-primary' : 'text-slate-400'}`}>
          {formatTime(timer.timeLeft)}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {timer.timeLeft === 0 || !timer.isRunning ? (
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => timer.timeLeft > 0 ? resumeTimer() : startTimer(60, 'rest')}
          >
            <Play size={18} className="mr-2" /> Start
          </Button>
        ) : (
          <Button
            variant="outline"
            className="flex-1"
            onClick={pauseTimer}
          >
            <Pause size={18} className="mr-2" /> Pause
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={stopTimer}
          className="text-slate-400 hover:text-red-500"
        >
          <RotateCcw size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => startTimer(d, 'rest')}
            className={`py-2 rounded-lg text-xs font-semibold transition-all border ${timer.duration === d
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200 dark:bg-slate-800'
              }`}
          >
            {d}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timer;