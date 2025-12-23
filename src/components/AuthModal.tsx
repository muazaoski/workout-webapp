import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2, Dumbbell } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface AuthModalProps {
    isOpen: boolean;
    onClose?: () => void;
    showCloseButton?: boolean;
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, showCloseButton = false }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, register, isLoading, error, clearError } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (mode === 'login') {
            await login(email, password);
        } else {
            if (!name.trim()) {
                return;
            }
            await register(email, password, name);
        }
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        clearError();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-md overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700/50"
                >
                    {/* Close button */}
                    {showCloseButton && onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                        >
                            <X size={20} />
                        </button>
                    )}

                    {/* Header */}
                    <div className="p-6 pb-0 text-center">
                        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Dumbbell className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {mode === 'login'
                                ? 'Sign in to track your workouts'
                                : 'Start your fitness journey today'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {mode === 'register' && (
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                                </>
                            ) : (
                                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                            )}
                        </button>

                        {/* Switch mode */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={switchMode}
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                {mode === 'login'
                                    ? "Don't have an account? Sign up"
                                    : 'Already have an account? Sign in'}
                            </button>
                        </div>
                    </form>

                    {/* Footer decoration */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal;
