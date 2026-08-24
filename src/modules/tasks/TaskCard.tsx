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
    <div>
      <h3>{task.title}</h3>
      <p>Estado: {task.status}</p>
      <p>Prioridad: {task.priority}</p>
      <button type="button" onClick={() => onEdit(task)}>
        Editar
      </button>
      {isAdmin && (
        <button type="button" onClick={() => onDelete(task)} disabled={isDeleting}>
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      )}
    </div>
  )
}
