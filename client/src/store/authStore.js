import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken })
        return data.user
      },

      register: async (payload) => {
        const { data } = await api.post('/auth/register', payload)
        set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken })
        return data.user
      },

      logout: async () => {
        try { await api.post('/auth/logout') } catch {}
        set({ user: null, accessToken: null, refreshToken: null })
      },

      updateUser: (user) => set({ user }),
      setTokens: (accessToken) => set({ accessToken }),
    }),
    { name: 'devlink-auth', partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken }) }
  )
)

export default useAuthStore
