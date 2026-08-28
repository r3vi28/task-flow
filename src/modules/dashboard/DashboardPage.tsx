import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Task } from '../../types/task'
import { useAuth } from '../auth/AuthContext'
import { getProjects } from '../projects/projectService'
import { getTasks } from '../tasks/taskService'

const priorityOrder: Record<Task['priority'], number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
}

const statusLabels: Record<Task['status'], string> = {
  TODO: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  DONE: 'Completada',
}

const getDueDateTime = (dueDate: string | null) => {
  if (!dueDate) return Number.POSITIVE_INFINITY

  const time = new Date(dueDate).getTime()
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
}

const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate)

  if (Number.isNaN(date.getTime())) return dueDate

  return date.toLocaleString('es-DO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projectCount, setProjectCount] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const loadDashboard = async () => {
      try {
        const projects = await getProjects()
        const tasksByProject = await Promise.all(
          projects.map((project) => getTasks(project.id)),
        )

        if (!isActive) return

        setProjectCount(projects.length)
        setTasks(tasksByProject.flat())
      } catch (caughtError: unknown) {
        if (!isActive) return

        setError(caughtError instanceof Error ? caughtError.message : 'Error al cargar el resumen')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadDashboard()

    return () => {
      isActive = false
    }
  }, [])

  const todoCount = tasks.filter((task) => task.status === 'TODO').length
  const inProgressCount = tasks.filter((task) => task.status === 'IN_PROGRESS').length
  const doneCount = tasks.filter((task) => task.status === 'DONE').length
  const importantTasks = tasks
    .filter((task) => task.status === 'TODO' || task.status === 'IN_PROGRESS')
    .sort((firstTask, secondTask) => {
      const firstDueDate = getDueDateTime(firstTask.dueDate)
      const secondDueDate = getDueDateTime(secondTask.dueDate)

      if (firstDueDate < secondDueDate) return -1
      if (firstDueDate > secondDueDate) return 1

      return priorityOrder[firstTask.priority] - priorityOrder[secondTask.priority]
    })
    .slice(0, 4)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (isLoading) {
    return <p className="p-6 text-gray-600">Cargando...</p>
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-2xl font-semibold text-gray-900">Bienvenido, {user?.name}</h2>
        <Link className="rounded-md px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" to="/projects">Ver proyectos</Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Total de proyectos</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{projectCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Tareas pendientes</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{todoCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Tareas en progreso</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{inProgressCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Tareas completadas</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{doneCount}</p>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900">Tareas importantes</h3>
        {importantTasks.length === 0 ? (
          <p className="mt-4 text-gray-600">No hay tareas pendientes.</p>
        ) : (
          <ul className="mt-4 grid list-none gap-4 p-0 md:grid-cols-2">
            {importantTasks.map((task) => (
              <li key={task.id}>
                <Link
                  to={`/projects/${task.projectId}/tasks`}
                  className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm font-medium">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-blue-800">{statusLabels[task.status]}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">{task.priority}</span>
                  </div>
                  {task.dueDate && (
                    <p className="mt-3 text-sm text-gray-600">Fecha límite: {formatDueDate(task.dueDate)}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
