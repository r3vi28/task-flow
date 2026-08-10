import api from '../../services/api'
import type { LoginBody, RegisterBody, AuthUser, LoginResponse } from '../../types/auth'

export const saveSession = (token: string, user: AuthUser): void => {
  sessionStorage.setItem('token', token)
  sessionStorage.setItem('user', JSON.stringify(user))
}

export const getToken = (): string | null => {
  return sessionStorage.getItem('token')
}

export const getUser = (): AuthUser | null => {
const raw = sessionStorage.getItem('user')
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      // If stored data is invalid, clear it
      sessionStorage.removeItem('user')
      return null
    }
}

export const logout = (): void => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
}

export const login = async (data: LoginBody): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data)
  return response.data
}

export const register = async (data: RegisterBody): Promise<AuthUser> => {
  const response = await api.post<AuthUser>('/api/auth/register', data)
  return response.data
}
