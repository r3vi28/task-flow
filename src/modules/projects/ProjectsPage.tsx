import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { ProjectFormModal } from './ProjectFormModal'
import { ProjectCard } from './ProjectCard'
import type { Project } from '../../types/project'
import { useToast } from '../../components/ToastContext'
import { useAuth } from '../auth/AuthContext'
import { deleteProject, getProjects } from './projectService'
import { FolderPlus, FolderKanban } from 'lucide-react'

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
    return <div className="loading-state">Cargando proyectos...</div>
  }

  if (error) {
    return <div className="error-state">{error}</div>
  }

  return (
    <div>
      <div className="page-header">
        <div><p className="eyebrow">Organización</p><h1 className="page-title">Proyectos</h1><p className="page-description">Agrupa el trabajo y mantén cada objetivo bajo control.</p></div>
        <button
          type="button"
          onClick={handleCreate}
          className="btn btn-primary"
        >
          <FolderPlus size={17} /> Nuevo proyecto
        </button>
      </div>
      {projects.length === 0 ? <div className="surface empty-state"><FolderKanban size={36} /><strong className="block text-slate-700">Aún no hay proyectos</strong><p>Crea el primero para comenzar a organizar tu trabajo.</p></div> : <ul className="grid list-none gap-4 p-0 lg:grid-cols-2">
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
      </ul>}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        project={selectedProject ?? undefined}
      />
    </div>
  )
}
