import React, { useEffect } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
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

  const durations = [30, 60, 90, 120];

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        {/* RAW CHRONO READOUT */}
        <div className={`text-6xl font-black italic tracking-tighter tabular-nums text-center transition-colors duration-300 ${timer.isRunning ? 'text-punk-yellow' : 'text-punk-white/20'}`}>
          {formatTime(timer.timeLeft)}
        </div>
        {timer.isRunning && (
          <div className="absolute -top-4 -right-4 bg-punk-yellow text-punk-black text-[8px] font-black px-1 animate-pulse">
            LIVE_CHRONO
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        {timer.timeLeft === 0 || !timer.isRunning ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => timer.timeLeft > 0 ? resumeTimer() : startTimer(60, 'rest')}
            className="border-punk-white/10 p-2"
          >
            <Play size={20} />
          </Button>
        ) : (
          <Button
            variant="yellow"
            size="sm"
            onClick={pauseTimer}
            className="p-2"
          >
            <Pause size={20} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={stopTimer}
          className="border-punk-white/10 p-2 text-red-500"
        >
          <RotateCcw size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => startTimer(d, 'rest')}
            className={`border-2 py-1 text-[10px] font-black transition-all ${timer.duration === d
                ? 'bg-punk-white text-punk-black border-punk-white'
                : 'border-punk-white/10 text-punk-white/40 hover:border-punk-white/40'
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