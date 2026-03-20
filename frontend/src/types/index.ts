export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  dueDate?: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface TasksResponse {
  success: boolean
  data: {
    tasks: Task[]
    pagination: Pagination
  }
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    accessToken: string
  }
}

export interface TaskFilters {
  page?: number
  limit?: number
  status?: TaskStatus | ''
  priority?: Priority | ''
  search?: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: string
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}
