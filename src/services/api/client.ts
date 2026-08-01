import axios from 'axios'

/**
 * Axios instance — swap BASE_URL when backend is ready.
 * All endpoints use this client so migration = 1 change.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://apifitnflai.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// Request interceptor: attach JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)
