import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkoutStore } from '../stores/workoutStore';
import type { Exercise, ExerciseCategory, MuscleGroup } from '../types/workout';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import { Search, Plus, X, Filter } from 'lucide-react';

const ExerciseLibrary: React.FC = () => {
  const { exercises, addExerciseToWorkout, addExercise } = useWorkoutStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: 'strength' as ExerciseCategory,
    muscleGroups: [] as MuscleGroup[],
    instructions: '',
    icon: '💪',
  });

  const categories: ExerciseCategory[] = ['strength', 'cardio', 'flexibility', 'balance', 'sports', 'functional'];
  const muscleGroups: MuscleGroup[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'glutes', 'calves', 'forearms'];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesMuscle = selectedMuscle === 'all' || exercise.muscleGroups.includes(selectedMuscle);

    return matchesSearch && matchesCategory && matchesMuscle;
  });

  const handleAddExercise = () => {
    if (newExercise.name && newExercise.muscleGroups.length > 0) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        ...newExercise,
      };

      addExercise(exercise);
      setNewExercise({
        name: '',
        category: 'strength',
        muscleGroups: [],
        instructions: '',
        icon: '💪',
      });
      setShowAddForm(false);
    }
  };

  const toggleMuscleGroup = (muscle: MuscleGroup) => {
    setNewExercise(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(muscle)
        ? prev.muscleGroups.filter(m => m !== muscle)
        : [...prev.muscleGroups, muscle]
    }));
  };

  const icons = ['💪', '🏃', '🧘', '🤸', '⚽', '🏋️', '🚴', '🏊', '🥊', '🤾'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Exercises</h2>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          icon={<Plus size={16} />}
        >
          Add Exercise
        </Button>
      </div>

      {/* Add Exercise Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Add New Exercise</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Exercise name"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                />

                <select
                  className="minimal-input"
                  value={newExercise.category}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, category: e.target.value as ExerciseCategory }))}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Muscle Groups */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Muscle Groups</label>
                <div className="flex flex-wrap gap-2">
                  {muscleGroups.map(muscle => (
                    <button
                      key={muscle}
                      type="button"
                      onClick={() => toggleMuscleGroup(muscle)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                        newExercise.muscleGroups.includes(muscle)
                          ? 'bg-white/10 border border-white/30 text-white'
                          : 'bg-dark-secondary border border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewExercise(prev => ({ ...prev, icon }))}
                      className={`w-10 h-10 rounded-lg text-xl transition-all duration-200 ${
                        newExercise.icon === icon
                          ? 'bg-white/10 border border-white/30'
                          : 'bg-dark-secondary border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="minimal-input w-full"
                placeholder="Instructions (optional)"
                rows={3}
                value={newExercise.instructions}
                onChange={(e) => setNewExercise(prev => ({ ...prev, instructions: e.target.value }))}
              />

              <div className="flex justify-end space-x-3">
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExercise}>
                  Add Exercise
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          className="minimal-input text-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as ExerciseCategory | 'all')}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="minimal-input text-sm"
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value as MuscleGroup | 'all')}
        >
          <option value="all">All Muscles</option>
          {muscleGroups.map(muscle => (
            <option key={muscle} value={muscle}>
              {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="border border-gray-800/50 rounded-lg p-4 hover:border-white/30 transition-all duration-200 cursor-pointer"
            onClick={() => addExerciseToWorkout(exercise)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{exercise.icon}</span>
              <span className="px-2 py-1 bg-dark-tertiary/50 rounded text-xs text-gray-400">
                {exercise.category}
              </span>
            </div>

            <h3 className="font-medium text-white mb-2 text-sm">{exercise.name}</h3>

            <div className="flex flex-wrap gap-1 mb-2">
              {exercise.muscleGroups.slice(0, 2).map(muscle => (
                <span
                  key={muscle}
                  className="px-1.5 py-0.5 bg-white/10 border border-white/30 rounded text-xs text-white"
                >
                  {muscle}
                </span>
              ))}
              {exercise.muscleGroups.length > 2 && (
                <span className="px-1.5 py-0.5 bg-gray-700/30 rounded text-xs text-gray-400">
                  +{exercise.muscleGroups.length - 2}
                </span>
              )}
            </div>

            <Button size="sm" className="w-full" icon={<Plus size={14} />}>
              Add
            </Button>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2 opacity-50">🔍</div>
          <p>No exercises found</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;