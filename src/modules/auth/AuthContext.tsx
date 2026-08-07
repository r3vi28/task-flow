import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { getUser, logout as authLogout, saveSession } from './authService';
import type { AuthUser, LoginResponse } from '../../types/auth';

interface AuthContextType {
  user: AuthUser | null
  login: (response: LoginResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
  }, [])

  const handleLogin = (response: LoginResponse) => {
    saveSession(response.token, response.user)
    setUser(response.user)
  }

  const handleLogout = () => {
    authLogout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    login: handleLogin,
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
