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
    <div className="w-full space-y-8 p-2">
      <div className="text-center group">
        <div className={`text-6xl font-black italic tracking-tighter tabular-nums transition-all duration-500 scale-100 group-hover:scale-105 ${timer.isRunning ? 'text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-muted-foreground'
          }`}>
          {formatTime(timer.timeLeft)}
        </div>
        <p className={`text-[10px] font-black tracking-[0.4em] uppercase mt-3 transition-colors ${timer.isRunning ? 'text-indigo-400/50' : 'text-muted-foreground/30'}`}>
          Recovery_Phase
        </p>
      </div>

      <div className="flex gap-3">
        {timer.timeLeft === 0 || !timer.isRunning ? (
          <Button
            variant="primary"
            fullWidth
            className="rounded-2xl h-14 text-base bg-indigo-500 shadow-lg shadow-indigo-500/20"
            onClick={() => timer.timeLeft > 0 ? resumeTimer() : startTimer(60, 'rest')}
          >
            <Play size={20} className="mr-2" /> Resume
          </Button>
        ) : (
          <Button
            variant="outline"
            fullWidth
            className="rounded-2xl h-14 text-base border-indigo-500/30 text-indigo-400 bg-indigo-500/5"
            onClick={pauseTimer}
          >
            <Pause size={20} className="mr-2" /> Pause
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={stopTimer}
          className="rounded-2xl h-14 w-14 bg-white/5 border border-white/5 text-muted-foreground hover:text-red-400"
        >
          <RotateCcw size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => startTimer(d, 'rest')}
            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${timer.duration === d
                ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:border-white/10'
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