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
  <div>
    <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
      <option value="">Todos</option>
      <option value="TODO">TODO</option>
      <option value="IN_PROGRESS">IN_PROGRESS</option>
      <option value="DONE">DONE</option>
    </select>

    <select value={priority} onChange={(event) => onPriorityChange(event.target.value)}>
      <option value="">Todas</option>
      <option value="LOW">LOW</option>
      <option value="MEDIUM">MEDIUM</option>
      <option value="HIGH">HIGH</option>
    </select>
  </div>
)
