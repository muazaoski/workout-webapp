import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Plus, Target, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="space-y-8 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Goals</h2>
          <p className="text-slate-500 font-medium">Focused objectives to keep you moving.</p>
        </div>
        {!showAdd && (
          <Button onClick={() => setShowAdd(true)} className="rounded-full">
            <Plus size={18} className="mr-2" /> New Goal
          </Button>
        )}
      </header>

      {/* ADD MISSION */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card title="Set your target" description="What are you working towards today?">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input label="Goal Title" placeholder="e.g. 10 Workouts Month" value={title} onChange={e => setTitle(e.target.value)} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Target Goal" type="number" placeholder="10" value={targetValue} onChange={e => setTargetValue(e.target.value)} required />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Metric</label>
                    <div className="flex gap-2">
                      {(['workouts', 'volume'] as const).map(t => (
                        <button
                          key={t} type="button" onClick={() => setType(t)}
                          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold border transition-all ${type === t ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" className="px-8">Create Goal</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST */}
      <div className="grid grid-cols-1 gap-4">
        {challenges.map(challenge => {
          const progress = (challenge.currentValue / challenge.targetValue) * 100;
          return (
            <div
              key={challenge.id}
              className={`p-6 bg-white rounded-2xl border transition-all hover:bg-slate-50 group dark:bg-slate-900 ${challenge.completed ? 'border-green-100 opacity-70' : 'border-slate-100'
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${challenge.completed ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                    {challenge.completed ? <CheckCircle2 size={24} /> : <Target size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-none mb-1">{challenge.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {challenge.targetValue} {challenge.type} • +{challenge.xpReward} XP Reward
                    </p>
                  </div>
                </div>

                <div className="flex-grow max-w-sm space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span className="uppercase tracking-widest">Progress</span>
                    <span className={challenge.completed ? 'text-green-500' : 'text-primary'}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      className={`h-full rounded-full ${challenge.completed ? 'bg-green-500' : 'bg-primary'}`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!challenge.completed && (
                    <Button variant="secondary" size="sm" onClick={() => toggleChallenge(challenge.id)}>
                      Mark Step
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteChallenge(challenge.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeCreator;