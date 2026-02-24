import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from 'firebase/auth'

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      clear: () => set({ user: null }),
    }),
    {
      name: 'kbeauty-auth',
      partialize: (state) => ({
        // Solo persistir datos básicos del usuario
        user: state.user
          ? {
              uid: state.user.uid,
              email: state.user.email,
              displayName: state.user.displayName,
              photoURL: state.user.photoURL,
            }
          : null,
      }),
    }
  )
)
