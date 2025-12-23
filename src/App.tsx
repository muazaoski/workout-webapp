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
  Mail
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'history' | 'achievements' | 'challenges' | 'settings'>('dashboard');
  const [showLibrary, setShowLibrary] = useState(false);

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
                <span className="font-black text-xl tracking-tighter uppercase leading-none italic">Athlete</span>
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-1">Command_Center</span>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full">
              <NavItem icon={<LayoutDashboard size={22} />} label="Operational" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
              <NavItem icon={<History size={22} />} label="Archives" active={currentView === 'history'} onClick={() => setCurrentView('history')} />
              <NavItem icon={<Trophy size={22} />} label="Merit" active={currentView === 'achievements'} onClick={() => setCurrentView('achievements')} />
              <NavItem icon={<Target size={22} />} label="Objectives" active={currentView === 'challenges'} onClick={() => setCurrentView('challenges')} />
              <NavItem icon={<Settings size={22} />} label="Config" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
            </div>
          </div>

          <div className="hidden sm:flex flex-col gap-6 mt-auto">
            <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
              <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                <User size={22} className="text-black" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm truncate uppercase tracking-tight">{user?.name || 'Athlete'}</span>
                <span className="text-[9px] text-primary uppercase font-black tracking-widest leading-none mt-1">Lvl_{userLevel.level}</span>
              </div>
            </div>
            <Button variant="ghost" fullWidth onClick={logout} className="justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all px-6 py-4 rounded-2xl">
              <LogOut size={18} className="mr-3" /> Terminate_Session
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
              <ActiveWorkout />
            </motion.div>
          ) : (
            <div className="space-y-12">
              {currentView === 'dashboard' && (
                <div className="space-y-12 fade-in">
                  <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2 font-black text-[10px] text-primary uppercase tracking-[0.4em]">
                        <div className="h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                        System_Online
                      </div>
                      <h2 className="text-5xl font-black tracking-tighter uppercase italic">Overview_Matrix</h2>
                      <p className="text-muted-foreground text-xl mt-3 font-medium opacity-60">Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}. Ready for deployment?</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => startNewWorkout('Workout ' + new Date().toLocaleDateString())}
                      className="rounded-[2rem] px-10 h-20 text-2xl font-black italic tracking-tighter glow-primary group"
                    >
                      <Plus size={24} className="mr-3 group-hover:rotate-90 transition-transform" /> START_SESSION
                    </Button>
                  </header>

                  {/* STATS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <DashboardStat icon={<Zap className="text-primary" />} label="Engagements" value={stats.totalWorkouts} subtitle="sessions_logged" />
                    <DashboardStat icon={<Flame className="text-primary" />} label="Mass_Unit" value={(stats.totalVolume / 1000).toFixed(1)} unit="T" subtitle="metrical_tons" />
                    <DashboardStat icon={<Activity className="text-primary" />} label="Rep_Count" value={stats.totalReps} subtitle="neural_signals" />
                  </div>

                  {/* LEVEL SECTION */}
                  <Card title="Operational_Level" description="Experience metrics accumulated through rigorous training." className="border-primary/10 bg-black/40">
                    <LevelProgress />
                  </Card>

                  {/* QUICK ACTIONS */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black px-1 uppercase tracking-tighter italic">Quick_Operations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <ActionCard
                        icon={<Dumbbell className="text-primary" />}
                        label="Library_DB"
                        description="Access movement protocols and instructions."
                        onClick={() => setShowLibrary(true)}
                      />
                      <ActionCard
                        icon={<Plus className="text-primary" />}
                        label="Manual_Entry"
                        description="Log historical logs into the central grid."
                        onClick={() => { }}
                      />
                      <ActionCard
                        icon={<Settings className="text-muted-foreground" />}
                        label="System_Config"
                        description="Modify interface parameters and core settings."
                        onClick={() => setCurrentView('settings')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'history' && (
                <div className="space-y-10 fade-in">
                  <header>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">Mission_Archiv</h2>
                    <p className="text-muted-foreground mt-2 text-lg font-medium opacity-60">Review historical performance data and consistency logs.</p>
                  </header>
                  <div className="grid grid-cols-1 gap-6">
                    {workoutHistory.map(w => (
                      <Card key={w.id} className="group hover:bg-white/5 transition-all border-white/5 hover:border-primary/20 pointer-events-auto cursor-pointer p-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-8">
                            <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-inner">
                              <History size={28} />
                            </div>
                            <div className="space-y-2">
                              <p className="font-black text-xl uppercase tracking-tighter">{w.name}</p>
                              <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                                <span>{new Date(w.startTime).toLocaleDateString()}</span>
                                <span className="h-1 w-1 rounded-full bg-white/20" />
                                <span>{w.duration || 0} MINS</span>
                                <span className="h-1 w-1 rounded-full bg-white/20" />
                                <span>{w.exercises.length} UNITS</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl group-hover:text-primary group-hover:bg-primary/5 transition-all">
                            <ChevronRight size={28} />
                          </Button>
                        </div>
                      </Card>
                    ))}
                    {workoutHistory.length === 0 && (
                      <div className="text-center py-32 bg-white/5 border border-dashed border-white/10 rounded-[3rem] opacity-30 grayscale">
                        <History size={64} className="mx-auto text-muted-foreground mb-6" />
                        <p className="text-xl font-black uppercase tracking-widest">Archive_Corrupted / No Data found.</p>
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
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl"
              onClick={() => setShowLibrary(false)}
            />
            <motion.div
              initial={{ x: '1000px' }} animate={{ x: 0 }} exit={{ x: '1000px' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[600px] z-[60] bg-background border-l border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] p-12 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic">DATABASE</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.35em] mt-1">Selection_Module_v4.2</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowLibrary(false)} className="rounded-full h-12 w-12 hover:bg-red-500/10 hover:text-red-500">
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
    className={`flex items-center gap-5 px-6 py-4 rounded-[1.5rem] transition-all relative overflow-hidden group ${active
        ? 'text-black'
        : 'text-muted-foreground hover:text-white hover:bg-white/5'
      }`}
  >
    {active && (
      <motion.div
        layoutId="nav-pill"
        className="absolute inset-0 bg-primary shadow-[0_0_20px_rgba(250,204,21,0.4)] z-0"
      />
    )}
    <span className="relative z-10">{icon}</span>
    <span className="relative z-10 sm:block hidden text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

const DashboardStat = ({ icon, label, value, unit, subtitle }: { icon: React.ReactNode, label: string, value: any, unit?: string, subtitle: string }) => (
  <div className="glass-card p-10 bg-black/40 border-white/5 hover:border-primary/20 transition-all group">
    <div className="flex items-center gap-4 mb-6">
      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all">
        {icon}
      </div>
      <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.25em] group-hover:text-primary transition-colors">{label}</span>
    </div>
    <div className="flex items-baseline gap-3">
      <span className="text-5xl font-black tracking-tighter italic">{value}</span>
      {unit && <span className="text-2xl font-black text-primary italic">{unit}</span>}
    </div>
    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.4em] mt-3 opacity-20 group-hover:opacity-40 transition-opacity italic">{subtitle}</p>
  </div>
);

const ActionCard = ({ icon, label, description, onClick }: { icon: React.ReactNode, label: string, description: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="glass-card p-10 text-left group hover:scale-[1.03] active:scale-95 transition-all outline-none border-white/5 hover:border-primary/30 glow-primary bg-black/40 relative overflow-hidden"
  >
    <div className="absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 120 })}
    </div>
    <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 mb-8 group-hover:bg-primary group-hover:text-black transition-all relative z-10">
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
    </div>
    <h4 className="font-black text-2xl mb-3 tracking-tighter uppercase italic group-hover:text-primary transition-colors relative z-10">{label}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed relative z-10 font-medium opacity-60 group-hover:opacity-100">{description}</p>
  </button>
);

const SettingsView = () => {
  const { user } = useAuthStore();
  return (
    <div className="space-y-10 animate-in fade-in">
      <header>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">System_Config</h2>
        <p className="text-muted-foreground mt-2 text-lg font-medium opacity-60">Manage kernel parameters and athlete credentials.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card title="Athlete_ID" description="Identity parameters verified in the central grid." className="bg-black/40">
            <div className="space-y-8 mt-6">
              <Input label="System Name" defaultValue={user?.name || ''} icon={<UserIcon size={20} />} className="bg-white/5 border-transparent h-16 font-bold uppercase tracking-tight" />
              <Input label="Neural Network Address" type="email" defaultValue={user?.email || ''} icon={<Mail size={20} />} disabled className="bg-white/5 border-transparent h-16 opacity-40 italic" />
              <Button className="w-fit px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-xs">Sync_Updates</Button>
            </div>
          </Card>

          <Card title="Interface_Prefs" description="Visual tuning for high-stress training environments." className="bg-black/40">
            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
              <div className="space-y-1">
                <p className="font-black uppercase tracking-tighter text-lg italic">Stealth_Mode</p>
                <p className="text-xs text-muted-foreground font-medium opacity-60">Force global dark-spectrum aesthetics.</p>
              </div>
              <div className="h-8 w-16 bg-primary rounded-full relative p-1.5 flex justify-end shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                <div className="h-5 w-5 bg-black rounded-full" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-10">
          <Card title="Operational_Status" className="bg-black/40">
            <div className="p-8 rounded-[2rem] bg-primary/10 border border-primary/20 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary opacity-5 animate-pulse-slow" />
              <Zap className="text-primary mx-auto mb-4 relative z-10" size={48} />
              <p className="font-black text-3xl italic tracking-tighter text-primary uppercase relative z-10">Elite_Tier</p>
              <div className="h-px w-12 bg-primary/30 mx-auto my-4 transition-all group-hover:w-20 relative z-10" />
              <p className="text-[10px] text-primary uppercase font-black tracking-[0.4em] leading-none relative z-10">Full Access Authenticated</p>
            </div>
          </Card>

          <Card title="Destruction_Module" className="bg-black/40 border-red-500/10">
            <Button variant="danger" fullWidth className="bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white border-none h-20 text-xs font-black uppercase tracking-widest rounded-[2rem] transition-all">
              Terminate_Environment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;