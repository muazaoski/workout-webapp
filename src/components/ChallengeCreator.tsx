import React, { useState } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Target, Plus, CheckCircle2, Zap, Trash2, Trophy, Clock, Flame } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { motion } from 'framer-motion';
import type { Challenge } from '../types/workout';

const ChallengeCreator: React.FC = () => {
  const { challenges, addChallenge, deleteChallenge, toggleChallenge } = useWorkoutStore();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Challenge['type']>('workouts');
  const [targetValue, setTargetValue] = useState('');
  const [showCreator, setShowCreator] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && targetValue) {
      addChallenge({
        id: Date.now().toString(),
        title,
        description: `Goal: ${targetValue} ${type}`,
        type,
        targetValue: parseInt(targetValue),
        currentValue: 0,
        completed: false,
        xpReward: 200,
      });
      setTitle('');
      setTargetValue('');
      setShowCreator(false);
    }
  };

  return (
    <div className="space-y-12 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-1">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Strategic_Ops</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Mission_Center</h2>
          <p className="text-muted-foreground font-medium mt-3 text-lg opacity-60">Establish and monitors primary training objectives.</p>
        </div>
      </header>

      {!showCreator ? (
        <button
          onClick={() => setShowCreator(true)}
          className="w-full py-14 border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center gap-6 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group overflow-hidden relative"
        >
          <div className="h-20 w-20 rounded-[1.75rem] bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black shadow-inner">
            <Plus size={40} />
          </div>
          <div className="text-center space-y-2">
            <span className="font-black uppercase tracking-[0.4em] text-xs italic block">Establish_New_Objective</span>
            <p className="text-[9px] font-bold opacity-30 tracking-[0.2em] uppercase">Initialize Session Parameters</p>
          </div>
        </button>
      ) : (
        <Card title="Initialize_Objective" description="Configure mission parameters for neural integration." className="border-primary/20 bg-black/50 p-12">
          <form onSubmit={handleCreate} className="space-y-10">
            <Input label="Mission Designation" value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g. Strength Paradigm I" required className="bg-white/5 border-transparent h-16 font-bold uppercase italic" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Metric_Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['workouts', 'volume'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${type === t
                        ? 'bg-primary border-primary text-black'
                        : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Target_Threshold" type="number" value={targetValue} onChange={e => setTargetValue(e.target.value)} placeholder="0" required className="bg-white/5 border-transparent h-16 font-bold" />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="primary" fullWidth className="h-18 rounded-[1.75rem] text-sm font-black uppercase tracking-[0.2em]">Deploy_Objective</Button>
              <Button variant="ghost" className="h-18 px-12 rounded-[1.75rem] font-black uppercase tracking-widest text-[10px]" onClick={() => setShowCreator(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8">
        {challenges.map(challenge => (
          <Card key={challenge.id} className="relative overflow-hidden group border-white/5 bg-black/40 p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="flex items-center gap-8 flex-1">
                <div className={`h-20 w-20 rounded-[1.75rem] flex items-center justify-center shadow-inner transition-all duration-700 group-hover:scale-110 ${challenge.completed
                  ? 'bg-primary text-black shadow-primary/20'
                  : 'bg-white/5 text-muted-foreground'
                  }`}>
                  {challenge.completed ? <CheckCircle2 size={32} /> : <Target size={32} />}
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <h4 className={`font-black text-3xl uppercase tracking-tighter italic ${challenge.completed ? 'text-primary' : 'text-white'}`}>
                      {challenge.title}
                    </h4>
                    <div className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-lg ${challenge.completed ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-muted-foreground opacity-40'
                      }`}>
                      {challenge.completed ? 'COMPLETED' : 'ACTIVE_OPS'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                      <span>Target: {challenge.targetValue} {challenge.type}</span>
                      <span className="text-primary opacity-60 italic">Progress: {Math.round((challenge.currentValue / challenge.targetValue) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((challenge.currentValue / challenge.targetValue) * 100, 100)}%` }}
                        className={`h-full rounded-full ${challenge.completed ? 'bg-primary shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-primary/40'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right px-8 py-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Merit_Reward</p>
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <Zap size={14} className="text-primary group-hover:animate-bounce" />
                    <span className="font-black text-2xl italic tracking-tighter text-white">{challenge.xpReward}</span>
                    <span className="text-xs font-black text-primary italic opacity-60">XP</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteChallenge(challenge.id)}
                  className="h-16 w-16 rounded-[1.25rem] bg-red-500/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/10"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChallengeCreator;