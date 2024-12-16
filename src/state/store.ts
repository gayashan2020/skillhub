// src/state/store.ts
import { create } from "zustand";

// Define the shape of the state
interface AuthState {
  user: { id: string; name: string } | null;
  token: string | null;
  setUser: (user: { id: string; name: string } | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
}

// Create Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null }),
}));
