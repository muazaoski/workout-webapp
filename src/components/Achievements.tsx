import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import Card from './ui/Card';
import { Trophy, Lock, CheckCircle2, Medal } from 'lucide-react';

const Achievements: React.FC = () => {
  const { achievements } = useWorkoutStore();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-8 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-amber-500">Hall of Fame</h2>
          <p className="text-slate-500 uppercase text-[10px] font-bold tracking-widest mt-1">Unlocked {unlockedCount} of {achievements.length} badges</p>
        </div>
        <div className="flex -space-x-2">
          {achievements.filter(a => a.unlocked).slice(0, 5).map(a => (
            <div key={a.id} className="h-8 w-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center shadow-sm text-sm">
              {a.icon}
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${achievement.unlocked
                ? 'border-amber-100 bg-amber-50/50 dark:border-amber-900/20 dark:bg-amber-900/5'
                : 'border-slate-100 opacity-60 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:scale-110 ${achievement.unlocked ? 'bg-amber-400 text-amber-950' : 'bg-slate-100 text-slate-300 dark:bg-slate-800'
                }`}>
                {achievement.unlocked ? achievement.icon : <Lock size={20} />}
              </div>
              <div>
                <h3 className={`font-bold text-base leading-tight ${achievement.unlocked ? 'text-amber-950 dark:text-amber-200' : 'text-slate-400'
                  }`}>
                  {achievement.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium italic">
                  "{achievement.description}"
                </p>
              </div>
            </div>

            {achievement.unlocked && (
              <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200">
                <CheckCircle2 size={12} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;