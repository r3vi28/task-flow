import type { Project } from '../../types/project'

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
      {project.description !== null && <p>{project.description}</p>}
      <button type="button" onClick={() => onEdit(project)}>Editar</button>
      {isAdmin && (
        <button type="button" onClick={() => onDelete(project)}>Eliminar</button>
      )}
    </div>
  )
}
