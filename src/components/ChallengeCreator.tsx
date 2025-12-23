import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Target, Plus, CheckCircle2, Zap, Trash2 } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { motion } from 'framer-motion';
import type { Challenge } from '../types/workout';

const ChallengeCreator: React.FC = () => {
  const { challenges, addChallenge, toggleChallenge, deleteChallenge } = useWorkoutStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [type, setType] = useState<Challenge['type']>('workouts');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && targetValue) {
      addChallenge({
        id: Date.now().toString(),
        title,
        description,
        type,
        targetValue: parseInt(targetValue),
        currentValue: 0,
        completed: false,
        xpReward: Math.round(parseInt(targetValue) * 10),
      });
      setTitle('');
      setDescription('');
      setTargetValue('');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex justify-between items-end border-b-4 border-punk-white pb-3">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">THE_<span className="text-punk-yellow">MATRIX</span></h2>
        <span className="text-[10px] font-mono opacity-50 block mb-1">GOAL_LOADED: {challenges.length}</span>
      </header>

      {/* CREATE NEW OBJECTIVE */}
      <div className="punk-card bg-punk-black border-punk-yellow/30 shadow-none">
        {!showAdd ? (
          <Button fullWidth variant="ghost" onClick={() => setShowAdd(true)} icon={<Plus size={16} />} className="text-xs italic underline underline-offset-4 decoration-2">
            INITIALIZE_NEW_MISSION
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2 mb-4 border-b border-punk-yellow/20 pb-2">
              <Zap size={14} className="text-punk-yellow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-punk-yellow">MISSION_PARAMETERS</span>
            </div>

            <Input
              label="MISSION_TITLE"
              placeholder="E.G. THE_GAUNTLET"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="TARGET_THRESHOLD"
                type="number"
                placeholder="00"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                required
              />
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black tracking-widest text-punk-yellow ml-1">METRIC_TYPE</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('workouts')}
                    className={`border-2 py-3 text-[10px] font-black uppercase tracking-widest italic transition-all ${type === 'workouts' ? 'bg-punk-yellow text-punk-black border-punk-yellow' : 'border-punk-white/10 text-punk-white/20'
                      }`}
                  >
                    WORKOUTS
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('volume')}
                    className={`border-2 py-3 text-[10px] font-black uppercase tracking-widest italic transition-all ${type === 'volume' ? 'bg-punk-yellow text-punk-black border-punk-yellow' : 'border-punk-white/10 text-punk-white/20'
                      }`}
                  >
                    VOLUME
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" variant="yellow" className="flex-1">DEPLOY_MISSION</Button>
              <Button type="button" onClick={() => setShowAdd(false)} variant="ghost" className="border-punk-white/10">CANCEL</Button>
            </div>
          </form>
        )}
      </div>

      {/* CHALLENGES LIST */}
      <div className="grid grid-cols-1 gap-6">
        {challenges.map((challenge) => {
          const progress = (challenge.currentValue / challenge.targetValue) * 100;
          return (
            <div
              key={challenge.id}
              className={`punk-card transition-all relative group ${challenge.completed ? 'opacity-50 grayscale' : 'hover:shadow-yellow'
                }`}
            >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => deleteChallenge(challenge.id)} className="p-1 border-none text-red-500">
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 border-2 flex items-center justify-center transition-colors ${challenge.completed ? 'bg-punk-yellow text-punk-black border-punk-yellow' : 'bg-punk-black border-punk-white/20 text-punk-white/20'
                    }`}>
                    {challenge.completed ? <CheckCircle2 size={24} /> : <Target size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-1 group-hover:text-punk-yellow transition-colors">
                      {challenge.title}
                    </h3>
                    <span className="text-[10px] font-mono uppercase opacity-40 italic tracking-widest">
                      TARGET: {challenge.targetValue} {challenge.type.toUpperCase()} // REWARD: +{challenge.xpReward}XP
                    </span>
                  </div>
                </div>

                <div className="flex-grow max-w-md">
                  <div className="flex justify-between text-[10px] font-black italic mb-2 tracking-widest">
                    <span>PROGRESS_METER</span>
                    <span className={challenge.completed ? 'text-punk-yellow' : ''}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-4 border-2 border-punk-white/10 bg-punk-black relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      className={`absolute inset-y-0 left-0 ${challenge.completed ? 'bg-punk-yellow' : 'bg-punk-white/40'}`}
                    />
                  </div>
                </div>

                {!challenge.completed && (
                  <Button variant="ghost" size="sm" onClick={() => toggleChallenge(challenge.id)} className="whitespace-nowrap border-punk-white/10 text-[10px]">
                    MANUAL_SYNC
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {challenges.length === 0 && (
          <div className="text-center py-20 border-4 border-dashed border-punk-white/5">
            <span className="text-[10px] font-black italic uppercase opacity-20 tracking-[10px]">THE_MATRIX_IS_EMPTY</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeCreator;