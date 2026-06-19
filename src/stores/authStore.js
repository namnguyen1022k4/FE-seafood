import { create } from 'zustand'
import { logout as apiLogout, getMe } from '../api/auth'

const useAuthStore = create((set) => ({
  user: null,

  login(userData) {
    if (userData.access_token) {
      document.cookie = `access_token=${userData.access_token}; path=/; max-age=86400; SameSite=Lax`
    }
    set({ user: userData })
  },

  async logout() {
    try {
      await apiLogout()
    } finally {
      document.cookie = 'access_token=; path=/; max-age=0'
      set({ user: null })
    }
  },

  async restoreSession() {
    try {
      const res = await getMe()
      set({ user: res.data })
    } catch {
      document.cookie = 'access_token=; path=/; max-age=0'
      set({ user: null })
    }
  },
}))

export default useAuthStore
