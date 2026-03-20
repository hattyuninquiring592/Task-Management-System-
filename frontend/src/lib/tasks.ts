import api from './api'
import { Task, TasksResponse, TaskFilters, CreateTaskInput, UpdateTaskInput } from '@/types'

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<TasksResponse['data']> {
    const params = new URLSearchParams()
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))
    if (filters.status) params.set('status', filters.status)
    if (filters.priority) params.set('priority', filters.priority)
    if (filters.search) params.set('search', filters.search)
    const res = await api.get<TasksResponse>(`/tasks?${params.toString()}`)
    return res.data.data
  },

  async createTask(data: CreateTaskInput): Promise<Task> {
    const res = await api.post<{ success: boolean; data: { task: Task } }>('/tasks', data)
    return res.data.data.task
  },

  async getTask(id: string): Promise<Task> {
    const res = await api.get<{ success: boolean; data: { task: Task } }>(`/tasks/${id}`)
    return res.data.data.task
  },

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const res = await api.patch<{ success: boolean; data: { task: Task } }>(`/tasks/${id}`, data)
    return res.data.data.task
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },

  async toggleTask(id: string): Promise<Task> {
    const res = await api.patch<{ success: boolean; data: { task: Task } }>(`/tasks/${id}/toggle`)
    return res.data.data.task
  },
}
