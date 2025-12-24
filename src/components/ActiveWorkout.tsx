import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import Timer from './Timer';
import Button from './ui/Button';
import Card from './ui/Card';
import ProgressRing from './ui/ProgressRing';
import {
  ChevronLeft, ChevronRight, Dumbbell, X, Plus,
  Search, Check, Play
} from 'lucide-react';
import type { Exercise } from '../types/workout';

interface ActiveWorkoutProps {
  onOpenLibrary?: () => void;
}

const ActiveWorkout: React.FC<ActiveWorkoutProps> = () => {
  const {
    currentWorkout,
    activeExerciseIndex,
    activeSetIndex,
    updateSet,
    nextExercise,
    previousExercise,
    finishWorkout,
    cancelWorkout,
    exercises,
    addExerciseToWorkout,
    settings
  } = useWorkoutStore();

  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!currentWorkout) return null;

  const currentExercise = currentWorkout.exercises[activeExerciseIndex];
  const weightUnit = settings?.weightUnit || 'kg';

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExercise = (exercise: Exercise) => {
    addExerciseToWorkout(exercise);
    setShowExercisePicker(false);
    setSearchTerm('');
  };

  // No exercises - show picker
  if (!currentExercise) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-8 fade-in">
        <div className="text-center mb-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Dumbbell size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Build Your Workout</h2>
          <p className="text-muted-foreground mt-1 text-sm">Select exercises to begin</p>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises..."
            className="w-full h-12 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50"
            autoFocus
          />
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {filteredExercises.slice(0, 20).map(ex => (
            <button
              key={ex.id}
              onClick={() => handleAddExercise(ex)}
              className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                {ex.icon || '🏋️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{ex.name}</p>
                <p className="text-xs text-muted-foreground truncate">{ex.muscleGroups.join(', ')}</p>
              </div>
              <Plus size={18} className="text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>

        <Button variant="danger" onClick={cancelWorkout} className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none">
          Cancel Workout
        </Button>
      </div>
    );
  }

  // Active workout UI
  const currentSet = currentExercise.sets?.[activeSetIndex];
  const completedSets = currentExercise.sets?.filter(s => s.completed).length || 0;
  const totalSets = currentExercise.sets?.length || 0;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const handleCompleteSet = () => {
    if (currentExercise && currentSet && reps) {
      updateSet(activeExerciseIndex, activeSetIndex, {
        reps: parseInt(reps) || 0,
        weight: parseFloat(weight) || 0,
        completed: true,
      });

      if (activeSetIndex < (currentExercise.sets?.length || 0) - 1) {
        setReps('');
        setWeight('');
      } else if (activeExerciseIndex < currentWorkout.exercises.length - 1) {
        nextExercise();
        setReps('');
        setWeight('');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-24 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
            {currentExercise.exercise.icon || '🏋️'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live</span>
            </div>
            <h2 className="font-bold truncate">{currentExercise.exercise.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setShowExercisePicker(true)} className="h-9 px-3 rounded-lg text-xs bg-white/5">
            <Plus size={14} className="mr-1" /> Add
          </Button>
          <Button variant="ghost" size="icon" onClick={() => useWorkoutStore.getState().toggleMinimize(true)} className="h-9 w-9 rounded-lg">
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Exercise Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {currentWorkout.exercises.map((we, idx) => (
          <button
            key={idx}
            onClick={() => {
              useWorkoutStore.setState({ activeExerciseIndex: idx, activeSetIndex: 0 });
              setReps('');
              setWeight('');
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all flex-shrink-0 ${idx === activeExerciseIndex
                ? 'bg-primary text-black'
                : 'bg-white/5 text-muted-foreground'
              }`}
          >
            <span>{we.exercise.icon || '🏋️'}</span>
            {we.sets?.filter(s => s.completed).length === we.sets?.length && we.sets?.length > 0 && (
              <Check size={12} />
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Set Input Card */}
        <div className="md:col-span-2">
          <Card className="!p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeExerciseIndex}-${activeSetIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Set Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Set {activeSetIndex + 1} of {totalSets}</h3>
                  <div className="flex gap-1">
                    {currentExercise.sets?.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          useWorkoutStore.setState({ activeSetIndex: i });
                          setReps('');
                          setWeight('');
                        }}
                        className={`h-2 w-6 rounded-full transition-all ${i === activeSetIndex ? 'bg-primary w-8' : s.completed ? 'bg-primary/50' : 'bg-white/10'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Reps</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      placeholder="0"
                      className="w-full h-16 text-center text-4xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Weight ({weightUnit})</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="0"
                      className="w-full h-16 text-center text-4xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                {/* Complete Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!reps || (currentSet && currentSet.completed)}
                  onClick={handleCompleteSet}
                  className="h-14 text-lg font-bold rounded-xl"
                >
                  {currentSet?.completed ? (
                    <><Check size={20} className="mr-2" /> Done</>
                  ) : (
                    <><Play size={20} className="mr-2" /> Log Set</>
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Card className="!p-4 text-center">
            <ProgressRing progress={progress} size={100} strokeWidth={8} color="#facc15">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black">{completedSets}</span>
                <span className="text-[10px] text-muted-foreground">of {totalSets}</span>
              </div>
            </ProgressRing>
          </Card>
          <Card className="!p-3">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Rest Timer</p>
            <Timer />
          </Card>
        </div>
      </div>

      {/* Navigation (mobile) */}
      <div className="flex items-center justify-between gap-3 md:hidden">
        <Button variant="ghost" onClick={previousExercise} disabled={activeExerciseIndex === 0} className="flex-1">
          <ChevronLeft size={18} /> Prev
        </Button>
        <span className="text-sm text-muted-foreground">{activeExerciseIndex + 1}/{currentWorkout.exercises.length}</span>
        <Button variant="ghost" onClick={nextExercise} disabled={activeExerciseIndex >= currentWorkout.exercises.length - 1} className="flex-1">
          Next <ChevronRight size={18} />
        </Button>
      </div>

      {/* Finish Actions */}
      <div className="flex gap-3">
        <Button variant="danger" onClick={cancelWorkout} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none px-5">
          Discard
        </Button>
        <Button variant="primary" size="lg" fullWidth onClick={finishWorkout} className="h-12 font-bold rounded-xl">
          Finish Workout
        </Button>
      </div>

      {/* Exercise Picker Modal */}
      <AnimatePresence>
        {showExercisePicker && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowExercisePicker(false)}
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-md bg-card border border-card-border rounded-t-3xl sm:rounded-3xl p-5 max-h-[70vh] overflow-hidden mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Add Exercise</h3>
                <button onClick={() => setShowExercisePicker(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary/50 text-sm"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-[45vh] overflow-y-auto">
                {filteredExercises.slice(0, 12).map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => handleAddExercise(ex)}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-left"
                  >
                    <span className="text-lg">{ex.icon || '🏋️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{ex.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{ex.muscleGroups.join(', ')}</p>
                    </div>
                    <Plus size={16} className="text-primary flex-shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveWorkout;