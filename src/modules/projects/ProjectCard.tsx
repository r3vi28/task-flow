import { Link } from 'react-router-dom'
import type { Project } from '../../types/project'
import { DeleteProjectButton } from './DeleteProjectButton'

interface Props {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  isAdmin: boolean
}

export const ProjectCard: React.FC<Props> = ({ project, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md [&>button]:order-3 [&>button]:rounded-md [&>button]:bg-red-600 [&>button]:px-4 [&>button]:py-2 [&>button]:font-medium [&>button]:text-white [&>button]:transition-colors [&>button:hover]:bg-red-700 [&>button:focus]:outline-none [&>button:focus]:ring-2 [&>button:focus]:ring-red-500 [&>button:focus]:ring-offset-2 [&>button:disabled]:cursor-not-allowed [&>button:disabled]:opacity-60">
      <h3 className="order-1 basis-full text-xl font-semibold text-gray-900">{project.name}</h3>
      {project.description !== null && <p className="order-2 basis-full text-gray-600">{project.description}</p>}
      <Link className="order-3 rounded-md px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" to={`/projects/${project.id}/tasks`}>Ver tareas</Link>
      <button
        type="button"
        onClick={() => onEdit(project)}
        className="order-3 !bg-blue-600 hover:!bg-blue-700 focus:!ring-blue-500"
      >
        Editar
      </button>
      {isAdmin && <DeleteProjectButton project={project} onDelete={onDelete} />}
    </div>
  )
}
