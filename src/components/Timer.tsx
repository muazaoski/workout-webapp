import React, { useEffect } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
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
    <div className="w-full space-y-8 p-2">
      <div className="text-center group relative pt-4">
        <div className={`text-6xl font-bold font-mono tracking-tight tabular-nums transition-all duration-700 relative z-10 ${timer.isRunning ? 'text-primary' : 'text-muted-foreground/40'
          }`}>
          {formatTime(timer.timeLeft)}
        </div>
        <p className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-colors italic mt-2 ${timer.isRunning ? 'text-primary' : 'text-muted-foreground/30'}`}>
          Rest Timer
        </p>
      </div>

      <div className="flex gap-3">
        {timer.timeLeft === 0 || !timer.isRunning ? (
          <Button
            variant="primary"
            fullWidth
            className="rounded-2xl h-14 font-bold"
            onClick={() => timer.timeLeft > 0 ? resumeTimer() : startTimer(60, 'rest')}
          >
            <Play size={18} className="mr-2" /> Start Rest
          </Button>
        ) : (
          <Button
            variant="ghost"
            fullWidth
            className="rounded-2xl h-14 font-bold border border-white/5"
            onClick={pauseTimer}
          >
            <Pause size={18} className="mr-2" /> Pause
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={stopTimer}
          className="rounded-2xl h-14 w-14 bg-white/5 border border-white/5 text-muted-foreground hover:text-red-500 transition-all"
        >
          <RotateCcw size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => startTimer(d, 'rest')}
            className={`py-3 rounded-xl text-xs font-bold transition-all border ${timer.duration === d
                ? 'bg-primary border-primary text-black'
                : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10'
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