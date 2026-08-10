import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { login as authLogin } from './authService'
import { useAuth } from './AuthContext'

const schema = z.object({
  email: z.string().email({ message: 'Formato de email inválido' }),
  password: z.string().min(6, { message: 'Contraseña mínima 6 caracteres' }),
})

type LoginForm = z.infer<typeof schema>

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { user: authUser, login } = useAuth()
  const [values, setValues] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [generalError, setGeneralError] = useState<string>('')

  useEffect(() => {
    if (authUser) {
      navigate('/dashboard', { replace: true })
    }
  }, [authUser, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = schema.safeParse(values)
    if (!res.success) {
      const fieldErrors: Record<string, string> = {}
      res.error.issues.forEach(err => {
        const key = err.path[0] as string
        if (key) fieldErrors[key] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setGeneralError('')
    try {
        const response = await authLogin(res.data)
        login(response)
        navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setGeneralError(err?.response?.data?.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
      </div>
      {generalError && <p style={{color: 'red'}}>{generalError}</p>}
      <button type="submit">Iniciar Sesión</button>
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </form>
  )
}

