import { create } from 'zustand'
import { logout as apiLogout, getMe } from '../api/auth'

const useAuthStore = create((set) => ({
  user: null,

  login(userData) {
    set({ user: userData })
  },

  async logout() {
    try {
      await apiLogout()
    } finally {
      set({ user: null })
    }
  },

  async restoreSession() {
    try {
      const res = await getMe()
      set({ user: res.data })
    } catch {
      set({ user: null })
    }
  },
}))

export default useAuthStore
