import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { Mail, Lock, User, Github } from 'lucide-react';

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
        <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center gap-2 mb-4">
                <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center dark:bg-white dark:text-black">
                    <span className="font-black text-xl italic">WC</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                <p className="text-slate-500 text-sm">Sign in to sync your fitness journey.</p>
            </div>

            <Card className="shadow-2xl shadow-black/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <Input
                            label="What should we call you?"
                            placeholder="Alex Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={<User size={18} />}
                            required
                        />
                    )}
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={18} />}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={18} />}
                        required
                    />

                    {error && (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium">
                            <span className="flex-shrink-0">✕</span>
                            {error}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        type="submit"
                        loading={isLoading}
                        className="rounded-xl"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
                    <span className="relative bg-white px-2 text-xs text-slate-400 dark:bg-slate-900 lowercase italic">or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" icon={<Github size={18} />}>GitHub</Button>
                    <Button variant="outline" icon={<span>G</span>}>Google</Button>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            clearError();
                        }}
                        className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </Card>

            <p className="text-center text-xs text-slate-400">
                By continuing, you agree to our Terms of Service.
            </p>
        </div>
    );
};

export default AuthModal;
