import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Plus, Target, CheckCircle2, Trash2, ArrowRight, Zap, Target as TargetIcon, Activity } from 'lucide-react';
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
    <div className="space-y-12 fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TargetIcon size={16} className="text-accent animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Active Missions</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">Objectives Matrix</h2>
          <p className="text-muted-foreground font-medium mt-1">Set targets, break records, earn XP.</p>
        </div>
        {!showAdd && (
          <Button onClick={() => setShowAdd(true)} size="lg" className="rounded-full px-8 bg-accent shadow-xl shadow-accent/20">
            <Plus size={20} className="mr-2" /> New Objective
          </Button>
        )}
      </header>

      {/* ADD MODULE */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card title="Initialize Target" description="Define the parameters for your next evolution phase.">
              <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                <Input label="Mission Designation" placeholder="E.g. Operation 500" value={title} onChange={e => setTitle(e.target.value)} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Target Value" type="number" placeholder="500" value={targetValue} onChange={e => setTargetValue(e.target.value)} required />
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Metric Type</label>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                      {(['workouts', 'volume'] as const).map(t => (
                        <button
                          key={t} type="button" onClick={() => setType(t)}
                          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === t
                              ? 'bg-accent text-white shadow-lg shadow-accent/20'
                              : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="ghost" size="lg" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" size="lg" className="px-10 bg-accent hover:bg-accent/90">Deploy Target</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATALOGUE */}
      <div className="grid grid-cols-1 gap-6">
        {challenges.map(challenge => {
          const progress = (challenge.currentValue / challenge.targetValue) * 100;
          return (
            <div
              key={challenge.id}
              className={`p-10 bg-white/5 rounded-[3rem] border transition-all hover:bg-white/10 group ${challenge.completed ? 'border-indigo-500/20 opacity-60' : 'border-white/5'
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl shadow-current opacity-60 ${challenge.completed ? 'bg-indigo-500/10 text-indigo-400' : 'bg-accent/10 text-accent'
                    }`}>
                    {challenge.completed ? <CheckCircle2 size={32} /> : <Target size={32} />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold tracking-tighter leading-none">{challenge.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{challenge.targetValue} {challenge.type}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                      <div className="flex items-center gap-1 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                        <Zap size={10} />
                        <span>+{challenge.xpReward} XP Reward</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-grow max-w-sm space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">Integrity_Meter</span>
                    <span className={`text-xl font-bold font-mono ${challenge.completed ? 'text-indigo-400' : 'text-accent'}`}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full relative overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      className={`h-full rounded-full shadow-lg ${challenge.completed ? 'bg-indigo-500 shadow-indigo-500/40' : 'bg-accent shadow-accent/40'}`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!challenge.completed && (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => toggleChallenge(challenge.id)}
                      className="rounded-2xl border-white/10 hover:border-accent hover:text-accent font-black tracking-widest text-xs"
                    >
                      SYNC_METRIC
                    </Button>
                  )}
                  <button
                    onClick={() => deleteChallenge(challenge.id)}
                    className="h-12 w-12 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
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