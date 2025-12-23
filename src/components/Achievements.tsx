import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import Card from './ui/Card';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';

const Achievements: React.FC = () => {
  const { achievements } = useWorkoutStore();

  return (
    <div className="space-y-10 fade-in">
      <header className="flex justify-between items-end border-b-2 border-brand-white/10 pb-4">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">SERVICE_AWARDS</h2>
        <span className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest italic">
          {achievements.filter(a => a.unlocked).length}/{achievements.length} UNLOCKED
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-6 border-2 transition-all flex items-center justify-between ${achievement.unlocked
                ? 'border-brand-yellow bg-brand-yellow/5'
                : 'border-brand-white/5 opacity-50 grayscale bg-brand-dark'
              }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 flex items-center justify-center text-3xl border-2 ${achievement.unlocked ? 'border-brand-yellow bg-brand-yellow text-brand-black' : 'border-brand-white/10 text-brand-white/20'
                }`}>
                {achievement.unlocked ? achievement.icon : <Lock size={20} />}
              </div>
              <div>
                <h3 className={`font-black uppercase italic italic tracking-tight leading-none mb-2 ${achievement.unlocked ? 'text-brand-yellow' : 'text-brand-white/40'
                  }`}>
                  {achievement.name}
                </h3>
                <p className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest leading-tight">
                  {achievement.description}
                </p>
              </div>
            </div>

            {achievement.unlocked && (
              <div className="text-brand-yellow">
                <CheckCircle2 size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;