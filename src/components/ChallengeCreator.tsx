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
    <div className="space-y-8 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Challenges</h2>
          <p className="text-muted-foreground mt-1">Push your limits with custom goals.</p>
        </div>
      </header>

      {!showCreator ? (
        <button
          onClick={() => setShowCreator(true)}
          className="w-full py-10 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all group"
        >
          <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black shadow-inner">
            <Plus size={28} />
          </div>
          <span className="font-bold text-sm tracking-wide">Create New Challenge</span>
        </button>
      ) : (
        <Card title="New Challenge" description="Define your next performance goal." className="border-primary/20 bg-card p-8">
          <form onSubmit={handleCreate} className="space-y-8">
            <Input label="Challenge Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Month of Gains" required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Metric Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['workouts', 'volume'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${type === t
                          ? 'bg-primary border-primary text-black'
                          : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10'
                        }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Target Value" type="number" value={targetValue} onChange={e => setTargetValue(e.target.value)} placeholder="0" required />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" fullWidth>Launch Challenge</Button>
              <Button variant="ghost" onClick={() => setShowCreator(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {challenges.map(challenge => (
          <Card key={challenge.id} className="relative overflow-hidden group border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6 flex-1">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${challenge.completed
                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-muted-foreground'
                  }`}>
                  {challenge.completed ? <CheckCircle2 size={24} /> : <Target size={24} />}
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className={`font-bold text-xl ${challenge.completed ? 'text-primary' : 'text-white'}`}>
                      {challenge.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${challenge.completed ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'
                      }`}>
                      {challenge.completed ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <span>Progress: {challenge.currentValue} / {challenge.targetValue}</span>
                      <span className="text-primary">{Math.round((challenge.currentValue / challenge.targetValue) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((challenge.currentValue / challenge.targetValue) * 100, 100)}%` }}
                        className={`h-full rounded-full ${challenge.completed ? 'bg-primary' : 'bg-primary/40'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Reward</p>
                  <div className="flex items-center gap-1">
                    <Zap size={14} className="text-primary" />
                    <span className="font-bold text-lg">{challenge.xpReward} XP</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteChallenge(challenge.id)}
                  className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                >
                  <Trash2 size={20} />
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