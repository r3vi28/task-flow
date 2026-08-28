import type { Task } from '../../types/task'

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isDeleting: boolean
  isAdmin: boolean
}

export const TaskCard = ({ task, onEdit, onDelete, isDeleting, isAdmin }: Props) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
      <p className="mt-3 text-gray-700">
        Estado:{' '}
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${
            task.status === 'TODO'
              ? 'bg-gray-100 text-gray-700'
              : task.status === 'IN_PROGRESS'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
          }`}
        >
          {task.status}
        </span>
      </p>
      <p className="mt-2 text-gray-700">
        Prioridad:{' '}
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${
            task.priority === 'LOW'
              ? 'bg-green-100 text-green-800'
              : task.priority === 'MEDIUM'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {task.priority}
        </span>
      </p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Editar
        </button>
        {isAdmin && (
          <button
            type="button"
            onClick={() => onDelete(task)}
            disabled={isDeleting}
            className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        )}
      </div>
    </div>
  )
}
