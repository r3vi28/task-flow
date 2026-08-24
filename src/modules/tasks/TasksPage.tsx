import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Task } from '../../types/task'
import { useAuth } from '../auth/AuthContext'
import { TaskFormModal } from './TaskFormModal'
import { deleteTask, getTasks } from './taskService'

export const TasksPage = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

  const parsedProjectId = Number(projectId)
  const isValidProjectId = Boolean(projectId) && Number.isInteger(parsedProjectId) && parsedProjectId > 0

  useEffect(() => {
    if (!isValidProjectId) {
      setError('Proyecto inválido')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    getTasks(parsedProjectId)
      .then(setTasks)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar tareas')
      })
      .finally(() => setLoading(false))
  }, [isValidProjectId, parsedProjectId])

  const handleCreateTask = () => {
    if (!isValidProjectId) return

    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleSuccess = (savedTask: Task) => {
    setTasks((currentTasks) =>
      selectedTask
        ? currentTasks.map((task) => task.id === savedTask.id ? savedTask : task)
        : [...currentTasks, savedTask],
    )
  }

  const handleDeleteTask = async (task: Task) => {
    if (!window.confirm(`¿Eliminar la tarea "${task.title}"?`)) return

    setActionError(null)
    setDeletingTaskId(task.id)

    try {
      await deleteTask(task.id)
      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== task.id))
    } catch (caughtError: unknown) {
      setActionError(caughtError instanceof Error ? caughtError.message : 'Error al eliminar la tarea')
    } finally {
      setDeletingTaskId(null)
    }
  }

  return (
    <div>
      <h2>Tareas</h2>
      <button type="button" onClick={handleCreateTask}>Nueva tarea</button>
      {actionError && <p>{actionError}</p>}
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>Estado: {task.status}</p>
              <p>Prioridad: {task.priority}</p>
              <button type="button" onClick={() => handleEditTask(task)}>
                Editar
              </button>
              {user?.role === 'ADMIN' && (
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task)}
                  disabled={deletingTaskId === task.id}
                >
                  {deletingTaskId === task.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {isValidProjectId && (
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          projectId={parsedProjectId}
          task={selectedTask ?? undefined}
        />
      )}
    </div>
  )
}
