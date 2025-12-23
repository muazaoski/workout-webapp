import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Plus, Target, CheckCircle2, Trash2 } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { motion } from 'framer-motion';
import type { Challenge } from '../types/workout';

const ChallengeCreator: React.FC = () => {
  const { challenges, addChallenge, toggleChallenge, deleteChallenge } = useWorkoutStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [type, setType] = useState<Challenge['type']>('workouts');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && targetValue) {
      addChallenge({
        id: Date.now().toString(),
        title,
        description: '',
        type,
        targetValue: parseInt(targetValue),
        currentValue: 0,
        completed: false,
        xpReward: Math.round(parseInt(targetValue) * 10),
      });
      setTitle('');
      setTargetValue('');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-10 fade-in">
      <header className="flex justify-between items-end border-b-2 border-brand-white/10 pb-4">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">MISSION_OBJECTIVES</h2>
        <span className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest italic">{challenges.length} ACTIVE_TARGETS</span>
      </header>

      {/* ADD MISSION */}
      <div className="border-2 border-dashed border-brand-white/10 p-6">
        {!showAdd ? (
          <Button variant="ghost" fullWidth onClick={() => setShowAdd(true)}>
            + INITIALIZE_NEW_MISSION
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input label="MISSION_CODE_NAME" placeholder="E.G. OPERATION_STEEL" value={title} onChange={e => setTitle(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Input label="TARGET_VALUE" type="number" placeholder="00" value={targetValue} onChange={e => setTargetValue(e.target.value)} required />
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-white/40 ml-1">METRIC_TYPE</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('workouts')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase border-2 transition-all ${type === 'workouts' ? 'bg-brand-white text-brand-black border-brand-white' : 'border-brand-white/10 text-brand-white/20'}`}
                  >
                    WORKOUTS
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('volume')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase border-2 transition-all ${type === 'volume' ? 'bg-brand-white text-brand-black border-brand-white' : 'border-brand-white/10 text-brand-white/20'}`}
                  >
                    VOLUME
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" variant="primary" className="flex-1">DEPLOY</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>CANCEL</Button>
            </div>
          </form>
        )}
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 gap-4">
        {challenges.map(challenge => {
          const progress = (challenge.currentValue / challenge.targetValue) * 100;
          return (
            <div
              key={challenge.id}
              className={`p-6 border-2 transition-all group ${challenge.completed ? 'border-brand-white/5 opacity-40' : 'border-brand-white/10 hover:border-brand-yellow/40'
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center border-2 ${challenge.completed ? 'border-brand-white/10 text-brand-white/40' : 'border-brand-yellow bg-brand-yellow text-brand-black'
                    }`}>
                    {challenge.completed ? <CheckCircle2 size={24} /> : <Target size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tight leading-none mb-1">{challenge.title}</h3>
                    <p className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest leading-none">
                      {challenge.targetValue} {challenge.type.toUpperCase()} // +{challenge.xpReward} XP
                    </p>
                  </div>
                </div>

                <div className="flex-grow max-w-sm space-y-2">
                  <div className="flex justify-between text-[9px] font-black tracking-[0.2em] uppercase">
                    <span>STATUS_METER</span>
                    <span className={challenge.completed ? '' : 'text-brand-yellow'}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1 bg-brand-white/10 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      className={`absolute inset-y-0 left-0 ${challenge.completed ? 'bg-brand-white/40' : 'bg-brand-yellow'}`}
                    />
                  </div>
                </div>

                {!challenge.completed && (
                  <Button variant="ghost" size="sm" onClick={() => toggleChallenge(challenge.id)} className="text-[10px] border-brand-white/10">
                    SYNC_DATA
                  </Button>
                )}

                <button onClick={() => deleteChallenge(challenge.id)} className="p-2 text-brand-white/10 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeCreator;