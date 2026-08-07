import React from 'react'
import { useAuth } from '../modules/auth/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}