import { useState, useEffect} from 'react'
import type { FormEvent } from 'react';
import type { Project, CreateProjectBody, UpdateProjectBody } from '../../types/project'
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
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen) return
    if (project) {
      setName(project.name)
      setDescription(project.description ?? '')
    } else {
      setName('')
      setDescription('')
    }
    setError(null)
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
    } catch (err: any) {
      setError(err?.message || 'Error al guardar el proyecto')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', width: '100%', maxWidth: '500px' }}>
        <h2>{project ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="project-name" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Nombre
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="project-description" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Descripción
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}>
              {project ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
