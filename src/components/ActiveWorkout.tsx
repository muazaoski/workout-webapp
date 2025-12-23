import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import Timer from './Timer';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import ProgressRing from './ui/ProgressRing';
import { ChevronLeft, ChevronRight, Check, Zap, Target, History } from 'lucide-react';

const ActiveWorkout: React.FC = () => {
  const {
    currentWorkout,
    activeExerciseIndex,
    activeSetIndex,
    updateSet,
    nextExercise,
    previousExercise,
    finishWorkout,
  } = useWorkoutStore();

  const [setReps, setSetReps] = useState('');
  const [setWeight, setSetWeight] = useState('');

  if (!currentWorkout) return null;

  const currentExercise = currentWorkout.exercises[activeExerciseIndex];
  const currentSet = currentExercise?.sets[activeSetIndex];

  const handleCompleteSet = () => {
    if (currentExercise && currentSet && setReps) {
      updateSet(activeExerciseIndex, activeSetIndex, {
        reps: parseInt(setReps) || 0,
        weight: parseFloat(setWeight) || 0,
        completed: true,
      });

      if (activeSetIndex < currentExercise.sets.length - 1) {
        setSetReps('');
        setSetWeight('');
      } else {
        if (activeExerciseIndex < currentWorkout.exercises.length - 1) {
          nextExercise();
          setSetReps('');
          setSetWeight('');
        }
      }
    }
  };

  const completedSets = currentExercise?.sets.filter(set => set.completed).length || 0;
  const totalSets = currentExercise?.sets.length || 0;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-20">
      {/* EXERCISE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-brand-white/10 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{currentExercise?.exercise.icon || '🏋️'}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow">CURRENT_EXERCISE</span>
          </div>
          <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
            {currentExercise?.exercise.name || 'NO_NAME_LOADED'}
          </h2>
          <p className="text-xs font-bold text-brand-white/40 mt-4 uppercase tracking-widest leading-none">
            {currentExercise?.exercise.muscleGroups.join(' // ') || 'GENERAL'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={previousExercise} disabled={activeExerciseIndex === 0}>
            <ChevronLeft size={16} />
          </Button>
          <div className="bg-brand-white/5 px-4 flex items-center">
            <span className="text-xs font-black italic whitespace-nowrap tabular-nums">DATA_PKT_{activeExerciseIndex + 1}/{currentWorkout.exercises.length}</span>
          </div>
          <Button variant="outline" size="sm" onClick={nextExercise} disabled={activeExerciseIndex === currentWorkout.exercises.length - 1}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT CENTER */}
        <div className="lg:col-span-2 space-y-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeExerciseIndex}-${activeSetIndex}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4">
                <div className="px-6 py-2 bg-brand-yellow text-brand-black text-xl font-black italic">
                  SET_{activeSetIndex + 1}
                </div>
                <div className="h-0.5 flex-grow bg-brand-white/5" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <Input
                  label="REPETITIONS"
                  type="number"
                  placeholder="00"
                  value={setReps}
                  onChange={(e) => setSetReps(e.target.value)}
                  autoFocus
                  className="text-4xl h-auto py-4"
                />
                <Input
                  label="LOAD_WEIGHT (KG)"
                  type="number"
                  placeholder="0.0"
                  value={setWeight}
                  onChange={(e) => setSetWeight(e.target.value)}
                  className="text-4xl h-auto py-4"
                />
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleCompleteSet}
                disabled={!setReps || currentSet?.completed}
                className="py-6 text-xl"
              >
                {currentSet?.completed ? 'DATA_LOCKED' : 'COMMIT_SET'}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SIDEBAR METRICS */}
        <div className="space-y-6">
          <Card title="PROGRESS" subtitle="SET_VOLUME">
            <div className="flex flex-col items-center justify-center py-6">
              <ProgressRing progress={progress} size={140} strokeWidth={8} color="#FFFF00">
                <div className="text-center font-black">
                  <span className="text-4xl italic leading-none">{completedSets}</span>
                  <span className="text-sm opacity-20 mx-1">/</span>
                  <span className="text-xl opacity-40">{totalSets}</span>
                </div>
              </ProgressRing>
            </div>
          </Card>

          <Card title="RECOVERY" subtitle="REST_TIMER">
            <Timer />
          </Card>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-20 border-t-2 border-brand-white/10 flex flex-col md:flex-row gap-6">
        <Button
          variant="secondary"
          fullWidth
          className="md:order-2 border-none font-black text-2xl py-8 shadow-sharp"
          onClick={finishWorkout}
        >
          COMPLETE_MISSION_PHASE
        </Button>
        <Button
          variant="ghost"
          className="md:order-1 border-2 border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 py-8"
          onClick={() => { }}
        >
          ABORT_SESSION
        </Button>
      </div>
    </div>
  );
};

export default ActiveWorkout;