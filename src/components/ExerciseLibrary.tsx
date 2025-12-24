import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Search, Plus, Trash2 } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import type { ExerciseCategory, MuscleGroup } from '../types/workout';

const ExerciseLibrary: React.FC = () => {
  const { exercises, addExercise, deleteExercise, addExerciseToWorkout, currentWorkout } = useWorkoutStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [muscleGroups, setMuscleGroups] = useState('');
  const [category] = useState<ExerciseCategory>('strength');

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
        muscleGroups: muscleGroups.split(',').map(m => m.trim()) as MuscleGroup[],
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
      {/* TOOLBAR */}
      <div className="space-y-6">
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={20} className="text-muted-foreground" />}
          className="!h-14 !rounded-2xl"
        />

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'strength', 'cardio', 'core', 'flexibility'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as ExerciseCategory | 'all')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all border ${selectedCategory === cat
                ? 'bg-primary border-primary text-black'
                : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white'
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ADD MODULE */}
      <div className="relative">
        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black">
              <Plus size={24} />
            </div>
            <span className="font-bold text-sm">Add Custom Exercise</span>
          </button>
        ) : (
          <Card title="New Exercise" description="Add a new movement to your library." className="border-primary/20 bg-card p-6">
            <form onSubmit={handleAdd} className="space-y-6">
              <Input label="Exercise Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bench Press" required />
              <Input label="Muscle Groups" value={muscleGroups} onChange={e => setMuscleGroups(e.target.value)} placeholder="e.g. Chest, Triceps" required />
              <div className="flex gap-3">
                <Button type="submit" variant="primary" fullWidth>Save Exercise</Button>
                <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}
      </div>

      {/* CATALOGUE */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="group flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex-shrink-0 flex items-center justify-center text-3xl group-hover:bg-primary/10 transition-colors">
                {ex.icon}
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{ex.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{ex.category}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                    {ex.muscleGroups.join(', ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              {currentWorkout && (
                <button
                  onClick={() => addExerciseToWorkout(ex)}
                  className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus size={22} />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); deleteExercise(ex.id); }}
                className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;