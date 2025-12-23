import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import Button from './ui/Button';
import Input from './ui/Input';
import { Mail, Lock, User, Dumbbell, Zap } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, register, isLoading, error } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            await login(email, password);
        } else {
            await register(name, email, password);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="w-full max-w-md punk-card border-4 border-punk-white bg-punk-dark shadow-yellow relative"
        >
            {/* DECORATIVE ELEMENTS */}
            <div className="absolute -top-6 -left-6 bg-punk-yellow text-punk-black p-2 -rotate-12 font-black italic text-xs border-2 border-punk-black z-10">
                PROTOCOL_V2.0
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-punk-yellow/5 -rotate-45 translate-x-12 -translate-y-12" />

            <div className="text-center mb-10 mt-4">
                <div className="inline-block bg-punk-yellow p-3 mb-4 -skew-x-12 border-2 border-punk-black shadow-white">
                    <Dumbbell className="text-punk-black w-10 h-10" />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                    SYSTEM_<span className="text-punk-yellow">{isLogin ? 'ACCESS' : 'ENROLL'}</span>
                </h2>
                <p className="text-[10px] font-mono text-punk-white/40 mt-2 tracking-[4px]">IDENTITY_VERIFICATION_REQUIRED</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <AnimatePresence mode="wait">
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Input
                                label="OPERATOR_NAME"
                                type="text"
                                placeholder="JACK_REACHER"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User size={18} />}
                                required
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Input
                    label="ACCESS_EMAIL"
                    type="email"
                    placeholder="OPERATOR@IRONGRIT.IO"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={18} />}
                    required
                />

                <Input
                    label="ENCRYPTION_KEY"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock size={18} />}
                    required
                />

                {error && (
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-3 flex items-start gap-3">
                        <div className="bg-red-500 text-white p-1 text-[10px] font-black italic">ERROR</div>
                        <p className="text-[10px] font-mono text-red-500 font-bold uppercase">{error}</p>
                    </div>
                )}

                <Button
                    fullWidth
                    variant="yellow"
                    size="lg"
                    type="submit"
                    loading={isLoading}
                    icon={<Zap size={20} />}
                >
                    {isLogin ? 'AUTHENTICATE' : 'INITIALIZE_ACCOUNT'}
                </Button>
            </form>

            <div className="mt-8 text-center border-t-2 border-punk-white/5 pt-6">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[10px] font-black uppercase tracking-widest text-punk-white/40 hover:text-punk-yellow transition-colors italic underline underline-offset-4 decoration-2"
                >
                    {isLogin ? 'NO_IDENTITY?_CREATE_NEW_PROFILE' : 'ALREADY_ENROLLED?_BACK_TO_LOGIN'}
                </button>
            </div>

            <div className="mt-6 flex justify-between items-center opacity-10">
                <div className="h-[1px] flex-grow bg-punk-white" />
                <span className="text-[8px] font-black mx-2">SECURE_CHANNEL_ESTABLISHED</span>
                <div className="h-[1px] flex-grow bg-punk-white" />
            </div>
        </motion.div>
    );
};

export default AuthModal;
