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
    <div>
      <h3>{project.name}</h3>
      <Link to={`/projects/${project.id}/tasks`}>Ver tareas</Link>
      {project.description !== null && <p>{project.description}</p>}
      <button type="button" onClick={() => onEdit(project)}>Editar</button>
      {isAdmin && <DeleteProjectButton project={project} onDelete={onDelete} />}
    </div>
  )
}
