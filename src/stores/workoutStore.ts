import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Workout, Exercise, WorkoutStats, TimerState, Achievement, Challenge, UserSettings, BodyWeightLog, PerformanceLog } from '../types/workout';

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
  isMinimized: boolean;

  // Timer state
  timer: TimerState;

  // Workout history
  workoutHistory: Workout[];

  // Exercises library
  exercises: Exercise[];

  // User Settings
  settings: UserSettings;

  // Stats
  stats: WorkoutStats;

  // Achievement System State
  achievements: Achievement[];
  userLevel: UserLevel;
  challenges: Challenge[];
  unlockedAchievements: string[];
  showAchievementModal: boolean;
  recentAchievement: Achievement | null;
  joinedChallengeIds: string[];

  // Actions
  startNewWorkout: (name: string) => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  updateSet: (exerciseIndex: number, setIndex: number, updates: Partial<{ reps: number; weight: number; completed: boolean }>) => void;
  nextExercise: () => void;
  previousExercise: () => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  toggleMinimize: (val?: boolean) => void;
  logManualWorkout: (workout: Workout) => void;

  // Timer actions
  startTimer: (duration: number, type: TimerState['type']) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  updateTimer: () => void;

  // Settings actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  addBodyWeightLog: (weight: number) => void;

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
  joinChallenge: (id: string) => void;
  leaveChallenge: (id: string) => void;
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
  bodyWeightLogs: [],
  performanceLogs: [],
};

const defaultSettings: UserSettings = {
  weightUnit: 'kg',
  distanceUnit: 'km',
  theme: 'dark',
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
    id: 'first-workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    icon: '🎯',
    unlocked: false,
    xpReward: 50,
    category: 'workout',
    requirement: { type: 'totalWorkouts', value: 1 },
  },
  {
    id: 'workout-10',
    name: 'Getting Started',
    description: 'Complete 10 workouts',
    icon: '💪',
    unlocked: false,
    xpReward: 100,
    category: 'consistency',
    requirement: { type: 'totalWorkouts', value: 10 },
  },
  {
    id: 'workout-50',
    name: 'Fitness Enthusiast',
    description: 'Complete 50 workouts',
    icon: '🏆',
    unlocked: false,
    xpReward: 250,
    category: 'consistency',
    requirement: { type: 'totalWorkouts', value: 50 },
  },
  {
    id: 'workout-100',
    name: 'Workout Warrior',
    description: 'Complete 100 workouts',
    icon: '👑',
    unlocked: false,
    xpReward: 500,
    category: 'consistency',
    requirement: { type: 'totalWorkouts', value: 100 },
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🔥',
    unlocked: false,
    xpReward: 150,
    category: 'streak',
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day workout streak',
    icon: '⚡',
    unlocked: false,
    xpReward: 400,
    category: 'streak',
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'reps-1000',
    name: 'Rep Master',
    description: 'Complete 1000 total reps',
    icon: '💯',
    unlocked: false,
    xpReward: 200,
    category: 'strength',
    requirement: { type: 'totalReps', value: 1000 },
  },
  {
    id: 'weight-10000',
    name: 'Heavy Hitter',
    description: 'Lift 10,000 kg total weight',
    icon: '🏋️',
    unlocked: false,
    xpReward: 300,
    category: 'strength',
    requirement: { type: 'totalWeight', value: 10000 },
  },
];

const mockChallenges: Challenge[] = [
  {
    id: 'comm-1',
    title: 'Winter Warrior',
    description: 'Log 20 workouts this season.',
    type: 'workouts',
    targetValue: 20,
    currentValue: 0,
    completed: false,
    xpReward: 500,
    creator: 'System',
    participantsCount: 1542,
    isCommunity: true
  },
  {
    id: 'comm-2',
    title: 'Volume King',
    description: 'Move 50,000kg in a month.',
    type: 'volume',
    targetValue: 50000,
    currentValue: 0,
    completed: false,
    xpReward: 1000,
    creator: 'Alex Fitness',
    participantsCount: 843,
    isCommunity: true
  }
];

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      currentWorkout: null,
      activeExerciseIndex: 0,
      activeSetIndex: 0,
      isMinimized: false,
      timer: defaultTimer,
      workoutHistory: [],
      settings: defaultSettings,
      exercises: [
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

      achievements: defaultAchievements,
      userLevel: defaultUserLevel,
      challenges: mockChallenges,
      unlockedAchievements: [],
      showAchievementModal: false,
      recentAchievement: null,
      joinedChallengeIds: [],

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
          isMinimized: false,
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

        const updatedWorkout = { ...currentWorkout };
        const workoutExercise = updatedWorkout.exercises[exerciseIndex];

        if (workoutExercise) {
          workoutExercise.sets[setIndex] = {
            ...workoutExercise.sets[setIndex],
            ...updates,
          };
          set({ currentWorkout: updatedWorkout });
        }
      },

      nextExercise: () => {
        const { currentWorkout, activeExerciseIndex } = get();
        if (currentWorkout && activeExerciseIndex < currentWorkout.exercises.length - 1) {
          set({
            activeExerciseIndex: activeExerciseIndex + 1,
            activeSetIndex: 0,
          });
        }
      },

      previousExercise: () => {
        const { activeExerciseIndex } = get();
        if (activeExerciseIndex > 0) {
          set({
            activeExerciseIndex: activeExerciseIndex - 1,
            activeSetIndex: 0,
          });
        }
      },

      finishWorkout: () => {
        const { currentWorkout, workoutHistory, exercises } = get();
        if (!currentWorkout) return;

        const completedWorkout = {
          ...currentWorkout,
          endTime: new Date(),
          duration: Math.floor((new Date().getTime() - currentWorkout.startTime.getTime()) / 60000),
        };

        const newHistory = [completedWorkout, ...workoutHistory];
        const newStats = calculateStats(newHistory, exercises, get().stats);

        set({
          workoutHistory: newHistory,
          currentWorkout: null,
          activeExerciseIndex: 0,
          activeSetIndex: 0,
          isMinimized: false,
          stats: newStats,
        });

        get().checkAchievements();

        const totalCompletedSets = completedWorkout.exercises.reduce(
          (acc, ex) => acc + ex.sets.filter(s => s.completed).length,
          0
        );

        if (totalCompletedSets > 0) {
          get().addXP(100);
        }
      },

      cancelWorkout: () => {
        set({
          currentWorkout: null,
          activeExerciseIndex: 0,
          activeSetIndex: 0,
          isMinimized: false,
        });
      },

      toggleMinimize: (val) => {
        set((state) => ({ isMinimized: val !== undefined ? val : !state.isMinimized }));
      },

      logManualWorkout: (workout) => {
        const { workoutHistory, exercises, stats } = get();
        const newHistory = [workout, ...workoutHistory];
        const newStats = calculateStats(newHistory, exercises, stats);

        set({
          workoutHistory: newHistory,
          stats: newStats
        });

        get().checkAchievements();
        get().addXP(50); // Less XP for manual logs
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
          timer: { ...state.timer, isRunning: false },
        }));
      },

      resumeTimer: () => {
        set((state) => ({
          timer: { ...state.timer, isRunning: true },
        }));
      },

      stopTimer: () => {
        set({ timer: defaultTimer });
      },

      updateTimer: () => {
        const { timer } = get();
        if (timer.isRunning && timer.timeLeft > 0) {
          set({
            timer: { ...timer, timeLeft: timer.timeLeft - 1 },
          });
        } else if (timer.timeLeft === 0) {
          set({ timer: { ...timer, isRunning: false } });
        }
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }));
      },

      addBodyWeightLog: (weight) => {
        const { stats } = get();
        const newLog: BodyWeightLog = {
          date: new Date().toISOString().split('T')[0],
          weight
        };

        set({
          stats: {
            ...stats,
            bodyWeightLogs: [...(stats.bodyWeightLogs || []), newLog]
          }
        });
      },

      addExercise: (exercise) => {
        set((state) => ({
          exercises: [...state.exercises, exercise],
        }));
      },

      updateExercise: (id, updates) => {
        set((state) => ({
          exercises: state.exercises.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)),
        }));
      },

      deleteExercise: (id) => {
        set((state) => ({
          exercises: state.exercises.filter((ex) => ex.id !== id),
        }));
      },

      loadWorkouts: () => {
        // Persistent storage handles this
      },

      exportData: () => {
        return JSON.stringify(get());
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set(parsed);
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      deleteWorkout: (id) => {
        set((state) => {
          const newHistory = state.workoutHistory.filter((w) => w.id !== id);
          return {
            workoutHistory: newHistory,
            stats: calculateStats(newHistory, state.exercises, state.stats),
          };
        });
      },

      updateWorkout: (id, updates) => {
        set((state) => {
          const newHistory = state.workoutHistory.map((w) => (w.id === id ? { ...w, ...updates } : w));
          return {
            workoutHistory: newHistory,
            stats: calculateStats(newHistory, state.exercises, state.stats),
          };
        });
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          const alreadyUnlocked = state.unlockedAchievements.includes(achievementId);
          if (alreadyUnlocked) return state;

          const achievement = state.achievements.find(a => a.id === achievementId);
          if (!achievement) return state;

          const updatedAchievements = state.achievements.map(a =>
            a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date() } : a
          );

          return {
            achievements: updatedAchievements,
            unlockedAchievements: [...state.unlockedAchievements, achievementId],
            showAchievementModal: true,
            recentAchievement: achievement,
          };
        });
      },

      checkAchievements: () => {
        const { stats, achievements } = get();
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

        if (newCurrentXP >= newXpToNext) {
          newLevel++;
          const remainingXP = newCurrentXP - newXpToNext;
          newXpToNext = Math.floor(100 * Math.pow(1.2, newLevel - 1));

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

      addChallenge: (challenge) => {
        set((state) => ({
          challenges: [...state.challenges, challenge],
        }));
      },

      toggleChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId ? { ...c, completed: !c.completed } : c
          ),
        }));
      },

      deleteChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.filter(challenge => challenge.id !== challengeId),
        }));
      },

      checkInChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId ? { ...c, completed: true } : c
          ),
        }));
      },

      joinChallenge: (id: string) => {
        set((state) => ({
          joinedChallengeIds: [...state.joinedChallengeIds, id]
        }));
      },

      leaveChallenge: (id: string) => {
        set((state) => ({
          joinedChallengeIds: state.joinedChallengeIds.filter(cid => cid !== id)
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
      name: 'workout-v3', // New version for significantly updated schemas
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        workoutHistory: state.workoutHistory,
        exercises: state.exercises,
        settings: state.settings,
        stats: state.stats,
        achievements: state.achievements,
        userLevel: state.userLevel,
        challenges: state.challenges,
        unlockedAchievements: state.unlockedAchievements,
        joinedChallengeIds: state.joinedChallengeIds,
      }),
    }
  )
);

function calculateStats(workouts: Workout[], exercises: Exercise[], prevStats: WorkoutStats): WorkoutStats {
  const stats: WorkoutStats = {
    totalWorkouts: workouts.length,
    totalExercises: 0,
    totalSets: 0,
    totalReps: 0,
    totalVolume: 0,
    totalWeight: 0,
    streak: 0,
    lastWorkoutDate: workouts[0]?.startTime ? new Date(workouts[0].startTime) : undefined,
    favoriteExercises: [],
    weakMuscleGroups: [],
    bodyWeightLogs: prevStats.bodyWeightLogs || [],
    performanceLogs: [],
  };

  const performanceLogsMap: Record<string, PerformanceLog> = {};

  workouts.forEach((workout) => {
    const dateKey = new Date(workout.startTime).toISOString().split('T')[0];
    if (!performanceLogsMap[dateKey]) {
      performanceLogsMap[dateKey] = { date: dateKey, volume: 0, reps: 0 };
    }

    workout.exercises.forEach((we) => {
      stats.totalExercises++;
      we.sets.forEach((set) => {
        if (set.completed) {
          stats.totalSets++;
          stats.totalReps += set.reps;
          const weight = set.weight || 0;
          const setVolume = weight * set.reps;
          stats.totalWeight += weight * set.reps;
          stats.totalVolume += setVolume;

          performanceLogsMap[dateKey].volume += setVolume;
          performanceLogsMap[dateKey].reps += set.reps;
        }
      });
    });
  });

  stats.performanceLogs = Object.values(performanceLogsMap).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (workouts.length > 0) {
    const sortedDates = [...new Set(workouts
      .filter((w) => w.endTime)
      .map((w) => new Date(w.endTime!).toDateString()))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    if (sortedDates.length > 0) {
      streak = 1;
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
    }
    stats.streak = streak;
  }

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