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
    <div className="w-full space-y-10 p-2">
      <div className="text-center group relative pt-4">
        {/* Ambient Glow background */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full blur-[60px] transition-all duration-1000 ${timer.isRunning ? 'bg-primary/20 opacity-100' : 'bg-white/5 opacity-0'
          }`} />

        <div className={`text-7xl font-black italic tracking-tighter tabular-nums transition-all duration-700 relative z-10 ${timer.isRunning ? 'text-primary drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]' : 'text-muted-foreground/40'
          }`}>
          {formatTime(timer.timeLeft)}
        </div>
        <div className="flex justify-center items-center gap-2 mt-4 relative z-10">
          <Zap size={10} className={`${timer.isRunning ? 'text-primary animate-pulse' : 'text-muted-foreground/20'}`} />
          <p className={`text-[10px] font-black tracking-[0.5em] uppercase transition-colors italic ${timer.isRunning ? 'text-primary font-black' : 'text-muted-foreground/30'}`}>
            Rest_Sequenc
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        {timer.timeLeft === 0 || !timer.isRunning ? (
          <Button
            variant="primary"
            fullWidth
            className="rounded-[1.5rem] h-16 text-xs font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
            onClick={() => timer.timeLeft > 0 ? resumeTimer() : startTimer(60, 'rest')}
          >
            <Play size={18} className="mr-3" /> Initiate_Rest
          </Button>
        ) : (
          <Button
            variant="outline"
            fullWidth
            className="rounded-[1.5rem] h-16 text-xs font-black uppercase tracking-widest border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 transition-all"
            onClick={pauseTimer}
          >
            <Pause size={18} className="mr-3" /> Halt_Process
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={stopTimer}
          className="rounded-[1.5rem] h-16 w-16 bg-white/5 border border-white/5 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <RotateCcw size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => startTimer(d, 'rest')}
            className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border-2 relative overflow-hidden group ${timer.duration === d
                ? 'bg-primary border-primary text-black shadow-lg shadow-primary/10'
                : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:border-white/10'
              }`}
          >
            <span className="relative z-10">{d}S</span>
            {timer.duration === d && (
              <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timer;