import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface AuthContextValue {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  logout: () => {},
});

const getUserFromStorage = (): User | null => {
  try {
    const raw = sessionStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextValue = { user, logout };
  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => useContext(AuthContext);
