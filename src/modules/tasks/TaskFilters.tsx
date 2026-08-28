interface Props {
  status: string
  priority: string
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
}

export const TaskFilters = ({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: Props) => (
  <div className="mb-4 flex gap-4">
    <div className="flex flex-col gap-1">
      <label htmlFor="status-filter" className="font-medium text-gray-700">Estado</label>
      <select
        id="status-filter"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos</option>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>
    </div>

    <div className="flex flex-col gap-1">
      <label htmlFor="priority-filter" className="font-medium text-gray-700">Prioridad</label>
      <select
        id="priority-filter"
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
    </div>
  </div>
)
