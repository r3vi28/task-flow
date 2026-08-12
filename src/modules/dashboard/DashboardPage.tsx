import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user: contextUser, logout } = useAuth();

  const user: User | null = contextUser ?? (() => {
    try {
      const raw = sessionStorage.getItem('user');
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    logout();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Bienvenido, {user?.name}</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};
