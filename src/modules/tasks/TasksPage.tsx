import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Task } from '../../types/task'
import { useAuth } from '../auth/AuthContext'
import { TaskCard } from './TaskCard'
import { TaskFilters } from './TaskFilters'
import { TaskFormModal } from './TaskFormModal'
import { deleteTask, getTasks } from './taskService'

export const TasksPage = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

  const parsedProjectId = Number(projectId)
  const isValidProjectId = Boolean(projectId) && Number.isInteger(parsedProjectId) && parsedProjectId > 0
  const filteredTasks = tasks.filter((task) =>
    (!filterStatus || task.status === filterStatus)
    && (!filterPriority || task.priority === filterPriority),
  )

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
      <TaskFilters
        status={filterStatus}
        priority={filterPriority}
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
      />
      {actionError && <p>{actionError}</p>}
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isDeleting={deletingTaskId === task.id}
                isAdmin={user?.role === 'ADMIN'}
              />
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
