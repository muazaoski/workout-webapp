import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_URL = import.meta.env.PROD
    ? 'https://workout.muazaoski.online/api'
    : 'http://localhost:3001/api';

interface User {
    id: string;
    email: string;
    name: string;
    profilePicture?: string | null;
    createdAt: string;
}

interface UserStats {
    totalWorkouts: number;
    totalExercises: number;
    totalSets: number;
    totalReps: number;
    totalWeight: number;
    streak: number;
    lastWorkoutDate?: string;
    level: number;
    currentXP: number;
    totalXP: number;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    stats: UserStats | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    _hasHydrated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    fetchUserStats: () => Promise<void>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
    getAuthHeaders: () => { Authorization: string } | Record<string, never>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            stats: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            _hasHydrated: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        set({ error: data.error || 'Login failed', isLoading: false });
                        return false;
                    }

                    set({
                        user: data.data.user,
                        token: data.data.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    // Fetch user stats after login
                    get().fetchUserStats();
                    return true;
                } catch {
                    set({ error: 'Network error. Please try again.', isLoading: false });
                    return false;
                }
            },

            register: async (email: string, password: string, name: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password, name }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        const errorMsg = data.errors?.[0]?.msg || data.error || 'Registration failed';
                        set({ error: errorMsg, isLoading: false });
                        return false;
                    }

                    set({
                        user: data.data.user,
                        token: data.data.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return true;
                } catch {
                    set({ error: 'Network error. Please try again.', isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    stats: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            fetchUserStats: async () => {
                const { token } = get();
                if (!token) return;

                try {
                    const response = await fetch(`${API_URL}/user/stats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        set({ stats: data.data.stats });
                    }
                } catch (error) {
                    console.error('Failed to fetch user stats:', error);
                }
            },

            clearError: () => set({ error: null }),

            getAuthHeaders: () => {
                const { token } = get();
                if (token) {
                    return { Authorization: `Bearer ${token}` };
                }
                return {} as Record<string, never>;
            },

            refreshUser: async () => {
                const { token } = get();
                if (!token) return;

                try {
                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        set({ user: data.data.user });

                        // Sync profile picture to localStorage
                        if (data.data.user?.profilePicture) {
                            localStorage.setItem('profilePic', data.data.user.profilePicture);
                        }
                    }
                } catch (error) {
                    console.error('Failed to refresh user:', error);
                }
            },
        }),
        {
            name: 'workout-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) state._hasHydrated = true;
            },
        }
    )
);

export { API_URL };
