import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Search, Plus, Trash2, Dumbbell, ChevronRight, Filter, LayoutGrid, List as ListIcon, Zap } from 'lucide-react';
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
    <div className="space-y-12 pb-20">
      {/* TOOLBAR */}
      <div className="space-y-8">
        <div className="relative group">
          <Input
            placeholder="Search Central Data Grid..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={24} className="text-primary/40 group-focus-within:text-primary transition-colors" />}
            className="!h-20 !rounded-[2rem] !px-14 bg-white/5 border-white/5 focus:bg-white/10 text-xl font-bold uppercase tracking-tight italic"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-20">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">DB_SCAN</span>
            <Zap size={10} className="text-primary animate-pulse" />
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1">
          {['all', 'strength', 'cardio', 'core', 'flexibility'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border-2 relative overflow-hidden group ${selectedCategory === cat
                  ? 'bg-primary border-primary text-black shadow-xl shadow-primary/20'
                  : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className="relative z-10">{cat}</span>
              {selectedCategory === cat && (
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ADD MODULE */}
      <div className="relative">
        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-12 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black shadow-inner">
              <Plus size={32} />
            </div>
            <span className="font-black uppercase tracking-[0.4em] text-[11px] italic">Register_Custom_Entry</span>
          </button>
        ) : (
          <Card title="Register_Module" description="Initialize a new exercise protocol in your personal archives." className="border-primary/20 bg-black/50 p-10">
            <form onSubmit={handleAdd} className="space-y-8">
              <Input label="Protocol Designation" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Incline Bench Matrix" required className="bg-white/5 border-transparent h-16 font-bold" />
              <Input label="Biometric Targets (Comma separated)" value={muscleGroups} onChange={e => setMuscleGroups(e.target.value)} placeholder="E.g. Chest, Ant_Delts" required className="bg-white/5 border-transparent h-16 font-bold" />
              <div className="flex gap-4 pt-6">
                <Button type="submit" variant="primary" fullWidth className="h-16 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em]">Save_Protocol</Button>
                <Button variant="ghost" className="h-16 px-10 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px]" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}
      </div>

      {/* CATALOGUE */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="group flex items-center justify-between p-7 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
            onClick={() => currentWorkout && addExerciseToWorkout(ex)}
          >
            <div className="absolute -left-10 -top-10 text-primary opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none">
              <Dumbbell size={180} className="-rotate-12" />
            </div>

            <div className="flex items-center gap-8 relative z-10">
              <div className="h-20 w-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-5xl transition-all group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-[0_0_25px_rgba(250,204,21,0.2)] grayscale-[0.5] group-hover:grayscale-0 shadow-inner">
                {ex.icon}
              </div>
              <div className="space-y-3">
                <h4 className="font-black text-2xl uppercase tracking-tighter italic group-hover:text-primary transition-colors leading-none">{ex.name}</h4>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">{ex.category}</span>
                  <div className="h-1 w-1 rounded-full bg-white/20" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                    {ex.muscleGroups.join(' // ')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 relative z-10">
              {currentWorkout && (
                <div className="h-14 w-14 bg-primary rounded-[1.25rem] flex items-center justify-center text-black shadow-2xl shadow-primary/40 transform hover:scale-110 active:scale-90 transition-transform">
                  <Plus size={28} />
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); deleteExercise(ex.id); }}
                className="h-14 w-14 bg-red-500/10 rounded-[1.25rem] flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;