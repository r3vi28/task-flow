import axios from 'axios'
import type { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      // Skip Authorization header for auth endpoints used for login and register
      if (config.url && (config.url.endsWith('/auth/login') || config.url.endsWith('/auth/register'))) {
        delete config.headers.Authorization
      }
    return config
  },
  (error) => Promise.reject(error),
)

export default api