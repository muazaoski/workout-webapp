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
import Card from './components/ui/Card';
import {
  LayoutDashboard,
  Trophy,
  Target,
  History,
  LogOut,
  Dumbbell,
  Plus,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';

const App: React.FC = () => {
  const {
    currentWorkout,
    stats,
    startNewWorkout,
    workoutHistory,
    userLevel,
    showAchievementModal,
    recentAchievement,
    hideAchievementModal
  } = useWorkoutStore();

  const { isAuthenticated, logout, user } = useAuthStore();
  const [currentView, setCurrentView] = useState<'dashboard' | 'achievements' | 'challenges' | 'history'>('dashboard');
  const [showLibrary, setShowLibrary] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
        <AuthModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-white font-sans selection:bg-brand-yellow selection:text-brand-black">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-brand-black/80 backdrop-blur-md border-b-2 border-brand-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-yellow flex items-center justify-center">
              <Dumbbell className="text-brand-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase leading-none">IRON_GRIT</h1>
              <p className="text-[10px] font-bold text-brand-yellow tracking-widest uppercase mt-0.5">EST. 2025</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black text-brand-white/40 uppercase tracking-widest leading-none mb-1">CURRENT_RANK</p>
              <p className="text-sm font-black uppercase">LVL_{userLevel.level} {userLevel.title}</p>
            </div>
            <button onClick={logout} className="p-2 text-brand-white/40 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-black border-t-2 border-brand-white/5 sm:bottom-auto sm:top-20 sm:left-0 sm:w-64 sm:h-[calc(100vh-80px)] sm:border-r-2 sm:border-t-0 p-4">
        <div className="flex sm:flex-col justify-around h-full">
          <div className="flex sm:flex-col gap-2 w-full">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="DASHBOARD"
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
            />
            <NavItem
              icon={<History size={20} />}
              label="LOGS"
              active={currentView === 'history'}
              onClick={() => setCurrentView('history')}
            />
            <NavItem
              icon={<Trophy size={20} />}
              label="AWARDS"
              active={currentView === 'achievements'}
              onClick={() => setCurrentView('achievements')}
            />
            <NavItem
              icon={<Target size={20} />}
              label="MISSION"
              active={currentView === 'challenges'}
              onClick={() => setCurrentView('challenges')}
            />
          </div>

          <div className="hidden sm:block mt-auto pt-6 border-t-2 border-brand-white/5">
            <div className="flex items-center gap-3 px-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-white/10 flex items-center justify-center">
                <UserIcon size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-white/40 leading-none mb-1">USER_SESSION</p>
                <p className="text-xs font-bold truncate">{user?.name || 'OPERATOR_01'}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-32 sm:pl-72 sm:pt-40">
        <AnimatePresence mode="wait">
          {currentWorkout ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <ActiveWorkout />
            </motion.div>
          ) : (
            <div className="space-y-12">
              {currentView === 'dashboard' && (
                <div className="space-y-12 fade-in">
                  {/* HERO STATS */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-2 !bg-brand-yellow !text-brand-black border-none relative overflow-hidden group">
                      <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">READY_FOR_DEPLOYMENT</p>
                          <h2 className="text-4xl font-black italic tracking-tighter leading-tight uppercase">START_NEW<br />SESSION</h2>
                        </div>
                        <Button
                          variant="secondary"
                          className="w-fit !bg-brand-black !text-brand-white hover:!bg-brand-white hover:!text-brand-black group-hover:px-10"
                          onClick={() => startNewWorkout('SESSION_' + new Date().toLocaleDateString())}
                        >
                          INITIATE <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </div>
                      <Dumbbell size={200} className="absolute -right-20 -bottom-20 opacity-5 rotate-12" />
                    </Card>

                    <Card title="WORKOUTS" subtitle="TOTAL_COUNT">
                      <div className="text-5xl font-black italic data-value">{stats.totalWorkouts}</div>
                    </Card>

                    <Card title="VOLUME" subtitle="MASS_KG">
                      <div className="text-5xl font-black italic data-value">{(stats.totalVolume / 1000).toFixed(1)}k</div>
                    </Card>
                  </div>

                  {/* LEVEL TRACKER */}
                  <Card title="EVOLUTION_PROGRESS" subtitle="XP_TRACKER">
                    <LevelProgress />
                  </Card>

                  {/* QUICK ACCESS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <QuickLink label="EXERCISES" onClick={() => setShowLibrary(true)} />
                    <QuickLink label="MESSAGES" onClick={() => { }} />
                    <QuickLink label="SETTINGS" onClick={() => { }} />
                    <QuickLink label="SYNC_DATA" onClick={() => { }} />
                  </div>
                </div>
              )}

              {currentView === 'history' && (
                <div className="space-y-6 fade-in">
                  <header className="flex justify-between items-end border-b-2 border-brand-white/10 pb-4">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">DATA_LOGS</h2>
                    <span className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest italic">{workoutHistory.length} RECORDS_FOUND</span>
                  </header>
                  <div className="grid grid-cols-1 gap-4">
                    {workoutHistory.map(w => (
                      <Card key={w.id} className="!p-4 bg-brand-dark hover:bg-brand-gray border-brand-white/5 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="text-center w-12 border-r-2 border-brand-white/10 pr-6 mr-6">
                              <p className="text-[10px] font-black text-brand-white/40 uppercase">{new Date(w.startTime).toLocaleDateString('en-US', { month: 'short' })}</p>
                              <p className="text-xl font-black italic leading-none">{new Date(w.startTime).getDate()}</p>
                            </div>
                            <div>
                              <h4 className="font-black italic uppercase tracking-tight text-lg mb-1">{w.name}</h4>
                              <p className="text-[10px] font-bold text-brand-white/40 uppercase tracking-widest">{w.exercises.length} EXERCISES // {w.duration || 0} MINS</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => { }} className="text-red-500/40 hover:text-red-500">
                            REMOVE
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {currentView === 'achievements' && <Achievements />}
              {currentView === 'challenges' && <ChallengeCreator />}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* EXERCISE LIBRARY OVERLAY */}
      <AnimatePresence>
        {showLibrary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-brand-black/90 backdrop-blur-xl"
              onClick={() => setShowLibrary(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] z-[60] bg-brand-black border-l-2 border-brand-white/10 p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">DATA_LIBRARY</h2>
                <Button variant="ghost" className="!p-1 border-none" onClick={() => setShowLibrary(false)}>CLOSE</Button>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar">
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

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`nav-item ${active ? 'nav-item-active' : 'nav-item-inactive'} whitespace-nowrap`}
  >
    {icon}
    <span className="sm:block hidden">{label}</span>
  </button>
);

const QuickLink = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <Button variant="outline" fullWidth className="!text-[10px] !tracking-[0.2em]" onClick={onClick}>
    {label}
  </Button>
);

export default App;