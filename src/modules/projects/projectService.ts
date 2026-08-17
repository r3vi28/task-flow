import api from '../../services/api';
import type { Project, CreateProjectBody, UpdateProjectBody } from '../../types/project';

export const getProjects = (): Promise<Project[]> =>
  api.get<Project[]>('/projects').then((res) => res.data);

export const getProjectById = (id: number): Promise<Project> =>
  api.get<Project>(`/projects/${id}`).then((res) => res.data);

export const createProject = (data: CreateProjectBody): Promise<Project> =>
  api.post<Project>('/projects', data).then((res) => res.data);

export const updateProject = (
  id: number,
  data: UpdateProjectBody
): Promise<Project> =>
  api.put<Project>(`/projects/${id}`, data).then((res) => res.data);

export const deleteProject = (id: number): Promise<void> =>
  api.delete<void>(`/projects/${id}`).then(() => undefined);
