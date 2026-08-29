import { ArrowRight, CalendarDays, CheckCircle2, CircleDashed, Clock3, FolderKanban, ListTodo } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Task } from '../../types/task'
import { useAuth } from '../auth/AuthContext'
import { getProjects } from '../projects/projectService'
import { getTasks } from '../tasks/taskService'

const priorityOrder: Record<Task['priority'], number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }
const statusLabels: Record<Task['status'], string> = { TODO: 'Pendiente', IN_PROGRESS: 'En progreso', DONE: 'Completada' }
const priorityLabels: Record<Task['priority'], string> = { HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }
const priorityClass: Record<Task['priority'], string> = { HIGH: 'badge-red', MEDIUM: 'badge-amber', LOW: 'badge-green' }
const getDueDateTime = (value: string | null) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).getTime() : Number.POSITIVE_INFINITY
const formatDueDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' }) }

export const DashboardPage = () => {
  const { user } = useAuth()
  const [projectCount, setProjectCount] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { let isActive = true; const load = async () => { try { const projects = await getProjects(); const groupedTasks = await Promise.all(projects.map((project) => getTasks(project.id))); if (isActive) { setProjectCount(projects.length); setTasks(groupedTasks.flat()) } } catch (caughtError: unknown) { if (isActive) setError(caughtError instanceof Error ? caughtError.message : 'Error al cargar el resumen') } finally { if (isActive) setIsLoading(false) } }; void load(); return () => { isActive = false } }, [])
  const todoCount = tasks.filter((task) => task.status === 'TODO').length
  const inProgressCount = tasks.filter((task) => task.status === 'IN_PROGRESS').length
  const doneCount = tasks.filter((task) => task.status === 'DONE').length
  const importantTasks = tasks.filter((task) => task.status !== 'DONE').sort((a, b) => getDueDateTime(a.dueDate) - getDueDateTime(b.dueDate) || priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 4)
  const metrics = [{ label: 'Proyectos activos', value: projectCount, icon: FolderKanban, color: 'bg-blue-100 text-blue-700' }, { label: 'Por hacer', value: todoCount, icon: CircleDashed, color: 'bg-slate-100 text-slate-600' }, { label: 'En progreso', value: inProgressCount, icon: Clock3, color: 'bg-amber-100 text-amber-700' }, { label: 'Completadas', value: doneCount, icon: CheckCircle2, color: 'bg-green-100 text-green-700' }]
  if (isLoading) return <div className="loading-state">Cargando tu espacio de trabajo...</div>
  if (error) return <div className="error-state">{error}</div>
  return <>
    <header className="page-header"><div><p className="eyebrow">Vista general</p><h1 className="page-title">Hola, {user?.name?.split(' ')[0]}</h1><p className="page-description">Aquí tienes el pulso de tu trabajo y lo que requiere atención.</p></div></header>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumen de actividad">{metrics.map(({ label, value, icon: Icon, color }) => <article key={label} className="surface metric-card"><div className={`metric-icon ${color}`}><Icon size={20} /></div><p className="metric-label">{label}</p><p className="metric-value">{value}</p></article>)}</section>
    <section className="mt-8"><div className="mb-4 flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold tracking-tight text-slate-900">Tareas importantes</h2><p className="mt-1 text-sm text-slate-500">Prioriza las próximas entregas de tus proyectos.</p></div><ListTodo className="text-blue-600" size={22} /></div>{importantTasks.length === 0 ? <div className="surface empty-state"><CheckCircle2 size={34} /><strong className="block text-slate-700">Todo está al día</strong><p>No hay tareas pendientes por atender.</p></div> : <ul className="grid list-none gap-4 p-0 md:grid-cols-2">{importantTasks.map((task) => <li key={task.id}><Link to={`/projects/${task.projectId}/tasks`} className="surface list-card block no-underline"><div className="flex items-start justify-between gap-3"><h3 className="item-title">{task.title}</h3><ArrowRight size={17} className="shrink-0 text-slate-400" /></div><div className="mt-4 flex flex-wrap gap-2"><span className="badge badge-blue">{statusLabels[task.status]}</span><span className={`badge ${priorityClass[task.priority]}`}>{priorityLabels[task.priority]}</span></div>{task.dueDate && <p className="item-copy flex items-center gap-2"><CalendarDays size={15} />{formatDueDate(task.dueDate)}</p>}</Link></li>)}</ul>}</section>
  </>
}
