import { ArrowRight, Pencil } from 'lucide-react'
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
    <div className="surface list-card flex flex-col">
      <h3 className="item-title">{project.name}</h3>
      <p className="item-copy min-h-11">{project.description || 'Sin descripción para este proyecto.'}</p>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
      <Link className="btn btn-ghost" to={`/projects/${project.id}/tasks`}>Ver tareas <ArrowRight size={16} /></Link>
      <button
        type="button"
        onClick={() => onEdit(project)}
        className="btn btn-secondary"
      >
        <Pencil size={15} /> Editar
      </button>
      {isAdmin && <DeleteProjectButton project={project} onDelete={onDelete} />}
      </div>
    </div>
  )
}
