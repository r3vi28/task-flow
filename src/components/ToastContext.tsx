import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { CheckCircle2, CircleAlert } from 'lucide-react'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextToastId = useRef(0)
  const timeoutIds = useRef<Set<number>>(new Set())

  useEffect(() => () => {
    timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
  }, [])

  const showToast = useCallback((message: string, type: Toast['type']) => {
    const id = nextToastId.current++
    setToasts((currentToasts) => [...currentToasts, { id, message, type }])

    const timeoutId = window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
      timeoutIds.current.delete(timeoutId)
    }, 3000)

    timeoutIds.current.add(timeoutId)
  }, [])

  const value: ToastContextValue = {
    showSuccess: (message) => showToast(message, 'success'),
    showError: (message) => showToast(message, 'error'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ul className="toast-list">
        {toasts.map((toast) => (
          <li
            key={toast.id}
            role="alert"
            className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}<span>{toast.message}</span>
          </li>
        ))}
      </ul>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
