import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkoutStore } from './stores/workoutStore';
import { useAuthStore } from './stores/authStore';
import type { Workout } from './types/workout';
import Timer from './components/Timer';
import ExerciseLibrary from './components/ExerciseLibrary';
import ActiveWorkout from './components/ActiveWorkout';
import AchievementModal from './components/AchievementModal';
import LevelProgress from './components/LevelProgress';
import Achievements from './components/Achievements';
import ChallengeCreator from './components/ChallengeCreator';
import AuthModal from './components/AuthModal';
import Button from './components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from './components/ui/Card';
import FireIcon from './components/FireIcon';
import { Dumbbell, TrendingUp, Clock, Plus, BookOpen, Trash2, Edit, X, ChevronUp, ChevronDown, Calendar, Trophy, Target, Star, LogOut, User } from 'lucide-react';

const App: React.FC = () => {
  const {
    currentWorkout,
    stats,
    startNewWorkout,
    workoutHistory,
    exercises,
    finishWorkout,
    cancelWorkout,
    addExerciseToWorkout,
    deleteWorkout,
    updateWorkout,
    userLevel,
    showAchievementModal,
    recentAchievement,
    hideAchievementModal
  } = useWorkoutStore();

  const { isAuthenticated, user, logout } = useAuthStore();

  const [currentView, setCurrentView] = useState<'home' | 'achievements' | 'challenges'>('home');
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showEditExerciseLibrary, setShowEditExerciseLibrary] = useState(false);

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-primary">
        <AuthModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setCurrentView('home');
                setShowExerciseLibrary(false);
                cancelWorkout();
              }}
              className="p-2 h-auto"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Dumbbell size={18} className="text-dark-primary" />
                </div>
                <h1 className="text-xl font-semibold text-white">Workout Counter</h1>
              </div>
            </Button>

            {/* Navigation */}
            {!currentWorkout && (
              <nav className="flex items-center space-x-2">
                <Button
                  variant={currentView === 'achievements' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('achievements')}
                  icon={<Trophy size={16} />}
                >
                  Achievements
                </Button>
                <Button
                  variant={currentView === 'challenges' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('challenges')}
                  icon={<Target size={16} />}
                >
                  Challenges
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut size={16} />}
                  className="text-gray-400 hover:text-red-400"
                >
                  Logout
                </Button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {showExerciseLibrary && !currentWorkout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ExerciseLibrary />
          </motion.div>
        )}

        {!currentWorkout && !showExerciseLibrary && currentView === 'home' && (
          // Home Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <div className="text-center py-8">
              <h2 className="text-3xl font-semibold text-white mb-4">
                Ready to start?
              </h2>
              <p className="text-gray-400 mb-8">
                Track your workouts and build consistency
              </p>

              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => setShowExerciseLibrary(true)}
                  size="lg"
                >
                  <span className="flex items-center space-x-2">
                    <BookOpen size={20} />
                    <span>Browse Exercises</span>
                  </span>
                </Button>
                <Button
                  onClick={() => startNewWorkout(`Workout ${stats.totalWorkouts + 1}`)}
                  size="lg"
                >
                  <span className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>Start Workout</span>
                  </span>
                </Button>
              </div>
            </div>

            {/* Level Progress */}
            <LevelProgress userLevel={userLevel} compact={true} />

            {/* Simple Stats */}
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">{stats.streak}</div>
                <div className="flex items-center justify-center space-x-1 text-gray-400">
                  <FireIcon streak={stats.streak} size={14} />
                  <span>Day Streak</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">{stats.totalWorkouts}</div>
                <div className="text-gray-400">Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">{stats.totalSets}</div>
                <div className="text-gray-400">Total Sets</div>
              </div>
            </div>

            {/* Quick Exercises */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Quick Start</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {exercises.slice(0, 6).map((exercise) => (
                  <Button
                    key={exercise.id}
                    variant="secondary"
                    onClick={() => {
                      startNewWorkout(`${exercise.name} Workout`);
                      addExerciseToWorkout(exercise);
                    }}
                    className="h-auto py-3 text-left justify-start"
                  >
                    <span className="text-xl mr-2">{exercise.icon}</span>
                    <span className="text-sm">{exercise.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recent Workouts */}
            {workoutHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Recent</h3>
                <div className="space-y-2">
                  {workoutHistory.slice(0, 3).map((workout) => (
                    <div
                      key={workout.id}
                      className="group flex items-center justify-between p-3 rounded-lg border border-gray-800/50 hover:border-white/30 transition-all duration-200"
                    >
                      <div>
                        <div className="font-medium text-white">{workout.name}</div>
                        <div className="text-sm text-gray-400 mb-2">
                          {workout.exercises.length} exercises
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {workout.exercises.slice(0, 3).map((we, index) => (
                            <span
                              key={`${we.exercise.id}-${index}`}
                              className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-xs text-white"
                            >
                              {we.exercise.name}
                            </span>
                          ))}
                          {workout.exercises.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-gray-700/30 rounded text-xs text-gray-400">
                              +{workout.exercises.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            {new Date(workout.endTime!).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(workout.endTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedWorkout(workout);
                            setShowEditModal(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-blue-600/20 text-blue-400 transition-all duration-200"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteWorkout(workout.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-600/20 text-red-400 transition-all duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Active Workout Screen */}
        {currentWorkout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Workout Header */}
            <div className="flex items-center justify-between py-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">{currentWorkout.name}</h2>
                <p className="text-sm text-gray-400">
                  {new Date(currentWorkout.startTime).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExerciseLibrary(!showExerciseLibrary)}
                  icon={<Plus size={16} />}
                >
                  Add
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => finishWorkout()}
                >
                  Finish
                </Button>
              </div>
            </div>

            {/* Exercise Library Overlay */}
            {showExerciseLibrary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-800/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Add Exercise</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExerciseLibrary(false)}
                  >
                    <Plus size={16} className="rotate-45" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {exercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => {
                        const store = useWorkoutStore.getState();
                        store.addExerciseToWorkout(exercise);
                        setShowExerciseLibrary(false);
                      }}
                      className="p-3 rounded-lg border border-gray-700 hover:border-white/50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{exercise.icon}</span>
                        <div>
                          <div className="font-medium text-white text-sm">{exercise.name}</div>
                          <div className="text-xs text-gray-400">
                            {exercise.muscleGroups.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Active Workout Component */}
            <ActiveWorkout />
          </motion.div>
        )}
      </main>

      {/* Edit Workout Modal */}
      {showEditModal && selectedWorkout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-secondary border border-gray-800/50 rounded-lg p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Edit Workout</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setShowEditExerciseLibrary(false);
                  setSelectedWorkout(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Workout Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Workout Name</label>
                <input
                  type="text"
                  value={selectedWorkout.name}
                  onChange={(e) => {
                    const updatedWorkout = { ...selectedWorkout, name: e.target.value };
                    setSelectedWorkout(updatedWorkout);
                  }}
                  className="minimal-input w-full"
                  placeholder="Workout name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={new Date(selectedWorkout.endTime || selectedWorkout.startTime).toISOString().slice(0, 16)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    const updatedWorkout = {
                      ...selectedWorkout,
                      startTime: newDate,
                      endTime: newDate
                    };
                    setSelectedWorkout(updatedWorkout);
                  }}
                  className="minimal-input w-full"
                />
              </div>
            </div>

            {/* Add Exercise Button */}
            <div className="mb-4">
              <Button
                onClick={() => setShowEditExerciseLibrary(!showEditExerciseLibrary)}
                className="w-full"
                variant="secondary"
                icon={<Plus size={16} />}
              >
                {showEditExerciseLibrary ? 'Hide' : 'Add'} Exercises
              </Button>
            </div>

            {/* Exercise Library for Edit Modal */}
            {showEditExerciseLibrary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-800/50 rounded-lg p-4 mb-6"
              >
                <h3 className="text-lg font-medium text-white mb-4">Add Exercises</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {exercises.map((exercise) => {
                    const isAlreadyAdded = selectedWorkout.exercises.some(we => we.exercise.id === exercise.id);
                    return (
                      <button
                        key={exercise.id}
                        onClick={() => {
                          if (!isAlreadyAdded) {
                            const updatedWorkout = {
                              ...selectedWorkout,
                              exercises: [
                                ...selectedWorkout.exercises,
                                {
                                  exercise,
                                  sets: [{ reps: 0, weight: 0, completed: false }]
                                }
                              ]
                            };
                            setSelectedWorkout(updatedWorkout);
                          }
                        }}
                        disabled={isAlreadyAdded}
                        className={`p-3 rounded-lg border transition-all duration-200 text-left ${isAlreadyAdded
                          ? 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed'
                          : 'border-gray-700 hover:border-white/50 cursor-pointer'
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{exercise.icon}</span>
                          <div>
                            <div className="font-medium text-white text-sm">{exercise.name}</div>
                            <div className="text-xs text-gray-400">
                              {exercise.muscleGroups.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Exercises Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Exercises</h3>

              {selectedWorkout.exercises.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border border-gray-800/50 rounded-lg">
                  <p>No exercises in this workout</p>
                </div>
              ) : (
                selectedWorkout.exercises.map((workoutExercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="border border-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{workoutExercise.exercise.icon}</span>
                        <h3 className="font-medium text-white">{workoutExercise.exercise.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Reorder buttons */}
                        <button
                          onClick={() => {
                            if (exerciseIndex > 0) {
                              const updatedWorkout = { ...selectedWorkout };
                              const newExercises = [...updatedWorkout.exercises];
                              [newExercises[exerciseIndex], newExercises[exerciseIndex - 1]] =
                                [newExercises[exerciseIndex - 1], newExercises[exerciseIndex]];
                              updatedWorkout.exercises = newExercises;
                              setSelectedWorkout(updatedWorkout);
                            }
                          }}
                          disabled={exerciseIndex === 0}
                          className="p-1 rounded hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (exerciseIndex < selectedWorkout.exercises.length - 1) {
                              const updatedWorkout = { ...selectedWorkout };
                              const newExercises = [...updatedWorkout.exercises];
                              [newExercises[exerciseIndex], newExercises[exerciseIndex + 1]] =
                                [newExercises[exerciseIndex + 1], newExercises[exerciseIndex]];
                              updatedWorkout.exercises = newExercises;
                              setSelectedWorkout(updatedWorkout);
                            }
                          }}
                          disabled={exerciseIndex === selectedWorkout.exercises.length - 1}
                          className="p-1 rounded hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const updatedWorkout = {
                              ...selectedWorkout,
                              exercises: selectedWorkout.exercises.filter((_, index) => index !== exerciseIndex)
                            };
                            setSelectedWorkout(updatedWorkout);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {workoutExercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center space-x-2">
                          <span className="text-gray-400 text-sm w-8">Set {setIndex + 1}</span>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => {
                              const updatedWorkout = { ...selectedWorkout };
                              updatedWorkout.exercises[exerciseIndex].sets[setIndex].reps = parseInt(e.target.value) || 0;
                              setSelectedWorkout(updatedWorkout);
                            }}
                            className="minimal-input w-20 text-center"
                            min="0"
                            max="999"
                          />
                          <span className="text-gray-400 text-sm">reps</span>
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => {
                              const updatedWorkout = { ...selectedWorkout };
                              updatedWorkout.exercises[exerciseIndex].sets[setIndex].weight = parseFloat(e.target.value) || 0;
                              setSelectedWorkout(updatedWorkout);
                            }}
                            className="minimal-input w-24 text-center"
                            min="0"
                            max="999"
                            step="0.5"
                          />
                          <span className="text-gray-400 text-sm">kg</span>
                          <input
                            type="checkbox"
                            checked={set.completed}
                            onChange={(e) => {
                              const updatedWorkout = { ...selectedWorkout };
                              updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed = e.target.checked;
                              setSelectedWorkout(updatedWorkout);
                            }}
                            className="w-4 h-4 text-white bg-gray-700 border-gray-600 rounded focus:ring-white"
                          />
                          <span className="text-gray-400 text-sm">completed</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => {
                          const updatedWorkout = { ...selectedWorkout };
                          updatedWorkout.exercises[exerciseIndex].sets.push({
                            reps: 0,
                            weight: 0,
                            completed: false
                          });
                          setSelectedWorkout(updatedWorkout);
                        }}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded text-xs text-white hover:bg-white/20 transition-colors"
                      >
                        + Add Set
                      </button>
                      {workoutExercise.sets.length > 1 && (
                        <button
                          onClick={() => {
                            const updatedWorkout = { ...selectedWorkout };
                            updatedWorkout.exercises[exerciseIndex].sets.pop();
                            setSelectedWorkout(updatedWorkout);
                          }}
                          className="px-3 py-1 bg-red-600/20 border border-red-600/50 rounded text-xs text-red-400 hover:bg-red-600/30 transition-colors"
                        >
                          - Remove Set
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowEditModal(false);
                  setShowEditExerciseLibrary(false);
                  setSelectedWorkout(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedWorkout) {
                    updateWorkout(selectedWorkout.id, selectedWorkout);
                    setShowEditModal(false);
                    setShowEditExerciseLibrary(false);
                    setSelectedWorkout(null);
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Achievements View */}
      {!currentWorkout && currentView === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Achievements />
        </motion.div>
      )}

      {/* Challenges View */}
      {!currentWorkout && currentView === 'challenges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ChallengeCreator />
        </motion.div>
      )}

      {/* Achievement Modal */}
      <AchievementModal
        achievement={recentAchievement}
        isVisible={showAchievementModal}
        onClose={hideAchievementModal}
      />
    </div>
  );
};

export default App;