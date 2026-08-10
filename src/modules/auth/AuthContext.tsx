import React, { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { getUser, logout as authLogout, saveSession } from './authService';
import type { AuthUser, LoginResponse } from '../../types/auth';

interface AuthContextType {
  user: AuthUser | null
  login: (data: LoginResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getUser())

  const handleLogin = (data: LoginResponse) => {
    saveSession(data.token, data.user)
    setUser(data.user)
  }

  const handleLogout = () => {
    authLogout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    login: (data: LoginResponse) => handleLogin(data),
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
