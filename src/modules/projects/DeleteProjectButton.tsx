import { useState } from 'react'
import type { Project } from '../../types/project'
import { ConfirmModal } from '../../components/ConfirmModal'

interface Props {
  project: Project
  onDelete: (project: Project) => void
}

export const DeleteProjectButton: React.FC<Props> = ({ project, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await onDelete(project)
    } finally {
      setIsDeleting(false)
      setIsConfirmModalOpen(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmModalOpen(true)}
        disabled={isDeleting}
        className="btn btn-danger"
      >
        Eliminar
      </button>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Eliminar proyecto"
        message={`¿Seguro que deseas eliminar el proyecto "${project.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        isLoading={isDeleting}
      />
    </>
  )
}
