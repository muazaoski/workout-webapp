import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Trophy, Lock, CheckCircle2, Medal, Zap, Sparkles } from 'lucide-react';

const Achievements: React.FC = () => {
  const { achievements } = useWorkoutStore();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Achievements</h2>
          <p className="text-muted-foreground mt-1">Track your milestones and personal bests.</p>
        </div>
        <div className="bg-white/5 border border-white/5 px-6 py-2 rounded-2xl flex items-center gap-4">
          <div className="flex -space-x-3">
            {achievements.filter(a => a.unlocked).slice(0, 5).map(a => (
              <div key={a.id} className="h-10 w-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-xl shadow-lg">
                {a.icon}
              </div>
            ))}
          </div>
          <span className="font-bold text-sm text-primary">{unlockedCount} / {achievements.length}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-6 rounded-3xl border transition-all flex items-center justify-between group relative overflow-hidden ${achievement.unlocked
                ? 'border-primary/20 bg-primary/5'
                : 'border-white/5 opacity-50 bg-white/5 grayscale'
              }`}
          >
            <div className="flex items-center gap-6 relative z-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 ${achievement.unlocked
                  ? 'bg-primary text-black shadow-lg shadow-primary/20'
                  : 'bg-muted text-muted-foreground'
                }`}>
                {achievement.unlocked ? achievement.icon : <Lock size={24} />}
              </div>
              <div className="space-y-1">
                <h3 className={`font-bold text-lg leading-none ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'
                  }`}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-[200px]">
                  {achievement.description}
                </p>
              </div>
            </div>

            {achievement.unlocked && (
              <CheckCircle2 size={24} className="text-primary animate-in zoom-in duration-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;