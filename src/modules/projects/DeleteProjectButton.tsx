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
        className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
