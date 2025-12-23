import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import Button from './ui/Button';
import Input from './ui/Input';
import { Zap, ShieldCheck, Mail, Lock, User } from 'lucide-react';

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
        <div className="w-full max-w-md space-y-12">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-brand-yellow mx-auto flex items-center justify-center">
                    <Zap size={32} className="text-brand-black" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">IRON_GRIT</h1>
                    <p className="text-[10px] font-bold text-brand-white/40 uppercase tracking-[0.4em]">AUTHENTICATION_REQUIRED</p>
                </div>
            </div>

            <div className="bg-brand-dark border-2 border-brand-white/5 p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {!isLogin && (
                        <Input
                            label="DISPLAY_NAME"
                            placeholder="OPERATOR_NAME"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={<User size={16} />}
                            required
                        />
                    )}
                    <Input
                        label="EMAIL_ADDRESS"
                        type="email"
                        placeholder="ID@MISSION.CONTROL"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={16} />}
                        required
                    />
                    <Input
                        label="ACCESS_CODE"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={16} />}
                        required
                    />

                    {error && (
                        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 text-red-500 text-[10px] font-bold tracking-widest uppercase">
                            ERROR: {error}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        type="submit"
                        loading={isLoading}
                    >
                        {isLogin ? 'AUTHORIZE_SESSION' : 'INITIALIZE_COMMAND'}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            clearError();
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-white/40 hover:text-brand-yellow transition-colors underline underline-offset-4 decoration-2"
                    >
                        {isLogin ? 'REQUEST_NEW_IDENTIFIER' : 'RETURN_TO_LOGIN'}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 opacity-20">
                <ShieldCheck size={14} />
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase">ENCRYPTED_DATA_TRANSMISSION</span>
            </div>
        </div>
    );
};

export default AuthModal;
