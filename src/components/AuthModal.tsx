import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import Button from './ui/Button';
import Input from './ui/Input';
import { Mail, Lock, User, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, register, isLoading, error, clearError } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            await login(email, password);
        } else {
            await register(email, password, name);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="w-full max-w-[440px] mx-auto p-4 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-10 space-y-4">
                <div className="relative inline-block">
                    {/* Pulsing Aura */}
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse-slow" />

                    <div className="relative h-20 w-20 items-center justify-center rounded-[2rem] bg-primary flex shadow-[0_0_40px_rgba(250,204,21,0.4)] border-4 border-black/20">
                        <Zap size={40} className="text-black fill-black" />
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">ATHLETE_CORE</h1>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-80">Centralized_Identity_Hub</p>
                </div>
            </div>

            <div className="glass-card !bg-black/60 border-white/5 p-10 !rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <Input
                            label="Athlete Designation"
                            placeholder="OPERATOR_01"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={<User size={20} />}
                            required
                            className="bg-white/5 border-transparent h-16 font-bold uppercase tracking-tight"
                        />
                    )}
                    <Input
                        label="Neural_Link (Email)"
                        type="email"
                        placeholder="identity@grid.net"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={20} />}
                        required
                        className="bg-white/5 border-transparent h-16 font-bold"
                    />
                    <Input
                        label="Override_Key (Password)"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={20} />}
                        required
                        className="bg-white/5 border-transparent h-16 font-bold"
                    />

                    {error && (
                        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-4 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                            {error}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        type="submit"
                        loading={isLoading}
                        className="h-20 text-2xl font-black italic tracking-tighter rounded-[2rem] shadow-2xl shadow-primary/30 glow-primary"
                    >
                        {isLogin ? 'INITIALIZE_SYNC' : 'REGISTER_PROTOCOL'}
                    </Button>
                </form>

                <div className="mt-10 text-center pt-8 border-t border-white/5">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            clearError();
                        }}
                        className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-3 mx-auto italic"
                    >
                        {isLogin ? "Status: No redundant ID? -> REGISTER" : "Status: ID detected? -> AUTHENTICATE"}
                    </button>
                </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                <ShieldCheck size={14} className="text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                    Secure_Link_Established
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
