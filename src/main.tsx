import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastProvider } from './components/ToastContext'
import { AuthProvider } from './modules/auth/AuthContext'
import { AppRouter } from './router/AppRouter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
