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
  Settings,
  ChevronRight,
  Zap,
  Flame,
  Activity,
  User,
  Mail,
  Trash2,
  Maximize2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
    deleteWorkout,
    isMinimized,
    toggleMinimize,
    logManualWorkout,
    settings
  } = useWorkoutStore();

  const { updateWorkout, sync, _hasHydrated: workoutHydrated } = useWorkoutStore();
  const { isAuthenticated, logout, user, _hasHydrated: authHydrated } = useAuthStore();

  const [currentView, setCurrentView] = useState<'dashboard' | 'history' | 'achievements' | 'challenges' | 'settings'>('dashboard');
  const [showLibrary, setShowLibrary] = useState(false);
  const [showManualLog, setShowManualLog] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const handleNavClick = (view: typeof currentView) => {
    if (currentWorkout && !isMinimized && view !== currentView) {
      if (confirm('You have an active workout session. Would you like to minimize it and go to ' + view + '?')) {
        toggleMinimize(true);
        setCurrentView(view);
      }
    } else {
      setCurrentView(view);
    }
  };

  // Safety cleanup for old labels
  React.useEffect(() => {
    const title = userLevel.title.toLowerCase();
    if (title.includes('protocol') || title.includes('matrix')) {
      useWorkoutStore.getState().calculateLevel();
    }
  }, [userLevel.title]);

  // Cloud Sync on Authentication
  React.useEffect(() => {
    if (isAuthenticated) {
      sync();
    }
  }, [isAuthenticated, sync]);

  // Apply theme to document root
  React.useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [settings.theme]);

  // Prevent flash of login screen during hydration
  if (!authHydrated || !workoutHydrated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <div className="h-16 w-16 bg-primary rounded-3xl flex items-center justify-center animate-pulse shadow-2xl shadow-primary/40">
          <Zap size={32} className="text-black" />
        </div>
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground animate-pulse">Initializing Protocol</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <AuthModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-bottom-nav sm:hidden">
        <div className="bg-background border-t border-white/10 px-2 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <MobileNavItem
              icon={<LayoutDashboard size={20} />}
              label="Home"
              active={currentView === 'dashboard'}
              onClick={() => handleNavClick('dashboard')}
            />
            <MobileNavItem
              icon={<History size={20} />}
              label="History"
              active={currentView === 'history'}
              onClick={() => handleNavClick('history')}
            />
            <MobileNavItem
              icon={<Trophy size={20} />}
              label="Badges"
              active={currentView === 'achievements'}
              onClick={() => handleNavClick('achievements')}
            />
            <MobileNavItem
              icon={<Target size={20} />}
              label="Goals"
              active={currentView === 'challenges'}
              onClick={() => handleNavClick('challenges')}
            />
            <MobileNavItem
              icon={<Settings size={20} />}
              label="Settings"
              active={currentView === 'settings'}
              onClick={() => handleNavClick('settings')}
            />
            <button
              onClick={logout}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-red-400 hover:bg-red-500/10 active:scale-95 transition-all min-w-[48px]"
            >
              <LogOut size={20} />
              <span className="text-[10px] font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* DESKTOP SIDE NAVIGATION */}
      <nav className="hidden sm:flex fixed top-0 left-0 w-72 h-full z-40 flex-col bg-background/80 backdrop-blur-xl border-r border-white/5 py-10 px-8">
        <div className="flex items-center gap-4 px-2 mb-10">
          <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Dumbbell size={24} className="text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight leading-none">Workout</span>
            <span className="text-primary text-xs font-bold uppercase tracking-widest mt-1">Counter</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <NavItem icon={<LayoutDashboard size={22} />} label="Overview" active={currentView === 'dashboard'} onClick={() => handleNavClick('dashboard')} />
          <NavItem icon={<History size={22} />} label="History" active={currentView === 'history'} onClick={() => handleNavClick('history')} />
          <NavItem icon={<Trophy size={22} />} label="Badges" active={currentView === 'achievements'} onClick={() => handleNavClick('achievements')} />
          <NavItem icon={<Target size={22} />} label="Challenges" active={currentView === 'challenges'} onClick={() => handleNavClick('challenges')} />
          <NavItem icon={<Settings size={22} />} label="Settings" active={currentView === 'settings'} onClick={() => handleNavClick('settings')} />
        </div>

        {/* User Info and Logout - Desktop */}
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center overflow-hidden flex-shrink-0">
              {(() => {
                const pic = localStorage.getItem('profilePic');
                return pic ? (
                  <img src={pic} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-black" />
                );
              })()}
            </div>
            <div className="flex flex-col overflow-hidden flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate">{user?.name || 'Athlete'}</span>
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Lv{userLevel.level}</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{stats.totalWorkouts} workouts</span>
            </div>
          </div>
          <Button variant="ghost" fullWidth onClick={logout} className="justify-start text-muted-foreground hover:text-red-400">
            <LogOut size={20} className="mr-3" /> Sign Out
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-32 sm:pl-[21rem] sm:pt-16 sm:pb-16">
        <AnimatePresence mode="wait">
          {currentWorkout && !isMinimized ? (
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
                <div className="space-y-8 fade-in">
                  {/* Welcome Header with Profile */}
                  <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center overflow-hidden flex-shrink-0">
                        {(() => {
                          const pic = localStorage.getItem('profilePic');
                          return pic ? (
                            <img src={pic} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={32} className="text-black" />
                          );
                        })()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold">Hey, {user?.name?.split(' ')[0] || 'Athlete'}!</h2>
                          <span className="text-xs bg-primary text-black px-2 py-1 rounded-lg font-bold">Lv{userLevel.level}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Ready to crush your goals today?</p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => startNewWorkout('Workout ' + new Date().toLocaleDateString())}
                      className="rounded-2xl px-6 h-12"
                    >
                      <Plus size={20} className="mr-2" /> Start Workout
                    </Button>
                  </header>

                  {/* STATS GRID */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DashboardStat icon={<Zap className="text-primary" />} label="Workouts" value={stats.totalWorkouts} subtitle="total" />
                    <DashboardStat
                      icon={<Flame className="text-primary" />}
                      label="Volume"
                      value={settings.weightUnit === 'kg' ? (stats.totalVolume > 1000 ? (stats.totalVolume / 1000).toFixed(1) : stats.totalVolume) : (stats.totalVolume / 1000).toFixed(1)}
                      unit={settings.weightUnit === 'kg' ? (stats.totalVolume > 1000 ? 'T' : 'kg') : 'T'}
                      subtitle="lifted"
                    />
                    <DashboardStat icon={<Activity className="text-primary" />} label="Reps" value={stats.totalReps} subtitle="total" />
                    <DashboardStat icon={<Target className="text-primary" />} label="XP" value={userLevel.totalXP || 0} subtitle="earned" />
                  </div>

                  {/* PERFORMANCE & WEIGHT SECTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card title="Performance Trends" description="Total volume and repetitions over time.">
                        <div className="h-[300px] w-full mt-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.performanceLogs}>
                              <defs>
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                              <XAxis
                                dataKey="date"
                                stroke="#ffffff40"
                                fontSize={10}
                                tickFormatter={(str) => {
                                  const date = new Date(str);
                                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                }}
                              />
                              <YAxis stroke="#ffffff40" fontSize={10} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                itemStyle={{ color: '#facc15' }}
                              />
                              <Area type="monotone" dataKey="volume" stroke="#facc15" fillOpacity={1} fill="url(#colorVolume)" strokeWidth={3} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                    </div>

                    <div>
                      <Card title="Body Weight" description="Track your physique progress.">
                        <div className="h-[180px] w-full mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.bodyWeightLogs || []}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="date" hide />
                              <YAxis stroke="#ffffff40" fontSize={10} domain={['dataMin - 5', 'dataMax + 5']} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                itemStyle={{ color: '#facc15' }}
                              />
                              <Line type="monotone" dataKey="weight" stroke="#facc15" strokeWidth={2} dot={{ r: 4, fill: '#facc15' }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5">
                          <div className="flex gap-2">
                            <Input
                              placeholder="0.0"
                              type="number"
                              id="weight-input"
                              className="h-10 text-sm"
                            />
                            <Button
                              size="sm"
                              className="px-4"
                              onClick={() => {
                                const input = document.getElementById('weight-input') as HTMLInputElement;
                                const val = parseFloat(input.value);
                                if (val) {
                                  useWorkoutStore.getState().addBodyWeightLog(val);
                                  input.value = '';
                                }
                              }}
                            >
                              Log
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
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
                        onClick={() => setShowManualLog(true)}
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
                            <Button variant="ghost" size="icon" onClick={() => setEditingWorkout(w)} className="h-10 w-10 rounded-xl">
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

      {/* MINIMIZED WORKOUT BAR */}
      <AnimatePresence>
        {currentWorkout && isMinimized && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-6 right-6 sm:left-[20rem] sm:right-10 z-50"
          >
            <div className="bg-primary text-black p-4 rounded-3xl shadow-2xl flex items-center justify-between group cursor-pointer" onClick={() => toggleMinimize(false)}>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-black/10 flex items-center justify-center animate-pulse">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm leading-none">Workout in Progress</p>
                  <p className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">
                    {currentWorkout.exercises.length} Exercises Added
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="bg-black/5 hover:bg-black/10 rounded-full h-10 w-10">
                <Maximize2 size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MANUAL LOG MODAL */}
      <AnimatePresence>
        {showManualLog && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setShowManualLog(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-card border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
            >
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Manual Log</h2>
                <p className="text-muted-foreground mt-2">Log a workout from earlier.</p>
              </div>

              <div className="space-y-6">
                <Input label="Workout Name" placeholder="Afternoon Session" id="manual-name" />
                <Input label="Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} id="manual-date" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Duration (mins)" type="number" placeholder="45" id="manual-duration" />
                  <Input label="Exercises" type="number" placeholder="5" id="manual-exercises" />
                </div>
              </div>

              <div className="flex gap-4">
                <Button fullWidth onClick={() => {
                  const name = (document.getElementById('manual-name') as HTMLInputElement).value;
                  const duration = parseInt((document.getElementById('manual-duration') as HTMLInputElement).value);
                  const date = (document.getElementById('manual-date') as HTMLInputElement).value;

                  logManualWorkout({
                    id: Date.now().toString(),
                    name: name || 'Manual Workout',
                    startTime: new Date(date),
                    endTime: new Date(date),
                    duration: duration || 0,
                    exercises: [] // Simplified for manual log
                  });
                  setShowManualLog(false);
                }}>Save Workout</Button>
                <Button variant="ghost" onClick={() => setShowManualLog(false)}>Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT WORKOUT MODAL */}
      <AnimatePresence>
        {editingWorkout && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setEditingWorkout(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-card border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
            >
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Edit Session</h2>
                <p className="text-muted-foreground mt-2">Adjust workout details.</p>
              </div>

              <div className="space-y-6">
                <Input label="Workout Name" defaultValue={editingWorkout.name} id="edit-name" />
                <Input label="Date" type="date" defaultValue={new Date(editingWorkout.startTime).toISOString().split('T')[0]} id="edit-date" />
                <Input label="Duration (mins)" type="number" defaultValue={editingWorkout.duration} id="edit-duration" />
              </div>

              <div className="flex gap-4">
                <Button fullWidth onClick={() => {
                  const name = (document.getElementById('edit-name') as HTMLInputElement).value;
                  const duration = parseInt((document.getElementById('edit-duration') as HTMLInputElement).value);
                  const date = (document.getElementById('edit-date') as HTMLInputElement).value;

                  updateWorkout(editingWorkout.id, {
                    name: name || editingWorkout.name,
                    startTime: new Date(date),
                    endTime: new Date(date),
                    duration: duration || 0
                  });
                  setEditingWorkout(null);
                }}>Save Changes</Button>
                <Button variant="ghost" onClick={() => setEditingWorkout(null)}>Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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

const MobileNavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all active:scale-95 min-w-[48px] ${active
      ? 'text-primary'
      : 'text-muted-foreground'
      }`}
  >
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-primary text-black' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const DashboardStat = ({ icon, label, value, unit, subtitle }: { icon: React.ReactNode, label: string, value: string | number, unit?: string, subtitle: string }) => (
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
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 28 })}
    </div>
    <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{label}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </button>
);

const SettingsView = () => {
  const { user, token, logout } = useAuthStore();
  const { settings, updateSettings } = useWorkoutStore();
  const [profilePic, setProfilePic] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://workout.muazaoski.online/api';

  // Compress image before upload
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 150;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file);
      setProfilePic(compressed);
      localStorage.setItem('profilePic', compressed);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This will permanently delete your account and all data. This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/auth/delete`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        localStorage.clear();
        logout();
        alert('Account deleted successfully.');
      } else {
        alert('Failed to delete account. Please try again.');
      }
    } catch {
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Load saved profile pic
  React.useEffect(() => {
    const saved = localStorage.getItem('profilePic');
    if (saved) setProfilePic(saved);
  }, []);

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
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 w-20 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all overflow-hidden"
                >
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">Profile Photo</p>
                  <p className="text-xs text-muted-foreground">Click to upload (auto-compressed)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>
              <Input label="Display Name" defaultValue={user?.name || ''} icon={<User size={18} />} />
              <Input label="Email Address" type="email" defaultValue={user?.email || ''} icon={<Mail size={18} />} disabled />
              <Button className="w-fit">Save Changes</Button>
            </div>
          </Card>

          <Card title="Workout Units" description="Choose your preferred measurement system.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Weight Unit</p>
                <div className="flex gap-2">
                  {(['kg', 'lbs'] as const).map(u => (
                    <button
                      key={u}
                      onClick={() => updateSettings({ weightUnit: u })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${settings.weightUnit === u ? 'bg-primary border-primary text-black' : 'bg-white/5 border-transparent text-muted-foreground'}`}
                    >
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Distance Unit</p>
                <div className="flex gap-2">
                  {(['km', 'miles'] as const).map(u => (
                    <button
                      key={u}
                      onClick={() => updateSettings({ distanceUnit: u })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${settings.distanceUnit === u ? 'bg-primary border-primary text-black' : 'bg-white/5 border-transparent text-muted-foreground'}`}
                    >
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Appearance" description="Personalize your workout interface.">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="space-y-1">
                <p className="font-semibold">Theme Mode</p>
                <p className="text-xs text-muted-foreground">Adjust the visual style of the app.</p>
              </div>
              <div className="flex gap-2">
                {(['dark', 'light', 'system'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => updateSettings({ theme: t })}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${settings.theme === t ? 'bg-primary border-primary text-black' : 'bg-white/5 border-transparent text-muted-foreground'}`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Danger Zone">
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. All your workouts, stats, and progress will be permanently removed.
            </p>
            <Button
              variant="danger"
              fullWidth
              className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none h-auto py-4 rounded-2xl"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;