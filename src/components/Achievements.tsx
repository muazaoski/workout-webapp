import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import Card from './ui/Card';
import { Trophy, Lock, CheckCircle2, Medal, Zap, Sparkles } from 'lucide-react';

const Achievements: React.FC = () => {
  const { achievements } = useWorkoutStore();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-12 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Medal Room</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">Hall of Fame</h2>
          <p className="text-muted-foreground font-medium mt-1">Collecting tokens of discipline and persistence.</p>
        </div>
        <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-full flex items-center gap-3">
          <div className="flex -space-x-3">
            {achievements.filter(a => a.unlocked).slice(0, 5).map(a => (
              <div key={a.id} className="h-10 w-10 rounded-full bg-background border-2 border-white/5 flex items-center justify-center text-xl shadow-lg">
                {a.icon}
              </div>
            ))}
          </div>
          <span className="font-bold text-sm tracking-tight">{unlockedCount} / {achievements.length} UNLOCKED</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-8 rounded-[2.5rem] border transition-all flex items-center justify-between group overflow-hidden relative ${achievement.unlocked
                ? 'border-indigo-500/30 bg-indigo-500/5 shadow-2xl shadow-indigo-500/5'
                : 'border-white/5 opacity-50 bg-white/5 grayscale'
              }`}
          >
            {/* Background Icon Watermark */}
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none transition-transform group-hover:scale-125 duration-700">
              {achievement.unlocked ? <span>{achievement.icon}</span> : <Lock size={120} />}
            </div>

            <div className="flex items-center gap-6 relative z-10">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl transition-all duration-500 group-hover:scale-110 ${achievement.unlocked
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white glow-indigo'
                  : 'bg-muted text-muted-foreground border border-white/5'
                }`}>
                {achievement.unlocked ? achievement.icon : <Lock size={28} />}
              </div>
              <div className="space-y-1">
                <h3 className={`font-extrabold text-xl tracking-tight leading-none ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'
                  }`}>
                  {achievement.name}
                </h3>
                <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-[200px]">
                  "{achievement.description}"
                </p>
              </div>
            </div>

            {achievement.unlocked && (
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 animate-in zoom-in duration-500">
                <CheckCircle2 size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;