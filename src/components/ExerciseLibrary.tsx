import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Search, Plus, Trash2, Dumbbell, ChevronRight, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
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
    <div className="space-y-10 pb-20">
      {/* TOOLBAR */}
      <div className="space-y-6">
        <div className="relative group">
          <Input
            placeholder="Search system database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={22} className="text-primary/50 group-hover:text-primary transition-colors" />}
            className="!h-16 !rounded-3xl !px-12 bg-white/5 border-white/5 focus:bg-white/10 text-lg font-medium"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {['all', 'strength', 'cardio', 'core', 'flexibility'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${selectedCategory === cat
                  ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ADD MODULE */}
      <div className="relative">
        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-8 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all hover:bg-primary/5 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
              <Plus size={24} />
            </div>
            <span className="font-bold uppercase tracking-[0.2em] text-xs">Register Custom Exercise</span>
          </button>
        ) : (
          <Card title="Add Exercise" description="Define a new movement in your personal library." className="border-indigo-500/20">
            <form onSubmit={handleAdd} className="space-y-6">
              <Input label="Exercise Name" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Incline Bench Press" required />
              <Input label="Muscle Groups (Comma separated)" value={muscleGroups} onChange={e => setMuscleGroups(e.target.value)} placeholder="E.g. Chest, Shoulders" required />
              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" fullWidth size="lg">Save Exercise</Button>
                <Button variant="ghost" size="lg" onClick={() => setShowAdd(false)}>Cancel</Button>
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
            className="group flex items-center justify-between p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:border-indigo-500/20 hover:scale-[1.01] transition-all cursor-pointer"
            onClick={() => currentWorkout && addExerciseToWorkout(ex)}
          >
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl transition-transform group-hover:scale-110 group-hover:bg-indigo-500/10 grayscale group-hover:grayscale-0">
                {ex.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-lg uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{ex.name}</h4>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{ex.category}</span>
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider truncate">
                    {ex.muscleGroups.join(' // ')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
              {currentWorkout && (
                <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Plus size={20} />
                </div>
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