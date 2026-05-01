import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({
            user: data.data.user,
            token: data.data.token,
            isAuthenticated: true,
          })
          return { success: true }
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.error || 'Erro ao fazer login',
          }
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      getToken: () => get().token,
    }),
    {
      name: 'destak-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)