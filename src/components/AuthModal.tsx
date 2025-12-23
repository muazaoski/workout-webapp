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
        <div className="w-full max-w-[400px] mx-auto p-4 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-10 space-y-3">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-xl shadow-primary/30">
                    <Sparkles size={32} className="text-black" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Workout Counter</h1>
                <p className="text-muted-foreground">Log your progress, reach your goals.</p>
            </div>

            <div className="glass-card !bg-card p-8 !rounded-[2.5rem]">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <Input
                            label="Full Name"
                            placeholder="Alex Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={<User size={18} />}
                            required
                            className="bg-white/5 border-transparent"
                        />
                    )}
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={18} />}
                        required
                        className="bg-white/5 border-transparent"
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={18} />}
                        required
                        className="bg-white/5 border-transparent"
                    />

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        type="submit"
                        loading={isLoading}
                        className="h-14 font-bold rounded-2xl"
                    >
                        {isLogin ? 'Sign In' : 'Join Now'}
                    </Button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            clearError();
                        }}
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        {isLogin ? "Need an account? Sign up" : "Already registered? Sign in"}
                    </button>
                </div>
            </div>

            <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-30">
                Secure & Encrypted Session
            </p>
        </div>
    );
};

export default AuthModal;
