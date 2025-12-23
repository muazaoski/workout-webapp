import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import Timer from './Timer';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import ProgressRing from './ui/ProgressRing';
import { ChevronLeft, ChevronRight, Check, Zap, Play, Pause, Activity, Dumbbell, X } from 'lucide-react';

const ActiveWorkout: React.FC = () => {
  const {
    currentWorkout,
    activeExerciseIndex,
    activeSetIndex,
    updateSet,
    nextExercise,
    previousExercise,
    finishWorkout,
    removeExerciseFromWorkout,
    stats
  } = useWorkoutStore();

  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  if (!currentWorkout) return null;

  const currentExercise = currentWorkout.exercises[activeExerciseIndex];
  const currentSet = currentExercise?.sets[activeSetIndex];

  const handleCompleteSet = () => {
    if (currentExercise && currentSet && reps) {
      updateSet(activeExerciseIndex, activeSetIndex, {
        reps: parseInt(reps) || 0,
        weight: parseFloat(weight) || 0,
        completed: true,
      });

      if (activeSetIndex < currentExercise.sets.length - 1) {
        setReps('');
        setWeight('');
      } else {
        if (activeExerciseIndex < currentWorkout.exercises.length - 1) {
          nextExercise();
          setReps('');
          setWeight('');
        }
      }
    }
  };

  const completedSets = currentExercise?.sets.filter(s => s.completed).length || 0;
  const totalSets = currentExercise?.sets.length || 0;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
        <div className="flex items-start gap-6">
          <div className="h-20 w-20 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-5xl shadow-2xl shadow-indigo-500/10">
            {currentExercise?.exercise.icon || '🏋️'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Current Objective</span>
            </div>
            <h2 className="text-5xl font-extrabold tracking-tighter">
              {currentExercise?.exercise.name}
            </h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium opacity-60">
              Targeting {currentExercise?.exercise.muscleGroups.join(' & ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-3xl border border-white/5">
          <Button variant="ghost" size="icon" onClick={previousExercise} disabled={activeExerciseIndex === 0} className="rounded-2xl h-12 w-12">
            <ChevronLeft size={24} />
          </Button>
          <div className="px-6 py-2 flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Exercise</span>
            <span className="text-xl font-bold font-mono">{activeExerciseIndex + 1} / {currentWorkout.exercises.length}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={nextExercise} disabled={activeExerciseIndex === currentWorkout.exercises.length - 1} className="rounded-2xl h-12 w-12">
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* PERFORMANCE PANEL */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="!p-10 relative overflow-hidden group border-indigo-500/20 glow-indigo">
            <div className="absolute top-0 right-0 p-8 h-40 w-40 opacity-5 group-hover:opacity-10 transition-opacity">
              <Dumbbell size={160} className="-rotate-12" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeExerciseIndex}-${activeSetIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 relative z-10"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-extrabold tracking-tight">Set {activeSetIndex + 1}</h3>
                  <div className="flex gap-2">
                    {currentExercise.sets.map((s, i) => (
                      <div
                        key={i}
                        className={`h-2.5 w-10 rounded-full transition-all duration-500 ${i === activeSetIndex
                          ? 'bg-indigo-500 shadow-lg shadow-indigo-500/40 w-16'
                          : i < activeSetIndex ? 'bg-indigo-500/40' : 'bg-white/5'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <Input
                    label="Repetitions"
                    type="number"
                    placeholder="0"
                    value={reps}
                    onChange={e => setReps(e.target.value)}
                    autoFocus
                    className="text-4xl font-bold h-24 rounded-3xl bg-white/5 border-transparent focus:bg-white/10"
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    placeholder="0.0"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="text-center text-4xl font-bold h-24 rounded-3xl bg-white/5 border-transparent focus:bg-white/10"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!reps || currentSet?.completed}
                  onClick={handleCompleteSet}
                  className="h-20 text-2xl font-bold rounded-[2rem] shadow-2xl shadow-indigo-500/30"
                >
                  {currentSet?.completed ? 'Log Confirmed' : 'Commit Performance'}
                </Button>
              </motion.div>
            </AnimatePresence>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card className="!p-8 text-center flex flex-col items-center justify-center">
              <Activity size={32} className="text-accent mb-4" />
              <p className="text-3xl font-bold font-mono tabular-nums">{stats.totalReps + (parseInt(reps) || 0)}</p>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-2">Cumulative Reps</p>
            </Card>
            <Card className="!p-8 text-center flex flex-col items-center justify-center">
              <Zap size={32} className="text-amber-400 mb-4" />
              <p className="text-3xl font-bold font-mono tabular-nums">{(parseFloat(weight) || 0).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-2">Active Load (kg)</p>
            </Card>
          </div>
        </div>

        {/* MONITOR AREA */}
        <div className="space-y-8">
          <Card title="Volume Progress" description="Real-time set completion tracking." className="text-center">
            <div className="flex justify-center py-6">
              <ProgressRing progress={progress} size={180} strokeWidth={12} color="#6366f1">
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-black italic tracking-tighter leading-none">{completedSets}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-2">of {totalSets} sets</span>
                </div>
              </ProgressRing>
            </div>
          </Card>

          <Card title="Rest Recovery" description="Optimal restoration between sets.">
            <Timer />
          </Card>
        </div>
      </div>

      {/* FINALIZE BLOCK */}
      <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row gap-6">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={finishWorkout}
          className="md:order-2 h-24 text-3xl font-black italic tracking-tighter rounded-[2.5rem] shadow-2xl shadow-indigo-500/40 glow-indigo"
        >
          Finalize Session
        </Button>
        <Button
          variant="danger"
          size="lg"
          onClick={() => { }}
          className="md:order-1 h-24 text-lg font-bold rounded-[2.5rem] border-none bg-red-500/5 hover:bg-red-500/10 text-red-500 px-10"
        >
          Terminate Session
        </Button>
      </div>
    </div>
  );
};

export default ActiveWorkout;