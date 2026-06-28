import { create } from 'zustand'
import { logout as apiLogout, getMe } from '../api/auth'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),

  login(userData) {
    if (userData.access_token) {
      localStorage.setItem('access_token', userData.access_token)
      set({ user: userData, token: userData.access_token })
    } else {
      set({ user: userData })
    }
  },

  logout() {
    localStorage.removeItem('access_token')
    set({ user: null, token: null })
  },

  async restoreSession() {
    // Implement logic to restore session using the stored token if needed, 
    // or just clear if token is invalid.
  },
}))

export default useAuthStore
