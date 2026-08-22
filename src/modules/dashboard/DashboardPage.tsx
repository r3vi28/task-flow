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
    <div>
      <h2>Bienvenido, {user?.name}</h2>
      <Link to="/projects">Ver proyectos</Link>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}
