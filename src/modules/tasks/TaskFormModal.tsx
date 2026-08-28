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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900">{task ? 'Editar tarea' : 'Nueva tarea'}</h2>
        {error && <p className="mt-3 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label htmlFor="task-title" className="mb-1 block font-medium text-gray-700">
              Título
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="task-description" className="mb-1 block font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSubmitting}
              className="min-h-25 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="task-status" className="mb-1 block font-medium text-gray-700">
              Estado
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as Task['status'])}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="TODO">Pendiente</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="DONE">Completada</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="task-priority" className="mb-1 block font-medium text-gray-700">
              Prioridad
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Task['priority'])}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="task-due-date" className="mb-1 block font-medium text-gray-700">
              Fecha límite
            </label>
            <input
              id="task-due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
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
              {task ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
