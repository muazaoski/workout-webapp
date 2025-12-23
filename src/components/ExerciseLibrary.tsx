import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Search, Plus, Trash2, Search as SearchIcon } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
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
    <div className="space-y-10">
      {/* SEARCH AND FILTERS */}
      <div className="space-y-6">
        <Input
          placeholder="SEARCH_INDEX..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<SearchIcon size={18} />}
        />

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'strength', 'cardio', 'core', 'flexibility'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${selectedCategory === cat
                  ? 'bg-brand-white text-brand-black border-brand-white'
                  : 'border-brand-white/10 text-brand-white/20 hover:border-brand-white/40'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ADD FORM */}
      <div className="border-2 border-dashed border-brand-white/10 p-6">
        {!showAdd ? (
          <Button variant="ghost" fullWidth onClick={() => setShowAdd(true)}>
            + REGISTER_NEW_EXERCISE
          </Button>
        ) : (
          <form onSubmit={handleAdd} className="space-y-6">
            <Input label="EXERCISE_NAME" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="MUSCLE_GROUPS (COMMA)" value={muscleGroups} onChange={e => setMuscleGroups(e.target.value)} required />
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" className="flex-1">COMMIT</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>CANCEL</Button>
            </div>
          </form>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="group flex items-center justify-between p-4 bg-brand-dark hover:bg-brand-gray border border-brand-white/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl group-hover:scale-110 transition-transform">{ex.icon}</span>
              <div>
                <h4 className="font-black italic uppercase tracking-tight leading-none mb-1 group-hover:text-brand-yellow transition-colors">{ex.name}</h4>
                <p className="text-[10px] font-bold text-brand-white/20 uppercase tracking-widest leading-none">
                  CAT_{ex.category} // {ex.muscleGroups.join('+')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentWorkout && (
                <Button
                  variant="outline"
                  size="sm"
                  className="!p-1 border-brand-white/10"
                  onClick={() => addExerciseToWorkout(ex)}
                >
                  <Plus size={16} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteExercise(ex.id)}
                className="!p-1 text-red-500/20 hover:text-red-500"
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