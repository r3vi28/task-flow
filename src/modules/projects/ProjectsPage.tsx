import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { ProjectFormModal } from './ProjectFormModal'
import { ProjectCard } from './ProjectCard'
import type { Project } from '../../types/project'
import { BackNav } from '../../components/BackNav'
import { useToast } from '../../components/ToastContext'
import { useAuth } from '../auth/AuthContext'
import { deleteProject, getProjects } from './projectService'

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { showError } = useToast()
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
    try {
      await deleteProject(project.id)
      setProjects((prev) => prev.filter((item) => item.id !== project.id))
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 500) {
        showError('No se puede eliminar el proyecto porque tiene tareas pendientes. Elimina las tareas antes de intentarlo de nuevo.')
        return
      }

      showError(err instanceof Error ? err.message : 'Error al eliminar el proyecto')
    }
  }

  if (loading) {
    return <p className="p-6 text-gray-600">Cargando...</p>
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>
  }

  return (
    <div className="p-6">
      <BackNav />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-2xl font-semibold text-gray-900">Proyectos</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Nuevo proyecto
        </button>
      </div>
      <ul className="list-none space-y-4 p-0">
        {projects.map((p) => (
          <li key={p.id}>
            <ProjectCard
              project={p}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={user?.role === 'ADMIN'}
            />
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
