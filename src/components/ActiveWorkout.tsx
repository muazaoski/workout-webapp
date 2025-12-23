import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import Timer from './Timer';
import Button from './ui/Button';
import Input from './ui/Input';
import ProgressRing from './ui/ProgressRing';
import { Plus, X, ChevronLeft, ChevronRight, Check, Square, Zap, Activity } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* STATUS HEADER */}
      <div className="flex justify-between items-center border-b-4 border-punk-white pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-punk-yellow p-2 rotate-12">
            <Zap size={24} className="text-punk-black" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">IN_TRAINING</h2>
        </div>
        <Button variant="danger" size="sm" onClick={() => { }} className="bg-red-600">
          ABORT_SECX
        </Button>
      </div>

      {/* CORE DISPLAY */}
      <div className="punk-card bg-punk-yellow !text-punk-black border-punk-black shadow-white py-10 flex flex-col items-center justify-center text-center">
        <span className="text-8xl mb-2">{currentExercise?.exercise.icon || '🏋️'}</span>
        <h3 className="text-4xl font-black italic tracking-widest uppercase mb-2 leading-none">
          {currentExercise?.exercise.name || 'NO_EXR_SELECTED'}
        </h3>
        <p className="text-xs font-black uppercase opacity-60 tracking-[4px]">
          {currentExercise?.exercise.muscleGroups.join(' + ') || ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PROGRESS BLOCK */}
        <div className="punk-card flex flex-col items-center justify-center bg-punk-dark hover:border-punk-yellow transition-colors group">
          <div className="text-[10px] font-mono text-punk-yellow mb-4 tracking-widest uppercase">VOLUME_COMPLETION</div>
          <ProgressRing progress={progress} size={120} strokeWidth={12} color="#FFFF00">
            <div className="text-center">
              <div className="text-3xl font-black italic group-hover:scale-110 transition-transform">
                {completedSets}<span className="text-sm opacity-40">/</span>{totalSets}
              </div>
              <div className="text-[8px] opacity-40 font-black">SETS</div>
            </div>
          </ProgressRing>
          <div className="flex gap-4 mt-6">
            <Button variant="ghost" size="sm" onClick={previousExercise} disabled={activeExerciseIndex === 0} className="border-punk-white/10">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="ghost" size="sm" onClick={nextExercise} disabled={activeExerciseIndex === currentWorkout.exercises.length - 1} className="border-punk-white/10">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* TIMER BLOCK */}
        <div className="punk-card flex flex-col items-center justify-center bg-punk-dark border-dashed border-punk-white/20">
          <div className="text-[10px] font-mono text-punk-yellow mb-2 tracking-widest uppercase">REST_CHRONO</div>
          <Timer />
        </div>

        {/* DATA BLOCK */}
        <div className="punk-card flex flex-col items-center justify-center bg-punk-dark border-punk-yellow/30">
          <div className="text-[10px] font-mono text-punk-yellow mb-4 tracking-widest uppercase">TOTAL_IMPACT</div>
          <div className="text-center space-y-4 w-full">
            <div className="border-b-2 border-punk-white/5 pb-2">
              <div className="text-3xl font-black italic">{currentWorkout.exercises.length}</div>
              <div className="text-[8px] opacity-40 uppercase font-black">EXERCISES_TOTAL</div>
            </div>
            <div>
              <Activity size={32} className="mx-auto text-punk-yellow/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* INPUT PANEL: RAW MECHANICAL */}
      <AnimatePresence mode="wait">
        {currentExercise && (
          <motion.div
            key={activeSetIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-punk-white text-punk-black px-4 py-1 text-2xl font-black italic skew-x-[-12deg]">
                SET_{activeSetIndex + 1}
              </div>
              <div className="h-1 flex-grow bg-punk-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="REPETITIONS"
                type="number"
                placeholder="00"
                value={setReps}
                onChange={(e) => setSetReps(e.target.value)}
                autoFocus
              />
              <Input
                label="LOAD_KG"
                type="number"
                placeholder="0.0"
                value={setWeight}
                onChange={(e) => setSetWeight(e.target.value)}
              />
            </div>

            <Button
              fullWidth
              variant="yellow"
              size="lg"
              onClick={handleCompleteSet}
              disabled={!setReps || currentSet?.completed}
            >
              {currentSet?.completed ? 'SET_LOCKED' : 'COMMIT_SET_DATA'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINISH BUTTON */}
      <div className="pt-10 border-t-4 border-punk-white/10">
        <Button
          fullWidth
          variant="primary"
          size="lg"
          onClick={finishWorkout}
          className="bg-punk-white text-punk-black font-black text-4xl py-6 italic shadow-yellow hover:scale-[1.02]"
        >
          FINALIZE_WORKOUT
        </Button>
      </div>
    </div>
  );
};

export default ActiveWorkout;