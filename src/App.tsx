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
import Input from './components/ui/Input';
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
  ChevronRight,
  Zap,
  Flame,
  Activity,
  User,
  Mail,
  Trash2
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
    hideAchievementModal,
    deleteWorkout
  } = useWorkoutStore();

  const { isAuthenticated, logout, user } = useAuthStore();
  const [currentView, setCurrentView] = useState<'dashboard' | 'history' | 'achievements' | 'challenges' | 'settings'>('dashboard');
  const [showLibrary, setShowLibrary] = useState(false);

  // Safety cleanup for old gritty labels
  React.useEffect(() => {
    const title = userLevel.title.toLowerCase();
    if (title.includes('protocol') || title.includes('matrix')) {
      useWorkoutStore.getState().calculateLevel();
    }
  }, [userLevel.title]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <AuthModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* SIDE NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-white/5 py-4 px-6 sm:bottom-auto sm:top-0 sm:left-0 sm:w-72 sm:h-full sm:border-r sm:border-t-0 sm:py-10 sm:px-8">
        <div className="flex sm:flex-col justify-between h-full max-w-6xl mx-auto">
          <div className="flex sm:flex-col gap-8 w-full items-center sm:items-stretch">
            <div className="hidden sm:flex items-center gap-4 px-2 mb-10">
              <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Dumbbell size={24} className="text-black" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight leading-none">Workout</span>
                <span className="text-primary text-xs font-bold uppercase tracking-widest mt-1">Counter</span>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full">
              <NavItem icon={<LayoutDashboard size={22} />} label="Overview" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
              <NavItem icon={<History size={22} />} label="History" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
              <NavItem icon={<Trophy size={22} />} label="Badges" active={currentView === 'achievements'} onClick={() => setCurrentView('achievements')} />
              <NavItem icon={<Target size={22} />} label="Challenges" active={currentView === 'challenges'} onClick={() => setCurrentView('challenges')} />
              <NavItem icon={<Settings size={22} />} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
            </div>
          </div>

          <div className="hidden sm:flex flex-col gap-6 mt-auto">
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <User size={20} className="text-black" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-sm truncate">{user?.name || 'Athlete'}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Level {userLevel.level}</span>
              </div>
            </div>
            <Button variant="ghost" fullWidth onClick={logout} className="justify-start text-muted-foreground hover:text-red-400">
              <LogOut size={20} className="mr-3" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-32 sm:pl-[21rem] sm:pt-16 sm:pb-16">
        <AnimatePresence mode="wait">
          {currentWorkout ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ActiveWorkout onOpenLibrary={() => setShowLibrary(true)} />
            </motion.div>
          ) : (
            <div className="space-y-10">
              {currentView === 'dashboard' && (
                <div className="space-y-10 fade-in">
                  <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-extrabold tracking-tight">Daily Progress</h2>
                      <p className="text-muted-foreground text-lg mt-2 font-medium">Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}.</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => startNewWorkout('Workout ' + new Date().toLocaleDateString())}
                      className="rounded-3xl px-8"
                    >
                      <Plus size={20} className="mr-2" /> Start Session
                    </Button>
                  </header>

                  {/* STATS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardStat icon={<Zap className="text-primary" />} label="Workouts" value={stats.totalWorkouts} subtitle="sessions completed" />
                    <DashboardStat icon={<Flame className="text-primary" />} label="Volume" value={(stats.totalVolume / 1000).toFixed(1)} unit="T" subtitle="tons moved" />
                    <DashboardStat icon={<Activity className="text-primary" />} label="Total Reps" value={stats.totalReps} subtitle="completed reps" />
                  </div>

                  {/* LEVEL SECTION */}
                  <Card title="Your Level" description="Gain experience by completing workouts and winning challenges.">
                    <LevelProgress />
                  </Card>

                  {/* QUICK ACTIONS */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold px-1">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <ActionCard
                        icon={<Dumbbell className="text-primary" />}
                        label="Exercise Library"
                        description="Browse 100+ exercises with instructions."
                        onClick={() => setShowLibrary(true)}
                      />
                      <ActionCard
                        icon={<Plus className="text-primary" />}
                        label="Log Manually"
                        description="Add a past workout to your history."
                        onClick={() => { }}
                      />
                      <ActionCard
                        icon={<Settings className="text-muted-foreground" />}
                        label="Settings"
                        description="Manage account and preferences."
                        onClick={() => setCurrentView('settings')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'history' && (
                <div className="space-y-8 fade-in">
                  <header>
                    <h2 className="text-3xl font-bold tracking-tight">Workout Logs</h2>
                    <p className="text-muted-foreground mt-1">Review your past performance and consistency.</p>
                  </header>
                  <div className="grid grid-cols-1 gap-4">
                    {workoutHistory.map(w => (
                      <Card key={w.id} className="group hover:bg-white/5 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-black transition-colors">
                              <History size={24} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-lg">{w.name}</p>
                              <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <span>{new Date(w.startTime).toLocaleDateString()}</span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span>{w.duration || 0} mins</span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span>{w.exercises.length} Exercises</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteWorkout(w.id)}
                              className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                            >
                              <Trash2 size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                              <ChevronRight size={20} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {workoutHistory.length === 0 && (
                      <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                        <History size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                        <p className="text-muted-foreground font-medium italic">Empty logbook. Time to put in the work.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentView === 'achievements' && <Achievements />}
              {currentView === 'challenges' && <ChallengeCreator />}
              {currentView === 'settings' && <SettingsView />}
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
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
              onClick={() => setShowLibrary(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] z-[60] bg-background border-l border-white/5 shadow-2xl p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-extrabold tracking-tight">Database</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowLibrary(false)} className="rounded-full">
                  ✕
                </Button>
              </div>
              <div className="flex-grow overflow-y-auto no-scrollbar pr-2">
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
    className={`flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-bold transition-all relative ${active
      ? 'text-black bg-primary shadow-lg shadow-primary/20'
      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
      }`}
  >
    {icon}
    <span className="sm:block hidden">{label}</span>
  </button>
);

const DashboardStat = ({ icon, label, value, unit, subtitle }: { icon: React.ReactNode, label: string, value: any, unit?: string, subtitle: string }) => (
  <div className="glass-card p-8">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-extrabold tracking-tight">{value}</span>
      {unit && <span className="text-xl font-bold text-primary">{unit}</span>}
    </div>
    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-2 opacity-30">{subtitle}</p>
  </div>
);

const ActionCard = ({ icon, label, description, onClick }: { icon: React.ReactNode, label: string, description: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="glass-card p-8 text-left group hover:scale-[1.02] active:scale-95 transition-all outline-none focus:ring-2 focus:ring-primary"
  >
    <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
    </div>
    <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{label}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </button>
);

const SettingsView = () => {
  const { user } = useAuthStore();
  return (
    <div className="space-y-8 animate-in fade-in">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your profile and workout preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Profile Information" description="Personal details.">
            <div className="space-y-6 mt-4">
              <Input label="Display Name" defaultValue={user?.name || ''} icon={<UserIcon size={18} />} />
              <Input label="Email Address" type="email" defaultValue={user?.email || ''} icon={<Mail size={18} />} disabled />
              <Button className="w-fit">Save Changes</Button>
            </div>
          </Card>

          <Card title="Appearance" description="Personalize your workout interface.">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="space-y-1">
                <p className="font-semibold">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Force high-contrast dark theme.</p>
              </div>
              <div className="h-6 w-12 bg-primary rounded-full relative p-1 flex justify-end">
                <div className="h-4 w-4 bg-black rounded-full shadow-sm" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Subscription" description="Unlimited training.">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
              <Zap className="text-primary mx-auto mb-3" size={32} />
              <p className="font-bold text-primary">Pro Member</p>
              <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-wider leading-none">Standard Access</p>
            </div>
          </Card>

          <Card title="Danger Zone">
            <Button variant="danger" fullWidth className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none h-auto py-4 rounded-2xl">
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;