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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900">{project ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label htmlFor="project-name" className="mb-1 block font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="project-description" className="mb-1 block font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="min-h-25 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {project ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
