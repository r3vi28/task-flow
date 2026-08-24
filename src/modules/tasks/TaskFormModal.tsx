import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { z } from 'zod'
import type { CreateTaskBody, Task } from '../../types/task'
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
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    setError(null)
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
        setError(caughtError.issues[0]?.message ?? 'Datos inválidos')
      } else if (caughtError instanceof Error) {
        setError(caughtError.message)
      } else {
        setError('Error al guardar la tarea')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', width: '100%', maxWidth: '500px' }}>
        <h2>{task ? 'Editar tarea' : 'Nueva tarea'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="task-title" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Título
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="task-description" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Descripción
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="task-status" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Estado
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as Task['status'])}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="TODO">Pendiente</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="DONE">Completada</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="task-priority" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Prioridad
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Task['priority'])}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="task-due-date" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Fecha límite
            </label>
            <input
              id="task-due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}>
              {task ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
