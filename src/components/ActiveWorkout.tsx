import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import Timer from './Timer';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import ProgressRing from './ui/ProgressRing';
import { ChevronLeft, ChevronRight, Check, Zap, Play, Pause, Square, Trash2 } from 'lucide-react';

const ActiveWorkout: React.FC = () => {
  const {
    currentWorkout,
    activeExerciseIndex,
    activeSetIndex,
    updateSet,
    nextExercise,
    previousExercise,
    finishWorkout,
    removeExerciseFromWorkout
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* EXERCISE INFO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{currentExercise?.exercise.icon || '🏋️'}</span>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active Exercise</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            {currentExercise?.exercise.name}
          </h2>
          <p className="text-slate-500 mt-1 capitalize">
            Focusing on {currentExercise?.exercise.muscleGroups.join(', ')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={previousExercise} disabled={activeExerciseIndex === 0}>
            <ChevronLeft size={20} />
          </Button>
          <div className="h-10 px-4 bg-slate-100 rounded-lg flex items-center justify-center font-semibold text-sm dark:bg-slate-800">
            Exercise {activeExerciseIndex + 1} / {currentWorkout.exercises.length}
          </div>
          <Button variant="outline" size="icon" onClick={nextExercise} disabled={activeExerciseIndex === currentWorkout.exercises.length - 1}>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DATA ENTRY */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeExerciseIndex}-${activeSetIndex}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Set {activeSetIndex + 1}</h3>
                  <div className="flex gap-1">
                    {currentExercise.sets.map((_, i) => (
                      <div key={i} className={`h-1.5 w-6 rounded-full ${i === activeSetIndex ? 'bg-primary' : i < activeSetIndex ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Reps"
                    type="number"
                    placeholder="0"
                    value={reps}
                    onChange={e => setReps(e.target.value)}
                    autoFocus
                    className="text-center text-2xl h-16"
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    placeholder="0"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="text-center text-2xl h-16"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!reps || currentSet?.completed}
                  onClick={handleCompleteSet}
                  className="h-16 text-lg font-bold rounded-xl"
                >
                  {currentSet?.completed ? 'Set Logged ✓' : 'Complete Set'}
                </Button>
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>

        {/* STATS AREA */}
        <div className="space-y-4">
          <Card title="Progress" className="text-center">
            <div className="flex justify-center py-4">
              <ProgressRing progress={progress} size={150} strokeWidth={10} color="hsl(var(--primary))">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">{completedSets}</span>
                  <span className="text-xs text-slate-500 font-medium">of {totalSets} sets</span>
                </div>
              </ProgressRing>
            </div>
          </Card>

          <Card title="Rest Timer">
            <Timer />
          </Card>
        </div>
      </div>

      <div className="pt-8 border-t flex flex-col md:flex-row gap-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={finishWorkout}
          className="md:order-2 h-16 text-xl shadow-xl shadow-primary/20"
        >
          Finish Workout Session
        </Button>
        <Button
          variant="ghost"
          onClick={() => { }}
          className="md:order-1 h-16 text-slate-400 hover:text-red-500"
        >
          Discard Session
        </Button>
      </div>
    </div>
  );
};

export default ActiveWorkout;