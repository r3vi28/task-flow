import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Task } from '../../types/task'
import { getTasks } from './taskService'

export const TasksPage = () => {
  const { projectId } = useParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const parsedProjectId = Number(projectId)

    Promise.resolve().then(() => {
      if (!projectId || !Number.isInteger(parsedProjectId) || parsedProjectId <= 0) {
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
    })
  }, [projectId])

  const handleCreateTask = () => {
    console.log('crear tarea')
  }

  return (
    <div>
      <h2>Tareas</h2>
      <button type="button" onClick={handleCreateTask}>Nueva tarea</button>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>Estado: {task.status}</p>
              <p>Prioridad: {task.priority}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
