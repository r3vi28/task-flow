import { useEffect, useState } from 'react'
import type { Project } from '../../types/project'
import { useAuth } from '../auth/AuthContext'
import { getProjects } from './projectService'

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProjects()
      .then(setProjects)
      .catch((e: any) => setError(e?.message ?? 'Error al cargar proyectos'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    console.log('crear proyecto')
  }

  if (loading) {
    return <p>Cargando...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h2>Proyectos</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id ?? p.name}>
            <strong>{p.name}</strong>
            <p>{p.description}</p>
          </li>
        ))}
      </ul>
      {user?.role === 'ADMIN' && (
        <button onClick={handleCreate}>Nuevo proyecto</button>
      )}
    </div>
  )
}
