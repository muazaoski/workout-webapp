import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from './stores/workoutStore';
import { useAuthStore } from './stores/authStore';
import type { Workout } from './types/workout';
import ExerciseLibrary from './components/ExerciseLibrary';
import ActiveWorkout from './components/ActiveWorkout';
import AchievementModal from './components/AchievementModal';
import LevelProgress from './components/LevelProgress';
import Achievements from './components/Achievements';
import ChallengeCreator from './components/ChallengeCreator';
import AuthModal from './components/AuthModal';
import Button from './components/ui/Button';
import {
  Dumbbell,
  TrendingUp,
  Clock,
  Plus,
  BookOpen,
  Trash2,
  X,
  Trophy,
  Target,
  LogOut,
  User as UserIcon,
  Zap,
  LayoutDashboard,
  Dna,
  Calendar
} from 'lucide-react';

const App: React.FC = () => {
  const {
    currentWorkout,
    stats,
    startNewWorkout,
    workoutHistory,
    deleteWorkout,
    userLevel,
    showAchievementModal,
    recentAchievement,
    hideAchievementModal
  } = useWorkoutStore();

  const { isAuthenticated, logout } = useAuthStore();
  const [currentView, setCurrentView] = useState<'dashboard' | 'achievements' | 'challenges' | 'history'>('dashboard');
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-punk-black flex items-center justify-center p-4">
        <div className="scanline" />
        <AuthModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-punk-black text-punk-white relative overflow-x-hidden selection:bg-punk-yellow selection:text-punk-black font-mono">
      <div className="scanline" />

      {/* INDUSTRIAL OVERLAY TEXTURE */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* HEADER */}
      <header className="border-b-4 border-punk-white sticky top-0 bg-punk-black z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-punk-yellow p-1 -skew-x-12">
              <Dumbbell className="text-punk-black w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter sm:text-3xl">
              IRON <span className="text-punk-yellow">GRIT</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right mr-3">
              <div className="text-[9px] uppercase text-punk-yellow font-black leading-none tracking-widest">RANK: {userLevel.title}</div>
              <div className="text-xs font-black uppercase">LEVEL_{userLevel.level}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="p-2 border-punk-white/10 hover:border-punk-yellow hover:text-punk-yellow">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* TACTICAL NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-punk-black border-t-4 border-punk-white z-40 sm:bottom-auto sm:top-[76px] sm:left-4 sm:right-auto sm:w-20 sm:border-r-4 sm:border-l-4 sm:border-t-4 sm:h-[calc(100vh-100px)] sm:flex-col flex justify-around py-2 sm:justify-center sm:gap-8 px-4 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <NavIcon icon={<LayoutDashboard />} label="DASH" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
        <NavIcon icon={<Zap />} label="WORK" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
        <NavIcon icon={<Trophy />} label="WINS" active={currentView === 'achievements'} onClick={() => setCurrentView('achievements')} />
        <NavIcon icon={<Target />} label="GOAL" active={currentView === 'challenges'} onClick={() => setCurrentView('challenges')} />
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6 pb-28 sm:pl-28 sm:pt-10">
        <AnimatePresence mode="wait">
          {currentWorkout ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ActiveWorkout />
            </motion.div>
          ) : (
            <div className="space-y-12">
              {currentView === 'dashboard' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* HERO: START WORKOUT */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 punk-card bg-punk-yellow !text-punk-black border-punk-black shadow-white">
                      <div className="relative z-10">
                        <h2 className="text-5xl font-black mb-1 italic tracking-tighter leading-none">NO_LIMIT <br />RAW_POWER</h2>
                        <p className="font-bold uppercase text-[10px] mb-8 opacity-80 decoration-2 tracking-widest">PROTOCOL: INTENSITY_MAX_LEVEL</p>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => startNewWorkout('SESSION_' + new Date().toLocaleDateString())}
                          className="bg-punk-black text-punk-white border-punk-black shadow-white hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                        >
                          INITIATE_SESSION
                        </Button>
                      </div>
                      <Dna className="absolute -right-12 -bottom-12 w-56 h-56 text-punk-black opacity-10 rotate-12" />
                    </div>

                    <div className="punk-card bg-punk-dark border-punk-yellow shadow-white">
                      <h3 className="text-[10px] font-black text-punk-yellow mb-5 border-b border-punk-yellow/30 w-full pb-1 tracking-[4px]">BIO_METRICS</h3>
                      <div className="space-y-5 font-mono">
                        <StatRow label="SESSIONS" value={stats.totalWorkouts} unit="CT" />
                        <StatRow label="MASS_MOVED" value={stats.totalVolume} unit="KG" />
                        <StatRow label="INTENSITY" value={stats.totalReps} unit="RP" />
                      </div>
                    </div>
                  </div>

                  {/* EVOLUTION TRACKER */}
                  <div className="punk-card border-dashed border-punk-white/40 shadow-none">
                    <h3 className="text-xs font-black mb-6 flex items-center gap-2 tracking-widest underline underline-offset-8 decoration-punk-yellow">
                      <TrendingUp size={14} className="text-punk-yellow" />
                      EVOLUTION_XP_STATUS
                    </h3>
                    <LevelProgress />
                  </div>

                  {/* QUICK ACCESS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <QuickAction icon={<BookOpen />} label="INDEX" onClick={() => setShowExerciseLibrary(true)} />
                    <QuickAction icon={<Target />} label="TARGETS" onClick={() => setCurrentView('challenges')} />
                    <QuickAction icon={<Clock />} label="LOGS" onClick={() => setCurrentView('history')} />
                    <QuickAction icon={<UserIcon />} label="USER_ID" onClick={() => { }} />
                  </div>
                </div>
              )}

              {currentView === 'history' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <header className="flex justify-between items-end border-b-4 border-punk-white pb-3">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">PHASE_<span className="text-punk-yellow">HISTORY</span></h2>
                    <span className="text-[10px] font-mono opacity-50 block mb-1">TOTAL_RECORDS: {workoutHistory.length}</span>
                  </header>
                  <div className="grid grid-cols-1 gap-4">
                    {workoutHistory.map((w) => (
                      <HistoryCard key={w.id} workout={w} onDelete={() => deleteWorkout(w.id)} />
                    ))}
                    {workoutHistory.length === 0 && (
                      <div className="text-center py-24 border-4 border-dashed border-punk-white/10">
                        <p className="opacity-20 uppercase font-black tracking-[10px]">MEMORY_BANK_EMPTY</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentView === 'achievements' && <Achievements />}
              {currentView === 'challenges' && <ChallengeCreator />}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* TACTICAL DRAWER: EXERCISE LIBRARY */}
      <AnimatePresence>
        {showExerciseLibrary && (
          <>
            <motion.div
              className="fixed inset-0 bg-punk-black/95 backdrop-blur-md z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExerciseLibrary(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-punk-dark border-l-4 border-punk-white z-[70] p-8 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            >
              <div className="flex justify-between items-center mb-10 border-b-2 border-punk-yellow/50 pb-5">
                <h2 className="text-3xl italic tracking-tighter">EXERCISE_<span className="text-punk-yellow">SCHEMA</span></h2>
                <Button variant="ghost" size="sm" onClick={() => setShowExerciseLibrary(false)} className="p-1 border-none hover:text-punk-yellow">
                  <X size={32} />
                </Button>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-160px)] pr-2 custom-scrollbar">
                <ExerciseLibrary />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AchievementModal
        achievement={recentAchievement}
        isVisible={showAchievementModal}
        onClose={hideAchievementModal}
      />
    </div>
  );
};

// PUNK COMPONENT: NAV ICON
const NavIcon = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center transition-all group ${active ? 'text-punk-yellow' : 'text-punk-white opacity-40 hover:opacity-100'}`}
  >
    <div className={`p-2 transition-all duration-75 ${active ? 'bg-punk-yellow text-punk-black shadow-white -translate-y-1' : 'group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[2px_2px_0_white] group-hover:border-2 group-hover:border-punk-white'}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-[9px] font-black mt-2 uppercase tracking-widest">{label}</span>
  </button>
);

// PUNK COMPONENT: STAT ROW
const StatRow = ({ label, value, unit }: { label: string, value: any, unit: string }) => (
  <div className="flex justify-between items-end border-b-2 border-punk-white/5 pb-2">
    <span className="text-[9px] uppercase font-black opacity-40 tracking-widest">{label}</span>
    <div className="text-right">
      <span className="text-2xl font-black italic mr-1 tabular-nums">{value}</span>
      <span className="text-[8px] opacity-30 uppercase font-black">{unit}</span>
    </div>
  </div>
);

// PUNK COMPONENT: QUICK ACTION
const QuickAction = ({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="punk-card flex flex-col items-center justify-center aspect-square hover:bg-punk-yellow hover:text-punk-black transition-all group border-punk-white/10 shadow-none hover:shadow-white active:scale-95"
  >
    <div className="mb-3 group-hover:scale-110 transition-transform">{React.cloneElement(icon, { size: 28 })}</div>
    <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

// PUNK COMPONENT: HISTORY CARD
const HistoryCard = ({ workout, onDelete }: { workout: Workout, onDelete: () => void }) => (
  <div className="punk-card bg-punk-gray/30 border-punk-white/10 hover:border-punk-yellow hover:shadow-yellow transition-all flex justify-between items-center group">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-punk-black flex flex-col items-center justify-center border-2 border-punk-white font-black leading-none group-hover:border-punk-yellow transition-colors">
        <span className="text-[10px] opacity-40 mb-1">{workout.startTime ? new Date(workout.startTime).toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '??'}</span>
        <span className="text-lg italic">{workout.startTime ? new Date(workout.startTime).getDate() : '??'}</span>
      </div>
      <div>
        <h4 className="text-xl italic leading-none group-hover:text-punk-yellow transition-colors mb-2 uppercase font-black">{workout.name}</h4>
        <div className="flex gap-4 text-[9px] font-mono tracking-widest">
          <span className="flex items-center gap-1"><BookOpen size={10} /> {workout.exercises.length}_EXR</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {workout.duration || 0}_MIN</span>
        </div>
      </div>
    </div>
    <div className="flex gap-3">
      <Button variant="ghost" size="sm" onClick={onDelete} className="p-2 border-none text-red-500 hover:bg-red-500/10 hover:text-red-500">
        <Trash2 size={20} />
      </Button>
    </div>
  </div>
);

export default App;