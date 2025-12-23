import React from 'react';
import { motion } from 'framer-motion';
import { useWorkoutStore } from './stores/workoutStore';
import Timer from './components/Timer';
import Button from './components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { Dumbbell, TrendingUp, Clock, Plus } from 'lucide-react';

const App: React.FC = () => {
  const { currentWorkout, stats, startNewWorkout, workoutHistory } = useWorkoutStore();

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      {/* Header */}
      <header className="glass-card border-0 border-b border-gray-800/50 rounded-none m-0 mb-8">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Dumbbell size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold neon-text">Workout Counter</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {/* Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={16} className="text-neon-blue" />
                  <span className="text-gray-400">Streak: {stats.streak}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-neon-purple" />
                  <span className="text-gray-400">{stats.totalWorkouts} workouts</span>
                </div>
              </div>

              {!currentWorkout && (
                <Button onClick={() => startNewWorkout(`Workout ${stats.totalWorkouts + 1}`)}>
                  <Plus size={20} />
                  New Workout
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-12">
        {!currentWorkout ? (
          // Home Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <div className="text-center py-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold mb-4 neon-text"
              >
                Ready to crush your workout?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto"
              >
                Track your exercises, monitor your progress, and build consistency with our minimalist workout counter.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <Button
                  size="lg"
                  onClick={() => startNewWorkout(`Workout ${stats.totalWorkouts + 1}`)}
                >
                  <Plus size={24} />
                  Start New Workout
                </Button>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card glow>
                  <CardHeader>
                    <CardTitle className="text-neon-blue">{stats.streak}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Day Streak</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card glow>
                  <CardHeader>
                    <CardTitle className="text-neon-purple">{stats.totalWorkouts}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Total Workouts</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card glow>
                  <CardHeader>
                    <CardTitle className="text-neon-green">{stats.totalSets}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Total Sets</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card glow>
                  <CardHeader>
                    <CardTitle className="text-orange-400">{stats.totalReps}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Total Reps</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Workouts */}
            {workoutHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Workouts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workoutHistory.slice(0, 5).map((workout, index) => (
                        <motion.div
                          key={workout.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-dark-tertiary/30 border border-gray-800/50"
                        >
                          <div>
                            <h4 className="font-medium text-white">{workout.name}</h4>
                            <p className="text-sm text-gray-400">
                              {workout.exercises.length} exercises • {workout.duration}min
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              {new Date(workout.endTime!).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Active Workout Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{currentWorkout.name}</h2>
              <p className="text-gray-400">
                Started at {new Date(currentWorkout.startTime).toLocaleTimeString()}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Timer Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Timer</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timer />
                </CardContent>
              </Card>

              {/* Current Exercise */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Exercise</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  {currentWorkout.exercises.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-6xl mb-4">
                        {currentWorkout.exercises[0].exercise.icon || '🏋️'}
                      </div>
                      <h3 className="text-xl font-semibold">
                        {currentWorkout.exercises[0].exercise.name}
                      </h3>
                      <p className="text-gray-400">
                        {currentWorkout.exercises[0].sets.length} sets
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-6xl mb-4 opacity-50">➕</div>
                      <h3 className="text-xl font-semibold text-gray-400">
                        No exercises added yet
                      </h3>
                      <p className="text-gray-500">
                        Add your first exercise to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default App;