import { useState } from 'react'
import type { Project } from '../../types/project'

interface Props {
  project: Project
  onDelete: (project: Project) => void
}

export const DeleteProjectButton: React.FC<Props> = ({ project, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar el proyecto "${project.name}"?`)) {
      return
    }

    setIsDeleting(true)

    try {
      await onDelete(project)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button type="button" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
