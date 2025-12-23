export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  instructions?: string[];
  icon?: string;
}

export interface ExerciseSet {
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  restTime?: number; // in seconds
  completed: boolean;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  mood?: WorkoutMood;
  energy?: number; // 1-10
  notes?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  totalWeight: number;
  streak: number;
  lastWorkoutDate?: Date;
  favoriteExercises: Exercise[];
  weakMuscleGroups: MuscleGroup[];
}

export type ExerciseCategory =
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'sports'
  | 'functional'
  | 'core';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'glutes'
  | 'calves'
  | 'forearms';

export type WorkoutMood =
  | 'energetic'
  | 'motivated'
  | 'tired'
  | 'sore'
  | 'focused'
  | 'relaxed';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
  category: 'workout' | 'streak' | 'strength' | 'consistency' | 'special';
  requirement: {
    type: 'totalWorkouts' | 'streak' | 'totalReps' | 'totalWeight' | 'custom';
    value: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'workouts' | 'volume' | 'reps';
  targetValue: number;
  currentValue: number;
  completed: boolean;
  xpReward: number;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  duration: number;
  type: 'work' | 'rest' | 'prepare';
}