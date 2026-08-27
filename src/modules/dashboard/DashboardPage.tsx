import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <h2 className="mr-auto text-2xl font-semibold text-gray-900">Bienvenido, {user?.name}</h2>
      <Link className="rounded-md px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" to="/projects">Ver proyectos</Link>
      <button
        onClick={handleLogout}
        className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
