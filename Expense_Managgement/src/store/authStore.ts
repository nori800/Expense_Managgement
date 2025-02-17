import { create } from 'zustand';
import { mockAuthService } from '../services/mockAuth';

// 型定義
export type UserRole = 'admin' | 'approver' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const user = await mockAuthService.signIn(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const user = await mockAuthService.signUp(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  signOut: async () => {
    set({ loading: true });
    try {
      await mockAuthService.signOut();
      set({ user: null, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading })
})); 