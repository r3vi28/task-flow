import { CalendarDays, Pencil } from 'lucide-react'
import type { Task } from '../../types/task'

const statusLabels: Record<Task['status'], string> = {
  TODO: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  DONE: 'Completada',
}

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, newStatus: Task['status']) => void
  isDeleting: boolean
  isAdmin: boolean
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isDeleting, isAdmin }: Props) => {
  const statusOptions: Task['status'][] = task.status === 'TODO'
    ? ['TODO', 'IN_PROGRESS']
    : task.status === 'IN_PROGRESS'
      ? ['IN_PROGRESS', 'DONE']
      : ['DONE']

  return (
    <div className="surface list-card">
      <h3 className="item-title">{task.title}</h3>
      {task.description && <p className="item-copy">{task.description}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-gray-700">
        <label htmlFor={`task-status-${task.id}`}>Estado:</label>
        <select
          id={`task-status-${task.id}`}
          value={task.status}
          onChange={(event) => onStatusChange(task, event.target.value as Task['status'])}
          disabled={task.status === 'DONE'}
          className={`input w-auto py-1 text-sm font-semibold ${
            task.status === 'TODO'
              ? 'bg-gray-100 text-gray-700'
              : task.status === 'IN_PROGRESS'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
          }`}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>{statusLabels[status]}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span>Prioridad</span>
        <span
          className={`badge ${
            task.priority === 'LOW'
              ? 'bg-green-100 text-green-800'
              : task.priority === 'MEDIUM'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {task.priority}
        </span>
      </div>
      {task.dueDate && <p className="item-copy flex items-center gap-2"><CalendarDays size={15} />Entrega: {new Date(task.dueDate).toLocaleDateString('es-DO', { dateStyle: 'medium' })}</p>}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="btn btn-secondary"
        >
          <Pencil size={15} /> Editar
        </button>
        {isAdmin && (
          <button
            type="button"
            onClick={() => onDelete(task)}
            disabled={isDeleting}
            className="btn btn-danger"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        )}
      </div>
    </div>
  )
}
