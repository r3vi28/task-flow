import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod'
import { login as authLogin } from './authService'
import { useAuth } from './AuthContext'
import logo from '../../assets/logo.png'

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
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 rounded-lg bg-white p-8 shadow-lg"
    >
      <img className="mx-auto h-30 w-auto object-contain" src={logo} alt="Task Flow" />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Contraseña:</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>
      {generalError && <p className="text-sm text-red-600">{generalError}</p>}
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Iniciar Sesión
      </button>
      <p className="text-sm text-gray-600">
        ¿No tienes cuenta? <Link className="font-medium text-blue-600 hover:text-blue-700 hover:underline" to="/register">Regístrate</Link>
      </p>
    </form>
  )
}
