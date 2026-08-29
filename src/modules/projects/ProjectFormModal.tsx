import { useState, useEffect} from 'react'
import type { FormEvent } from 'react';
import type { Project, CreateProjectBody, UpdateProjectBody } from '../../types/project'
import { useToast } from '../../components/ToastContext'
import { createProject, updateProject } from './projectService'
import { z } from 'zod'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: (project: Project) => void
  project?: Project
}

const projectSchema = z.object({
  name: z.string().min(1, 'El nombre no puede estar vacío'),
})

export const ProjectFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, project }) => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { showError } = useToast()

  useEffect(() => {
    if (!isOpen) return
    if (project) {
      setName(project.name)
      setDescription(project.description ?? '')
    } else {
      setName('')
      setDescription('')
    }
  }, [project, isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      projectSchema.parse({ name })
      const body: CreateProjectBody | UpdateProjectBody = {
        name,
        description: description || undefined,
      }
      setIsSubmitting(true)
      const saved = project
        ? await updateProject(project.id, body as UpdateProjectBody)
        : await createProject(body as CreateProjectBody)
      setIsSubmitting(false)
      onSuccess(saved)
      onClose()
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        showError(err.issues[0]?.message ?? 'Datos inválidos')
      } else if (err instanceof Error) {
        showError(err.message)
      } else {
        showError('Error al guardar el proyecto')
      }
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true">
        <h2 className="modal-title">{project ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field mt-5">
            <label htmlFor="project-name">
              Nombre
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="input"
            />
          </div>
          <div className="field mt-4">
            <label htmlFor="project-description">
              Descripción
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="input textarea"
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {project ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
