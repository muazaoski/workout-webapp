import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Workout, Exercise, WorkoutStats, TimerState, Achievement, Challenge } from '../types/workout';

export interface UserLevel {
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNext: number;
  title: string;
}

interface WorkoutStore {
  // Current workout session
  currentWorkout: Workout | null;
  activeExerciseIndex: number;
  activeSetIndex: number;

  // Timer state
  timer: TimerState;

  // Workout history
  workoutHistory: Workout[];

  // Exercises library
  exercises: Exercise[];

  // Stats
  stats: WorkoutStats;

  // Achievement System State
  achievements: Achievement[];
  userLevel: UserLevel;
  challenges: Challenge[];
  unlockedAchievements: string[];
  showAchievementModal: boolean;
  recentAchievement: Achievement | null;

  // Actions
  startNewWorkout: (name: string) => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  updateSet: (exerciseIndex: number, setIndex: number, updates: Partial<{ reps: number; weight: number; completed: boolean }>) => void;
  nextExercise: () => void;
  previousExercise: () => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;

  // Timer actions
  startTimer: (duration: number, type: TimerState['type']) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  updateTimer: () => void;

  // Exercise library actions
  addExercise: (exercise: Exercise) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;

  // Data persistence
  loadWorkouts: () => void;
  exportData: () => string;
  importData: (data: string) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;

  // Achievement system actions
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;
  addXP: (amount: number) => void;
  calculateLevel: () => void;
  addChallenge: (challenge: Challenge) => void;
  toggleChallenge: (challengeId: string) => void;
  deleteChallenge: (challengeId: string) => void;
  checkInChallenge: (challengeId: string) => void;
  hideAchievementModal: () => void;
}

const defaultTimer: TimerState = {
  isRunning: false,
  timeLeft: 0,
  duration: 0,
  type: 'work',
};

const defaultStats: WorkoutStats = {
  totalWorkouts: 0,
  totalExercises: 0,
  totalSets: 0,
  totalReps: 0,
  totalVolume: 0,
  totalWeight: 0,
  streak: 0,
  favoriteExercises: [],
  weakMuscleGroups: [],
};

const defaultUserLevel: UserLevel = {
  level: 1,
  currentXP: 0,
  totalXP: 0,
  xpToNext: 100,
  title: 'Novice',
};

const defaultAchievements: Achievement[] = [
  {
    id: 'first_workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    icon: '🎯',
    unlocked: false,
    xpReward: 50,
    category: 'workout',
    requirement: { type: 'totalWorkouts', value: 1 },
  },
  {
    id: 'workout_10',
    name: 'Getting Started',
    description: 'Complete 10 workouts',
    icon: '💪',
    unlocked: false,
    xpReward: 100,
    category: 'consistency',
    requirement: { type: 'totalWorkouts', value: 10 },
  },
  {
    id: 'workout_50',
    name: 'Fitness Enthusiast',
    description: 'Complete 50 workouts',
    icon: '🏆',
    unlocked: false,
    xpReward: 250,
    category: 'consistency',
    requirement: { type: 'totalWorkouts', value: 50 },
  },
  {
    id: 'workout_100',
    name: 'Workout Warrior',
    description: 'Complete 100 workouts',
    icon: '👑',
    unlocked: false,
    xpReward: 500,
    category: 'consistency',
    requirement: { type: 'totalWorkouts', value: 100 },
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🔥',
    unlocked: false,
    xpReward: 150,
    category: 'streak',
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day workout streak',
    icon: '⚡',
    unlocked: false,
    xpReward: 400,
    category: 'streak',
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'reps_1000',
    name: 'Rep Master',
    description: 'Complete 1000 total reps',
    icon: '💯',
    unlocked: false,
    xpReward: 200,
    category: 'strength',
    requirement: { type: 'totalReps', value: 1000 },
  },
  {
    id: 'weight_10000',
    name: 'Heavy Hitter',
    description: 'Lift 10,000 kg total weight',
    icon: '🏋️',
    unlocked: false,
    xpReward: 300,
    category: 'strength',
    requirement: { type: 'totalWeight', value: 10000 },
  },
];

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      currentWorkout: null,
      activeExerciseIndex: 0,
      activeSetIndex: 0,
      timer: defaultTimer,
      workoutHistory: [],
      exercises: [
        // Default exercises
        {
          id: '1',
          name: 'Push-ups',
          category: 'strength',
          muscleGroups: ['chest', 'shoulders', 'triceps'],
          icon: '💪',
        },
        {
          id: '2',
          name: 'Squats',
          category: 'strength',
          muscleGroups: ['legs', 'glutes', 'core'],
          icon: '🦵',
        },
        {
          id: '3',
          name: 'Plank',
          category: 'core',
          muscleGroups: ['core', 'shoulders'],
          icon: '🏋️',
        },
        {
          id: '4',
          name: 'Jumping Jacks',
          category: 'cardio',
          muscleGroups: ['legs', 'core'],
          icon: '🏃',
        },
        {
          id: '5',
          name: 'Lunges',
          category: 'strength',
          muscleGroups: ['legs', 'glutes'],
          icon: '🚶',
        },
      ],
      stats: defaultStats,

      // Achievement System State
      achievements: defaultAchievements,
      userLevel: defaultUserLevel,
      challenges: [],
      unlockedAchievements: [],
      showAchievementModal: false,
      recentAchievement: null,

      startNewWorkout: (name) => {
        const workout: Workout = {
          id: Date.now().toString(),
          name,
          exercises: [],
          startTime: new Date(),
        };
        set({
          currentWorkout: workout,
          activeExerciseIndex: 0,
          activeSetIndex: 0,
          timer: defaultTimer,
        });
      },

      addExerciseToWorkout: (exercise) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const updatedWorkout = {
          ...currentWorkout,
          exercises: [
            ...currentWorkout.exercises,
            {
              exercise,
              sets: [
                {
                  reps: 0,
                  weight: 0,
                  completed: false,
                },
              ],
            },
          ],
        };

        set({ currentWorkout: updatedWorkout });
      },

      removeExerciseFromWorkout: (exerciseId) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const updatedWorkout = {
          ...currentWorkout,
          exercises: currentWorkout.exercises.filter(
            (we) => we.exercise.id !== exerciseId
          ),
        };

        set({
          currentWorkout: updatedWorkout,
          activeExerciseIndex: Math.min(get().activeExerciseIndex, updatedWorkout.exercises.length - 1),
        });
      },

      updateSet: (exerciseIndex, setIndex, updates) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const updatedExercises = [...currentWorkout.exercises];
        updatedExercises[exerciseIndex].sets[setIndex] = {
          ...updatedExercises[exerciseIndex].sets[setIndex],
          ...updates,
        };

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: updatedExercises,
          },
        });
      },

      nextExercise: () => {
        const { activeExerciseIndex, currentWorkout } = get();
        if (!currentWorkout) return;

        const nextIndex = Math.min(activeExerciseIndex + 1, currentWorkout.exercises.length - 1);
        set({
          activeExerciseIndex: nextIndex,
          activeSetIndex: 0,
        });
      },

      previousExercise: () => {
        set((state) => ({
          activeExerciseIndex: Math.max(state.activeExerciseIndex - 1, 0),
          activeSetIndex: 0,
        }));
      },

      finishWorkout: () => {
        const { currentWorkout, workoutHistory } = get();
        if (!currentWorkout) return;

        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - currentWorkout.startTime.getTime()) / 60000);

        const completedWorkout = {
          ...currentWorkout,
          endTime,
          duration,
        };

        const updatedHistory = [completedWorkout, ...workoutHistory];

        // Calculate new stats
        const stats = calculateStats(updatedHistory, get().exercises);

        // Award XP for completing workout (base XP + bonus for exercises and duration)
        let xpReward = 25; // Base XP for workout completion
        xpReward += completedWorkout.exercises.length * 5; // 5 XP per exercise

        // Bonus XP for longer workouts
        if (duration > 30) xpReward += 10;
        if (duration > 60) xpReward += 20;

        // Award XP and check for achievements
        get().addXP(xpReward);
        get().checkAchievements();

        set({
          currentWorkout: null,
          activeExerciseIndex: 0,
          activeSetIndex: 0,
          workoutHistory: updatedHistory,
          timer: defaultTimer,
          stats,
        });
      },

      cancelWorkout: () => {
        set({
          currentWorkout: null,
          activeExerciseIndex: 0,
          activeSetIndex: 0,
          timer: defaultTimer,
        });
      },

      startTimer: (duration, type) => {
        set({
          timer: {
            isRunning: true,
            timeLeft: duration,
            duration,
            type,
          },
        });
      },

      pauseTimer: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: false,
          },
        }));
      },

      resumeTimer: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: true,
          },
        }));
      },

      stopTimer: () => {
        set({
          timer: defaultTimer,
        });
      },

      updateTimer: () => {
        set((state) => {
          if (!state.timer.isRunning || state.timer.timeLeft <= 0) {
            return {
              timer: {
                ...state.timer,
                isRunning: false,
              },
            };
          }

          return {
            timer: {
              ...state.timer,
              timeLeft: state.timer.timeLeft - 1,
            },
          };
        });
      },

      addExercise: (exercise) => {
        set((state) => ({
          exercises: [...state.exercises, exercise],
        }));
      },

      updateExercise: (id, updates) => {
        set((state) => ({
          exercises: state.exercises.map((ex) =>
            ex.id === id ? { ...ex, ...updates } : ex
          ),
        }));
      },

      deleteExercise: (id) => {
        set((state) => ({
          exercises: state.exercises.filter((ex) => ex.id !== id),
        }));
      },

      loadWorkouts: () => {
        // Data is loaded automatically via persist middleware
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          workoutHistory: state.workoutHistory,
          exercises: state.exercises,
          stats: state.stats,
        });
      },

      importData: (data) => {
        try {
          const parsedData = JSON.parse(data);
          set({
            workoutHistory: parsedData.workoutHistory || [],
            exercises: parsedData.exercises || [],
            stats: parsedData.stats || defaultStats,
          });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      deleteWorkout: (id) => {
        const { workoutHistory } = get();
        const updatedHistory = workoutHistory.filter((workout) => workout.id !== id);

        // Recalculate stats with the updated history
        const stats = calculateStats(updatedHistory, get().exercises);

        set({
          workoutHistory: updatedHistory,
          stats,
        });
      },

      updateWorkout: (id, updates) => {
        const { workoutHistory } = get();
        const updatedHistory = workoutHistory.map((workout) =>
          workout.id === id ? { ...workout, ...updates } : workout
        );

        // Recalculate stats with the updated history
        const stats = calculateStats(updatedHistory, get().exercises);

        set({
          workoutHistory: updatedHistory,
          stats,
        });
      },

      // Achievement System Actions
      unlockAchievement: (achievementId) => {
        const { achievements, unlockedAchievements } = get();

        if (unlockedAchievements.includes(achievementId)) return;

        const achievement = achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;

        const updatedAchievements = achievements.map(a =>
          a.id === achievementId
            ? { ...a, unlocked: true, unlockedAt: new Date() }
            : a
        );

        // Award XP for achievement
        const xpReward = 50; // Base XP for achievements
        get().addXP(xpReward);

        set({
          achievements: updatedAchievements,
          unlockedAchievements: [...unlockedAchievements, achievementId],
          showAchievementModal: true,
          recentAchievement: updatedAchievements.find(a => a.id === achievementId),
        });
      },

      checkAchievements: () => {
        const { stats } = get();
        const { achievements } = get();

        achievements.forEach(achievement => {
          if (achievement.unlocked) return;

          let shouldUnlock = false;
          switch (achievement.requirement.type) {
            case 'totalWorkouts':
              shouldUnlock = stats.totalWorkouts >= achievement.requirement.value;
              break;
            case 'streak':
              shouldUnlock = stats.streak >= achievement.requirement.value;
              break;
            case 'totalReps':
              shouldUnlock = stats.totalReps >= achievement.requirement.value;
              break;
            case 'totalWeight':
              shouldUnlock = stats.totalWeight >= achievement.requirement.value;
              break;
          }

          if (shouldUnlock) {
            get().unlockAchievement(achievement.id);
          }
        });
      },

      addXP: (amount) => {
        const { userLevel } = get();
        const newTotalXP = userLevel.totalXP + amount;
        const newCurrentXP = userLevel.currentXP + amount;

        let newLevel = userLevel.level;
        let newXpToNext = userLevel.xpToNext;
        let newTitle = userLevel.title;

        // Check for level up
        if (newCurrentXP >= newXpToNext) {
          newLevel++;
          const remainingXP = newCurrentXP - newXpToNext;

          // Calculate XP needed for next level (exponential growth)
          newXpToNext = Math.floor(100 * Math.pow(1.2, newLevel - 1));

          // Determine new title based on level
          if (newLevel >= 50) {
            newTitle = 'Legend';
          } else if (newLevel >= 40) {
            newTitle = 'Master';
          } else if (newLevel >= 30) {
            newTitle = 'Expert';
          } else if (newLevel >= 20) {
            newTitle = 'Advanced';
          } else if (newLevel >= 10) {
            newTitle = 'Intermediate';
          } else {
            newTitle = 'Novice';
          }

          set({
            userLevel: {
              level: newLevel,
              currentXP: remainingXP,
              totalXP: newTotalXP,
              xpToNext: newXpToNext,
              title: newTitle,
            },
          });
        } else {
          set({
            userLevel: {
              ...userLevel,
              currentXP: newCurrentXP,
              totalXP: newTotalXP,
            },
          });
        }
      },

      calculateLevel: () => {
        // This method recalculates level based on total XP
        const { totalXP } = get().userLevel;
        let level = 1;
        let xpNeeded = 100;
        let remainingXP = totalXP;

        while (remainingXP >= xpNeeded) {
          remainingXP -= xpNeeded;
          level++;
          xpNeeded = Math.floor(100 * Math.pow(1.2, level - 1));
        }

        let title = 'Novice';
        if (level >= 50) {
          title = 'Legend';
        } else if (level >= 40) {
          title = 'Master';
        } else if (level >= 30) {
          title = 'Expert';
        } else if (level >= 20) {
          title = 'Advanced';
        } else if (level >= 10) {
          title = 'Intermediate';
        }

        set({
          userLevel: {
            level,
            currentXP: remainingXP,
            totalXP,
            xpToNext: xpNeeded,
            title,
          },
        });
      },

      addChallenge: (challenge: Challenge) => {
        set((state) => ({
          challenges: [...state.challenges, challenge],
        }));
      },

      toggleChallenge: (challengeId: string) => {
        set((state) => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId ? { ...c, completed: !c.completed } : c
          ),
        }));
      },

      deleteChallenge: (challengeId: string) => {
        set((state) => ({
          challenges: state.challenges.filter(challenge => challenge.id !== challengeId),
        }));
      },

      checkInChallenge: (challengeId: string) => {
        // Simple completion for the new punk version
        set((state) => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId ? { ...c, completed: true } : c
          ),
        }));
      },

      hideAchievementModal: () => {
        set({
          showAchievementModal: false,
          recentAchievement: null,
        });
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        workoutHistory: state.workoutHistory,
        exercises: state.exercises,
        stats: state.stats,
        achievements: state.achievements,
        userLevel: state.userLevel,
        challenges: state.challenges,
        unlockedAchievements: state.unlockedAchievements,
      }),
    }
  )
);

// Helper function to calculate stats
function calculateStats(workouts: Workout[], exercises: Exercise[]): WorkoutStats {
  const stats: WorkoutStats = {
    totalWorkouts: workouts.length,
    totalExercises: 0,
    totalSets: 0,
    totalReps: 0,
    totalVolume: 0,
    totalWeight: 0,
    streak: 0,
    lastWorkoutDate: workouts[0]?.endTime ? new Date(workouts[0].endTime) : undefined,
    favoriteExercises: [],
    weakMuscleGroups: [],
  };

  // Calculate totals
  workouts.forEach((workout) => {
    workout.exercises.forEach((we) => {
      stats.totalExercises++;
      we.sets.forEach((set) => {
        if (set.completed) {
          stats.totalSets++;
          stats.totalReps += set.reps;
          const weight = set.weight || 0;
          stats.totalWeight += weight * set.reps;
          stats.totalVolume += weight * set.reps;
        }
      });
    });
  });

  // Calculate streak (consecutive days with workouts)
  if (workouts.length > 0) {
    const sortedDates = workouts
      .filter((w) => w.endTime) // Only include workouts with endTime
      .map((w) => {
        const endTime = new Date(w.endTime!);
        return endTime.toDateString();
      })
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i - 1]);
      const previous = new Date(sortedDates[i]);
      const daysDiff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        streak++;
      } else if (daysDiff > 1) {
        break;
      }
    }
    stats.streak = streak;
  }

  // Find favorite exercises (most frequently used)
  const exerciseCounts: Record<string, number> = {};
  workouts.forEach((workout) => {
    workout.exercises.forEach((we) => {
      exerciseCounts[we.exercise.id] = (exerciseCounts[we.exercise.id] || 0) + 1;
    });
  });

  stats.favoriteExercises = exercises
    .filter((ex) => exerciseCounts[ex.id])
    .sort((a, b) => exerciseCounts[b.id] - exerciseCounts[a.id])
    .slice(0, 5);

  return stats;
}