import { Link, useNavigate } from 'react-router-dom'

export const BackNav = () => {
  const navigate = useNavigate()

  return (
    <nav className="mb-6 flex items-center gap-3" aria-label="Navegación secundaria">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        ← Atrás
      </button>
      <Link
        to="/dashboard"
        className="rounded-md px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        🏠 Inicio
      </Link>
    </nav>
  )
}
