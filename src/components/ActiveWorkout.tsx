import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import Timer from './Timer';
import Button from './ui/Button';
import Card from './ui/Card';
import ProgressRing from './ui/ProgressRing';
import {
  ChevronLeft, ChevronRight, Zap, Activity, Dumbbell, X, Plus,
  Search, Check, Minus, Play, Clock
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
    stats,
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

  // Filter exercises for picker
  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding an exercise
  const handleAddExercise = (exercise: Exercise) => {
    addExerciseToWorkout(exercise);
    setShowExercisePicker(false);
    setSearchTerm('');
  };

  // No exercises state - show exercise picker directly
  if (!currentExercise) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8 fade-in">
        <div className="text-center mb-8">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Dumbbell size={40} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Let's Build Your Workout</h2>
          <p className="text-muted-foreground mt-2">Select exercises to begin your session</p>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises..."
            className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 transition-all"
            autoFocus
          />
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pb-4">
          {filteredExercises.slice(0, 20).map(ex => (
            <button
              key={ex.id}
              onClick={() => handleAddExercise(ex)}
              className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all text-left group"
            >
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors flex-shrink-0">
                {ex.icon || '🏋️'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold truncate group-hover:text-primary transition-colors">{ex.name}</p>
                <p className="text-xs text-muted-foreground truncate">{ex.muscleGroups.join(', ')}</p>
              </div>
              <Plus size={20} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/5">
          <Button
            variant="danger"
            onClick={cancelWorkout}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Has exercises - show workout tracker
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
      } else {
        if (activeExerciseIndex < currentWorkout.exercises.length - 1) {
          nextExercise();
          setReps('');
          setWeight('');
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 fade-in">
      {/* COMPACT HEADER */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl flex-shrink-0">
            {currentExercise.exercise.icon || '🏋️'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live</span>
            </div>
            <h2 className="text-xl font-bold truncate">{currentExercise.exercise.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExercisePicker(true)}
            className="h-10 px-3 rounded-xl text-xs bg-white/5"
          >
            <Plus size={16} className="mr-1" /> Add
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => useWorkoutStore.getState().toggleMinimize(true)}
            className="rounded-xl h-10 w-10"
          >
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* EXERCISE TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {currentWorkout.exercises.map((we, idx) => (
          <button
            key={we.exercise.id}
            onClick={() => {
              useWorkoutStore.setState({ activeExerciseIndex: idx, activeSetIndex: 0 });
              setReps('');
              setWeight('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${idx === activeExerciseIndex
              ? 'bg-primary text-black'
              : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
          >
            <span className="text-lg">{we.exercise.icon || '🏋️'}</span>
            <span className="hidden sm:inline max-w-[100px] truncate">{we.exercise.name}</span>
            {we.sets?.filter(s => s.completed).length === we.sets?.length && we.sets?.length > 0 && (
              <Check size={14} />
            )}
          </button>
        ))}
      </div>

      {/* MAIN WORKOUT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SET INPUT */}
        <div className="lg:col-span-2">
          <Card className="!p-6 border-primary/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeExerciseIndex}-${activeSetIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Set Indicator */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Set {activeSetIndex + 1} of {totalSets}</h3>
                  <div className="flex gap-1">
                    {currentExercise.sets?.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          useWorkoutStore.setState({ activeSetIndex: i });
                          setReps('');
                          setWeight('');
                        }}
                        className={`h-3 w-8 rounded-full transition-all ${i === activeSetIndex
                          ? 'bg-primary w-10'
                          : s.completed
                            ? 'bg-primary/50'
                            : 'bg-white/10'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reps</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReps(String(Math.max(0, (parseInt(reps) || 0) - 1)))}
                        className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <input
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        placeholder="0"
                        className="flex-1 h-14 text-center text-3xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50"
                      />
                      <button
                        onClick={() => setReps(String((parseInt(reps) || 0) + 1))}
                        className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Weight ({weightUnit})</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setWeight(String(Math.max(0, (parseFloat(weight) || 0) - 2.5)))}
                        className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <input
                        type="number"
                        step="0.5"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="0"
                        className="flex-1 h-14 text-center text-3xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50"
                      />
                      <button
                        onClick={() => setWeight(String((parseFloat(weight) || 0) + 2.5))}
                        className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Complete Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!reps || (currentSet && currentSet.completed)}
                  onClick={handleCompleteSet}
                  className="h-16 text-xl font-bold rounded-2xl"
                >
                  {currentSet?.completed ? (
                    <><Check size={24} className="mr-2" /> Set Complete</>
                  ) : (
                    <><Play size={24} className="mr-2" /> Log Set</>
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Card className="!p-4 text-center">
              <Activity size={20} className="text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{stats.totalReps + (parseInt(reps) || 0)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Reps</p>
            </Card>
            <Card className="!p-4 text-center">
              <Zap size={20} className="text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{(parseFloat(weight) || 0).toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{weightUnit}</p>
            </Card>
            <Card className="!p-4 text-center">
              <Clock size={20} className="text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{currentWorkout.exercises.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase">Exercises</p>
            </Card>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="space-y-4">
          <Card className="text-center">
            <div className="flex justify-center py-4">
              <ProgressRing progress={progress} size={140} strokeWidth={10} color="#facc15">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black">{completedSets}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">of {totalSets}</span>
                </div>
              </ProgressRing>
            </div>
          </Card>

          <Card title="Rest Timer">
            <Timer />
          </Card>

          {/* Exercise info */}
          <Card className="!p-4">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Current Exercise</p>
            <p className="font-bold">{currentExercise.exercise.name}</p>
            <p className="text-sm text-muted-foreground">{currentExercise.exercise.muscleGroups.join(', ')}</p>
          </Card>
        </div>
      </div>

      {/* EXERCISE NAVIGATION (Mobile friendly) */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5 sm:hidden">
        <Button
          variant="ghost"
          onClick={previousExercise}
          disabled={activeExerciseIndex === 0}
          className="flex-1"
        >
          <ChevronLeft size={20} className="mr-1" /> Previous
        </Button>
        <span className="text-sm font-bold text-muted-foreground">
          {activeExerciseIndex + 1} / {currentWorkout.exercises.length}
        </span>
        <Button
          variant="ghost"
          onClick={nextExercise}
          disabled={activeExerciseIndex >= currentWorkout.exercises.length - 1}
          className="flex-1"
        >
          Next <ChevronRight size={20} className="ml-1" />
        </Button>
      </div>

      {/* FINISH WORKOUT */}
      <div className="flex gap-3 pt-6">
        <Button
          variant="danger"
          onClick={cancelWorkout}
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none px-6"
        >
          Discard
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={finishWorkout}
          className="h-14 text-lg font-bold rounded-2xl"
        >
          Finish Workout
        </Button>
      </div>

      {/* EXERCISE PICKER MODAL */}
      <AnimatePresence>
        {showExercisePicker && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
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
              className="relative w-full max-w-lg bg-card border border-card-border rounded-t-3xl sm:rounded-3xl p-6 max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Add Exercise</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowExercisePicker(false)} className="rounded-full">
                  <X size={20} />
                </Button>
              </div>

              <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-12 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {filteredExercises.slice(0, 15).map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => handleAddExercise(ex)}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left"
                  >
                    <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                      {ex.icon || '🏋️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{ex.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{ex.muscleGroups.join(', ')}</p>
                    </div>
                    <Plus size={18} className="text-primary" />
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