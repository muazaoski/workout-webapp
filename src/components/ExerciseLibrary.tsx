import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Search, Plus, Trash2, Dumbbell, ChevronRight } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import type { Exercise, ExerciseCategory } from '../types/workout';

const ExerciseLibrary: React.FC = () => {
  const { exercises, addExercise, deleteExercise, addExerciseToWorkout, currentWorkout } = useWorkoutStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [muscleGroups, setMuscleGroups] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('strength');

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && muscleGroups) {
      addExercise({
        id: Date.now().toString(),
        name,
        category,
        muscleGroups: muscleGroups.split(',').map(m => m.trim()) as any,
        icon: '🏋️',
        instructions: []
      });
      setName('');
      setMuscleGroups('');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* SEARCH AND FILTERS */}
      <div className="space-y-4">
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={18} />}
        />

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['all', 'strength', 'cardio', 'core', 'flexibility'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all capitalize border ${selectedCategory === cat
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-black dark:border-white'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ADD FORM */}
      <div className="rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-800">
        {!showAdd ? (
          <Button variant="ghost" fullWidth onClick={() => setShowAdd(true)} className="text-slate-500 font-medium">
            + Custom Exercise
          </Button>
        ) : (
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Exercise Name" value={name} onChange={e => setName(e.target.value)} placeholder="Bench Press" required />
            <Input label="Muscle Groups" value={muscleGroups} onChange={e => setMuscleGroups(e.target.value)} placeholder="Chest, Triceps" required />
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" className="flex-1">Add Exercise</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </form>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent transition-all dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl dark:bg-slate-800">
                {ex.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm capitalize">{ex.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {ex.category} • {ex.muscleGroups.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {currentWorkout && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => addExerciseToWorkout(ex)}
                  className="h-8 shadow-none"
                >
                  Add
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteExercise(ex.id)}
                className="h-8 w-8 text-slate-300 hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;