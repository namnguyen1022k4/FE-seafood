import axios from 'axios'

const api = axios.create({
  baseURL: 'https://remain-determination-mpg-feelings.trycloudflare.com',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? ''
    const isAuthCheck = url.includes('/auth/me')
    const skipRedirect = error.config?._skipAuthRedirect === true
    if (error.response?.status === 401 && !isAuthCheck && !skipRedirect) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
