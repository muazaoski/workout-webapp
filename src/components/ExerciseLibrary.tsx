import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Search, Plus, Trash2, Filter, Dumbbell } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import type { Exercise, ExerciseCategory } from '../types/workout';

const ExerciseLibrary: React.FC = () => {
  const { exercises, addExercise, deleteExercise, addExerciseToWorkout, currentWorkout } = useWorkoutStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New exercise form state
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🏋️');
  const [newCategory, setNewCategory] = useState<ExerciseCategory>('strength');
  const [newMuscleGroups, setNewMuscleGroups] = useState('');

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddExercise = () => {
    if (newName && newMuscleGroups) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        name: newName,
        icon: newIcon,
        category: newCategory,
        muscleGroups: newMuscleGroups.split(',').map(m => m.trim()) as any,
        instructions: []
      };
      addExercise(exercise);
      setNewName('');
      setNewMuscleGroups('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* SEARCH AND FILTER STATUS */}
      <div className="space-y-4">
        <Input
          placeholder="SEARCH_INDEX..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={18} />}
        />

        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
          {['all', 'strength', 'cardio', 'core', 'flexibility'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${selectedCategory === cat
                ? 'bg-punk-yellow text-punk-black border-punk-yellow italic translate-x-1 translate-y-1'
                : 'border-punk-white/10 text-punk-white/40 hover:border-punk-white/40'
                }`}
            >
              {cat}_SCHEMA
            </button>
          ))}
        </div>
      </div>

      {/* ADD NEW EXERCISE PANEL */}
      <div className="punk-card bg-punk-black border-dashed border-punk-white/20">
        {!showAddForm ? (
          <Button fullWidth variant="ghost" onClick={() => setShowAddForm(true)} icon={<Plus size={16} />} className="text-xs">
            REGISTER_NEW_ENTRY
          </Button>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-punk-yellow tracking-widest uppercase mb-4 border-b border-punk-yellow/20 pb-2">CREATE_DATA_RECORD</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="NAME" value={newName} onChange={e => setNewName(e.target.value)} />
              <Input label="ICON_CHAR" value={newIcon} onChange={e => setNewIcon(e.target.value)} />
            </div>
            <Input label="MUSCLE_GROUPS (COMMA)" value={newMuscleGroups} onChange={e => setNewMuscleGroups(e.target.value)} />
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddExercise} variant="yellow" className="flex-1 text-xs">COMMIT_RECORD</Button>
              <Button onClick={() => setShowAddForm(false)} variant="ghost" className="text-xs border-punk-white/10">CANCEL</Button>
            </div>
          </div>
        )}
      </div>

      {/* EXERCISE LIST */}
      <div className="space-y-3">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="punk-card flex items-center justify-between group hover:border-punk-yellow hover:shadow-yellow transition-all bg-punk-gray/20 border-punk-white/5 p-3"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-punk-black border-2 border-punk-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {ex.icon}
              </div>
              <div>
                <h4 className="font-black italic uppercase leading-none mb-1 text-lg group-hover:text-punk-yellow transition-colors">{ex.name}</h4>
                <div className="flex gap-3 text-[8px] font-mono opacity-40 uppercase tracking-widest italic">
                  <span>CAT_{ex.category}</span>
                  <span>DATA_{ex.muscleGroups.join('+')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {currentWorkout && (
                <Button
                  size="sm"
                  onClick={() => addExerciseToWorkout(ex)}
                  className="p-1 px-3"
                >
                  <Plus size={14} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteExercise(ex.id)}
                className="p-1 border-none text-red-500/40 hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-center py-10 opacity-20">
            <span className="font-black italic uppercase tracking-widest text-[10px]">NO_MATCHING_DATA_FOUND</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;