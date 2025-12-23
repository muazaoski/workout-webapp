import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import Timer from './Timer';
import Button from './ui/Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import Input from './ui/Input';
import ProgressRing from './ui/ProgressRing';
import { Plus, X, ChevronLeft, ChevronRight, Check, Square } from 'lucide-react';

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

      // Move to next set or exercise
      if (activeSetIndex < currentExercise.sets.length - 1) {
        setSetReps('');
        setSetWeight('');
      } else {
        // Move to next exercise
        if (activeExerciseIndex < currentWorkout.exercises.length - 1) {
          nextExercise();
          setSetReps('');
          setSetWeight('');
        }
      }
    }
  };

  const handleAddSet = () => {
    if (currentExercise) {
      updateSet(activeExerciseIndex, currentExercise.sets.length, {
        reps: 0,
        weight: 0,
        completed: false,
      });
    }
  };

  const completedSets = currentExercise?.sets.filter(set => set.completed).length || 0;
  const totalSets = currentExercise?.sets.length || 0;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Current Exercise */}
      <div className="text-center py-6">
        <div className="text-5xl mb-3">
          {currentExercise?.exercise.icon || '🏋️'}
        </div>
        <h2 className="text-2xl font-semibold text-white mb-1">
          {currentExercise?.exercise.name || 'No exercise selected'}
        </h2>
        <p className="text-gray-400 text-sm">
          {currentExercise?.exercise.muscleGroups.join(', ') || ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Exercise Progress */}
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Progress</div>
          <ProgressRing progress={progress} size={80}>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {completedSets}/{totalSets}
              </div>
            </div>
          </ProgressRing>
          <div className="flex justify-center space-x-1 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousExercise}
              disabled={activeExerciseIndex === 0}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextExercise}
              disabled={activeExerciseIndex === currentWorkout.exercises.length - 1}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Timer</div>
          <div className="scale-75 origin-center">
            <Timer />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Workout</div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-white">
              {currentWorkout.exercises.length}
            </div>
            <div className="text-xs text-gray-400">Exercises</div>
          </div>
        </div>
      </div>

      {/* Current Set */}
      {currentExercise && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Set {activeSetIndex + 1}</h3>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddSet}
              >
                <Plus size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExerciseFromWorkout(currentExercise.exercise.id)}
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Reps"
              value={setReps}
              onChange={(e) => setSetReps(e.target.value)}
              min="0"
            />
            <Input
              type="number"
              placeholder="Weight"
              value={setWeight}
              onChange={(e) => setSetWeight(e.target.value)}
              min="0"
              step="0.5"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleCompleteSet}
            disabled={!setReps || currentSet?.completed}
          >
            {currentSet?.completed ? (
              <>
                <Check size={16} />
                Completed
              </>
            ) : (
              <>
                <Square size={16} />
                Complete Set
              </>
            )}
          </Button>
        </div>
      )}

      {/* Sets History */}
      {currentExercise && currentExercise.sets.length > 1 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Previous Sets</h3>
          <div className="space-y-1">
            {currentExercise.sets.map((set, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded border text-sm ${index === activeSetIndex
                    ? 'border-white bg-white/10'
                    : 'border-gray-700'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-white">Set {index + 1}</span>
                  {set.completed && (
                    <Check size={12} className="text-green-400" />
                  )}
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <span>{set.reps} reps</span>
                  {(set.weight ?? 0) > 0 && (
                    <span>{set.weight} lbs</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Navigation */}
      {currentWorkout.exercises.length > 1 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Exercises</h3>
          <div className="space-y-1">
            {currentWorkout.exercises.map((we, index) => {
              const completedSets = we.sets.filter(set => set.completed).length;
              const totalSets = we.sets.length;
              return (
                <div
                  key={we.exercise.id}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer text-sm ${index === activeExerciseIndex
                      ? 'border-white bg-white/10'
                      : 'border-gray-700'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{we.exercise.icon}</span>
                    <span className="text-white">{we.exercise.name}</span>
                  </div>
                  <span className="text-gray-400">
                    {completedSets}/{totalSets} sets
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveWorkout;