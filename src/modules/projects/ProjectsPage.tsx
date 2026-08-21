import { useEffect, useState } from 'react'
import { ProjectFormModal } from './ProjectFormModal'
import type { Project } from '../../types/project'
import { useAuth } from '../auth/AuthContext'
import { deleteProject, getProjects } from './projectService'

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleSuccess = (savedProject: Project) => {
    setProjects((prev) =>
      selectedProject
        ? prev.map((project) => project.id === savedProject.id ? savedProject : project)
        : [...prev, savedProject],
    )
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProjects()
      .then(setProjects)
      .catch((e: any) => setError(e?.message ?? 'Error al cargar proyectos'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    setSelectedProject(null)
    setIsModalOpen(true)
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`¿Eliminar el proyecto "${project.name}"?`)) {
      return
    }

    setActionError(null)

    try {
      await deleteProject(project.id)
      setProjects((prev) => prev.filter((item) => item.id !== project.id))
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Error al eliminar el proyecto')
    }
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
      {actionError && <p>{actionError}</p>}
      <button type="button" onClick={handleCreate}>Nuevo proyecto</button>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong>
            <p>{p.description}</p>
            <button type="button" onClick={() => handleEdit(p)}>Editar</button>
            {user?.role === 'ADMIN' && (
              <button type="button" onClick={() => handleDelete(p)}>Eliminar</button>
            )}
          </li>
        ))}
      </ul>
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        project={selectedProject ?? undefined}
      />
    </div>
  )
}
