import React from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';
import Card, { CardContent } from './ui/Card';

const Achievements: React.FC = () => {
  const { achievements, unlockedAchievements } = useWorkoutStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <header className="flex justify-between items-end border-b-4 border-punk-white pb-3">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">THE_<span className="text-punk-yellow">ARCHIVE</span></h2>
        <span className="text-[10px] font-mono opacity-50 block mb-1">UNLOCKED: {unlockedAchievements.length}_OF_{achievements.length}</span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`punk-card border-2 transition-all group ${isUnlocked
                  ? 'bg-punk-gray border-punk-yellow shadow-white hover:scale-[1.02]'
                  : 'bg-punk-black opacity-40 border-punk-white/10 grayscale'
                }`}
            >
              <div className="relative mb-6">
                <div className={`w-16 h-16 mx-auto bg-punk-black border-2 flex items-center justify-center transition-all ${isUnlocked ? 'border-punk-yellow text-punk-yellow shadow-[4px_4px_0_white]' : 'border-punk-white/20 text-punk-white/20'
                  }`}>
                  {isUnlocked ? <Trophy size={32} /> : <Lock size={32} />}
                </div>
                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 bg-punk-yellow text-punk-black px-1 text-[8px] font-black italic border border-punk-black">
                    UNLOCKED_V1
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <h3 className={`text-lg font-black italic uppercase leading-tight ${isUnlocked ? 'text-punk-white' : 'text-punk-white/40'}`}>
                  {achievement.name}
                </h3>
                <p className="text-[10px] font-mono opacity-60 uppercase leading-relaxed h-10 overflow-hidden line-clamp-2 italic">
                  "{achievement.description}"
                </p>

                <div className="pt-4 mt-4 border-t border-punk-white/5 flex justify-between items-center">
                  <div className="text-[10px] font-black text-punk-yellow uppercase tracking-widest">VALUE</div>
                  <div className="text-sm font-black italic tabular-nums">+{achievement.xpReward} XP</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;