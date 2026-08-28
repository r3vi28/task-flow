import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Task } from '../../types/task'
import { useAuth } from '../auth/AuthContext'
import { TaskCard } from './TaskCard'
import { TaskFilters } from './TaskFilters'
import { TaskFormModal } from './TaskFormModal'
import { deleteTask, getTasks } from './taskService'
import { ConfirmModal } from '../../components/ConfirmModal'

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
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

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

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task)
  }

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return

    setActionError(null)
    setDeletingTaskId(taskToDelete.id)

    try {
      await deleteTask(taskToDelete.id)
      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== taskToDelete.id))
    } catch (caughtError: unknown) {
      setActionError(caughtError instanceof Error ? caughtError.message : 'Error al eliminar la tarea')
    } finally {
      setDeletingTaskId(null)
      setTaskToDelete(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-2xl font-semibold text-gray-900">Tareas</h2>
        <div className="flex flex-wrap items-end gap-3 [&>div]:mb-0">
          <TaskFilters
            status={filterStatus}
            priority={filterPriority}
            onStatusChange={setFilterStatus}
            onPriorityChange={setFilterPriority}
          />
          <button
            type="button"
            onClick={handleCreateTask}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Nueva tarea
          </button>
        </div>
      </div>
      {actionError && <p className="mb-4 text-red-600">{actionError}</p>}
      {loading && <p className="text-gray-600">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <ul className="list-none space-y-4 p-0">
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
      <ConfirmModal
        isOpen={taskToDelete !== null}
        title="Eliminar tarea"
        message={taskToDelete ? `¿Seguro que deseas eliminar la tarea "${taskToDelete.title}"?` : ''}
        onConfirm={handleConfirmDeleteTask}
        onCancel={() => setTaskToDelete(null)}
        isLoading={deletingTaskId !== null}
      />
    </div>
  )
}
