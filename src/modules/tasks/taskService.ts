import api from '../../services/api';
import type { Task, CreateTaskBody, UpdateTaskBody } from '../../types/task';

export const getTasks = (projectId: number): Promise<Task[]> =>
  api.get<Task[]>(`/projects/${projectId}/tasks`).then((res) => res.data);

export const createTask = (
  projectId: number,
  data: CreateTaskBody
): Promise<Task> =>
  api.post<Task>(`/projects/${projectId}/tasks`, data).then((res) => res.data);

export const updateTask = (
  taskId: number,
  data: UpdateTaskBody
): Promise<Task> =>
  api.put<Task>(`/tasks/${taskId}`, data).then((res) => res.data);

export const deleteTask = (taskId: number): Promise<void> =>
  api.delete<void>(`/tasks/${taskId}`).then(() => undefined);
