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
  Plus,
  Dumbbell,
  Search,
  Settings,
  User as UserIcon,
  ChevronRight
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'history' | 'achievements' | 'challenges'>('dashboard');
  const [showLibrary, setShowLibrary] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 dark:bg-slate-950">
        <AuthModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-50">
      {/* NAVIGATION - MODERN SIDEBAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-3 px-6 sm:bottom-auto sm:top-0 sm:left-0 sm:w-64 sm:h-full sm:border-r sm:border-t-0 sm:py-8 sm:px-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex sm:flex-col justify-between h-full">
          <div className="flex sm:flex-col gap-6 w-full items-center sm:items-stretch">
            <div className="hidden sm:flex items-center gap-3 px-4 mb-8">
              <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center dark:bg-white dark:text-black">
                <Dumbbell size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight">Workout Counter</span>
            </div>

            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
            <NavItem icon={<History size={20} />} label="History" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
            <NavItem icon={<Trophy size={20} />} label="Awards" active={currentView === 'achievements'} onClick={() => setCurrentView('achievements')} />
            <NavItem icon={<Target size={20} />} label="Challenges" active={currentView === 'challenges'} onClick={() => setCurrentView('challenges')} />
          </div>

          <div className="hidden sm:flex flex-col gap-4 px-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center dark:bg-slate-700">
                <UserIcon size={18} className="text-slate-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate leading-none">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 mt-1">Free Tier</p>
              </div>
            </div>
            <Button variant="ghost" fullWidth onClick={logout} className="justify-start text-slate-500 hover:text-red-500">
              <LogOut size={18} className="mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-8 pb-32 sm:pl-72 sm:pt-12 sm:pb-12">
        <AnimatePresence mode="wait">
          {currentWorkout ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <ActiveWorkout />
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* TOP HEADER FOR MOBILE/MD */}
              <div className="flex items-center justify-between sm:hidden mb-6">
                <span className="font-bold text-xl">Dashboard</span>
                <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center">
                  <Dumbbell size={18} />
                </div>
              </div>

              {currentView === 'dashboard' && (
                <div className="space-y-8 fade-in">
                  <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">Progress Overview</h2>
                      <p className="text-slate-500">Tracking your evolution every single day.</p>
                    </div>
                    <Button onClick={() => startNewWorkout('Workout ' + new Date().toLocaleDateString())} className="rounded-full shadow-lg shadow-black/10">
                      <Plus size={18} className="mr-2" /> Start New Session
                    </Button>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Workouts" value={stats.totalWorkouts} />
                    <StatCard label="Total Volume" value={`${(stats.totalVolume / 1000).toFixed(1)}k`} unit="kg" />
                    <StatCard label="Total Reps" value={stats.totalReps} />
                    <StatCard label="Current Level" value={userLevel.level} />
                  </div>

                  <Card title="Current Level" description="Gain XP to level up your rank.">
                    <LevelProgress />
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Quick Actions" className="md:col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        <ActionTile icon={<Search size={20} />} label="Browse Library" onClick={() => setShowLibrary(true)} />
                        <ActionTile icon={<Settings size={20} />} label="Account Settings" onClick={() => { }} />
                      </div>
                    </Card>
                    <Card title="Sync Status" description="Cloud backup active.">
                      <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Connected
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {currentView === 'history' && (
                <div className="space-y-6 fade-in">
                  <header>
                    <h2 className="text-3xl font-bold tracking-tight">Workout History</h2>
                    <p className="text-slate-500">{workoutHistory.length} sessions recorded</p>
                  </header>
                  <div className="grid grid-cols-1 gap-3">
                    {workoutHistory.map(w => (
                      <div key={w.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800 text-slate-500">
                            <History size={20} />
                          </div>
                          <div>
                            <p className="font-semibold">{w.name}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(w.startTime).toLocaleDateString()} • {w.duration || 0} mins • {w.exercises.length} Exercises
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="group">
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                        </Button>
                      </div>
                    ))}
                    {workoutHistory.length === 0 && (
                      <div className="text-center py-20 bg-slate-100 rounded-2xl dark:bg-slate-900">
                        <p className="text-slate-500 italic">No workouts saved yet. Time to start training!</p>
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

      {/* DRAWER FOR LIBRARY */}
      <AnimatePresence>
        {showLibrary && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-black/60"
              onClick={() => setShowLibrary(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] z-[60] bg-white border-l shadow-2xl p-8 dark:bg-slate-950 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Exercise Database</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowLibrary(false)}>✕</Button>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-160px)] no-scrollbar">
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
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active
        ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
  >
    {icon}
    <span className="sm:block hidden">{label}</span>
  </button>
);

const StatCard = ({ label, value, unit }: { label: string, value: any, unit?: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
    <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      {unit && <span className="text-xs text-slate-400 font-bold">{unit}</span>}
    </div>
  </div>
);

const ActionTile = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all dark:bg-slate-800 dark:border-slate-700"
  >
    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center dark:bg-slate-700">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default App;