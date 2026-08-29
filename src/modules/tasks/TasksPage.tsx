import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Task } from '../../types/task'
import { useAuth } from '../auth/AuthContext'
import { TaskCard } from './TaskCard'
import { TaskFilters } from './TaskFilters'
import { TaskFormModal } from './TaskFormModal'
import { deleteTask, getTasks, updateTask } from './taskService'
import { ConfirmModal } from '../../components/ConfirmModal'
import { useToast } from '../../components/ToastContext'
import { ClipboardPlus, ListTodo } from 'lucide-react'

export const TasksPage = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const { showError } = useToast()

  const parsedProjectId = Number(projectId)
  const isValidProjectId = Boolean(projectId) && Number.isInteger(parsedProjectId) && parsedProjectId > 0
  const filteredTasks = tasks.filter((task) =>
    (!filterStatus || task.status === filterStatus)
    && (!filterPriority || task.priority === filterPriority),
  ).sort((firstTask, secondTask) =>
    Number(firstTask.status === 'DONE') - Number(secondTask.status === 'DONE'),
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

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      const updatedTask = await updateTask(task.id, { status: newStatus })
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => currentTask.id === updatedTask.id ? updatedTask : currentTask),
      )
    } catch (caughtError: unknown) {
      showError(caughtError instanceof Error ? caughtError.message : 'Error al actualizar el estado')
    }
  }

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return

    setDeletingTaskId(taskToDelete.id)

    try {
      await deleteTask(taskToDelete.id)
      setTasks((currentTasks) => currentTasks.filter((item) => item.id !== taskToDelete.id))
    } catch (caughtError: unknown) {
      showError(caughtError instanceof Error ? caughtError.message : 'Error al eliminar la tarea')
    } finally {
      setDeletingTaskId(null)
      setTaskToDelete(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div><p className="eyebrow">Proyecto</p><h1 className="page-title">Tareas</h1><p className="page-description">Planifica prioridades y avanza cada entrega con claridad.</p></div>
        <div className="page-actions">
          <TaskFilters
            status={filterStatus}
            priority={filterPriority}
            onStatusChange={setFilterStatus}
            onPriorityChange={setFilterPriority}
          />
          <button
            type="button"
            onClick={handleCreateTask}
            className="btn btn-primary"
          >
            <ClipboardPlus size={17} /> Nueva tarea
          </button>
        </div>
      </div>
      {loading && <div className="loading-state">Cargando tareas...</div>}
      {error && <div className="error-state">{error}</div>}
      {!loading && !error && (
        filteredTasks.length === 0 ? <div className="surface empty-state"><ListTodo size={36} /><strong className="block text-slate-700">No hay tareas para mostrar</strong><p>Crea una tarea o ajusta los filtros para continuar.</p></div> : <ul className="grid list-none gap-4 p-0 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
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
