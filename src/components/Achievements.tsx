import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Trophy, Lock, CheckCircle2, Medal, Zap, Sparkles } from 'lucide-react';

const Achievements: React.FC = () => {
  const { achievements } = useWorkoutStore();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-12 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-1">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Medal_Archive</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Hall_of_Fame</h2>
          <p className="text-muted-foreground font-medium mt-3 text-lg opacity-60">Neural imprints of achieved milestones and physical discipline.</p>
        </div>
        <div className="bg-white/5 border border-white/5 px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
          <div className="flex -space-x-4">
            {achievements.filter(a => a.unlocked).slice(0, 5).map(a => (
              <div key={a.id} className="h-12 w-12 rounded-full bg-black border-2 border-primary/20 flex items-center justify-center text-2xl shadow-2xl relative group-hover:z-10 transition-all">
                {a.icon}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs tracking-[0.1em] text-primary">{unlockedCount} / {achievements.length}</span>
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 leading-none mt-1">Status_Unlocked</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-10 rounded-[3rem] border transition-all flex items-center justify-between group overflow-hidden relative ${achievement.unlocked
                ? 'border-primary/30 bg-primary/5 shadow-2xl shadow-primary/5'
                : 'border-white/5 opacity-50 bg-white/5 grayscale'
              }`}
          >
            {/* Background Icon Watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none transition-transform group-hover:rotate-12 group-hover:scale-150 duration-1000">
              {achievement.unlocked ? <span className="text-[140px] leading-none">{achievement.icon}</span> : <Lock size={160} />}
            </div>

            <div className="flex items-center gap-8 relative z-10">
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl transition-all duration-700 group-hover:scale-110 ${achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-400 to-primary text-black shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                  : 'bg-muted text-muted-foreground border border-white/5'
                }`}>
                {achievement.unlocked ? achievement.icon : <Lock size={32} />}
              </div>
              <div className="space-y-2">
                <h3 className={`font-black text-2xl tracking-tighter leading-none uppercase italic transition-colors ${achievement.unlocked ? 'text-white group-hover:text-primary' : 'text-muted-foreground'
                  }`}>
                  {achievement.name}
                </h3>
                <p className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed max-w-[220px] uppercase tracking-wide italic">
                  "{achievement.description}"
                </p>
              </div>
            </div>

            {achievement.unlocked && (
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-black shadow-2xl shadow-primary/40 animate-in zoom-in duration-700 relative z-10">
                <CheckCircle2 size={24} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;