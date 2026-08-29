import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { z } from 'zod'
import type { CreateTaskBody, Task } from '../../types/task'
import { useToast } from '../../components/ToastContext'
import { createTask, updateTask } from './taskService'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: (task: Task) => void
  projectId: number
  task?: Task
}

const taskSchema = z.object({
  title: z.string().trim().min(1, 'El título no puede estar vacío'),
})

const toDateTimeLocal = (dateValue: string | null): string => {
  if (!dateValue) return ''

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ''

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 16)
}

export const TaskFormModal = ({ isOpen, onClose, onSuccess, projectId, task }: Props) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Task['status']>('TODO')
  const [priority, setPriority] = useState<Task['priority']>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showError } = useToast()

  useEffect(() => {
    if (!isOpen) return

    if (task) {
      // This synchronizes the editable form with the task selected by the parent.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(task.title)
      setDescription(task.description ?? '')
      setStatus(task.status)
      setPriority(task.priority)
      setDueDate(toDateTimeLocal(task.dueDate))
    } else {
      setTitle('')
      setDescription('')
      setStatus('TODO')
      setPriority('MEDIUM')
      setDueDate('')
    }

  }, [isOpen, task])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const validated = taskSchema.parse({ title })
      const data: CreateTaskBody = {
        title: validated.title,
        status,
        priority,
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : {}),
      }

      setIsSubmitting(true)
      const savedTask = task
        ? await updateTask(task.id, data)
        : await createTask(projectId, data)

      onSuccess(savedTask)
      onClose()
    } catch (caughtError: unknown) {
      if (caughtError instanceof z.ZodError) {
        showError(caughtError.issues[0]?.message ?? 'Datos inválidos')
      } else if (caughtError instanceof Error) {
        showError(caughtError.message)
      } else {
        showError('Error al guardar la tarea')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true">
        <h2 className="modal-title">{task ? 'Editar tarea' : 'Nueva tarea'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field mt-5">
            <label htmlFor="task-title">
              Título
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isSubmitting}
              className="input"
            />
          </div>
          <div className="field mt-4">
            <label htmlFor="task-description">
              Descripción
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSubmitting}
              className="input textarea"
            />
          </div>
          <div className="field mt-4">
            <label htmlFor="task-status">
              Estado
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as Task['status'])}
              disabled={isSubmitting}
              className="input"
            >
              <option value="TODO">Pendiente</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="DONE">Completada</option>
            </select>
          </div>
          <div className="field mt-4">
            <label htmlFor="task-priority">
              Prioridad
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Task['priority'])}
              disabled={isSubmitting}
              className="input"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
          <div className="field mt-4">
            <label htmlFor="task-due-date">
              Fecha límite
            </label>
            <input
              id="task-due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              disabled={isSubmitting}
              className="input"
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
              {task ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
