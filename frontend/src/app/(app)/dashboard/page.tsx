'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Search, Filter, CheckCircle2, Clock, ListTodo, Zap, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Task, TaskFilters, CreateTaskInput } from '@/types'
import { taskService } from '@/lib/tasks'
import { getApiError } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { TaskCard } from '@/components/TaskCard'
import { TaskModal } from '@/components/TaskModal'
import { DeleteDialog } from '@/components/DeleteDialog'
import { StatsCard } from '@/components/StatsCard'

const LIMIT = 8

export default function DashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasNext: false, hasPrev: false })
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: LIMIT, status: '', priority: '', search: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Stats
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0, total: 0 })

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await taskService.getTasks(filters)
      setTasks(data.tasks)
      setTotal(data.pagination.total)
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        hasNext: data.pagination.hasNext,
        hasPrev: data.pagination.hasPrev,
      })
    } catch (err) {
      toast.error(getApiError(err))
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchStats = useCallback(async () => {
    try {
      const [all, pending, inProgress, completed] = await Promise.all([
        taskService.getTasks({ limit: 1 }),
        taskService.getTasks({ status: 'PENDING', limit: 1 }),
        taskService.getTasks({ status: 'IN_PROGRESS', limit: 1 }),
        taskService.getTasks({ status: 'COMPLETED', limit: 1 }),
      ])
      setStats({
        total: all.pagination.total,
        pending: pending.pagination.total,
        inProgress: inProgress.pagination.total,
        completed: completed.pagination.total,
      })
    } catch (_) {}
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])
  useEffect(() => { fetchStats() }, [fetchStats])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(f => ({ ...f, page: 1 }))
    }, 400)
    return () => clearTimeout(t)
  }, [filters.search])

  const handleCreate = async (data: CreateTaskInput) => {
    setIsSaving(true)
    try {
      await taskService.createTask(data)
      toast.success('Task created!')
      setShowModal(false)
      fetchTasks()
      fetchStats()
    } catch (err) {
      toast.error(getApiError(err))
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (data: CreateTaskInput) => {
    if (!editingTask) return
    setIsSaving(true)
    try {
      await taskService.updateTask(editingTask.id, data)
      toast.success('Task updated!')
      setEditingTask(null)
      setShowModal(false)
      fetchTasks()
      fetchStats()
    } catch (err) {
      toast.error(getApiError(err))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    try {
      await taskService.deleteTask(deletingId)
      toast.success('Task deleted.')
      setDeletingId(null)
      fetchTasks()
      fetchStats()
    } catch (err) {
      toast.error(getApiError(err))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      const updated = await taskService.toggleTask(id)
      setTasks(ts => ts.map(t => t.id === id ? updated : t))
      toast.success(`Status → ${updated.status.replace('_', ' ')}`)
      fetchStats()
    } catch (err) {
      toast.error(getApiError(err))
    }
  }

  const openEdit = (task: Task) => { setEditingTask(task); setShowModal(true) }
  const openCreate = () => { setEditingTask(null); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditingTask(null) }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            You have <span className="text-brand-400 font-medium">{stats.pending}</span> pending and{' '}
            <span className="text-brand-400 font-medium">{stats.inProgress}</span> in-progress tasks
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-lg shadow-brand-500/20 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatsCard label="Total Tasks" value={stats.total} color="bg-slate-500/15 border border-slate-500/20" icon={<ListTodo className="w-5 h-5 text-slate-400" />} />
        <StatsCard label="Pending" value={stats.pending} color="bg-amber-500/15 border border-amber-500/20" icon={<Clock className="w-5 h-5 text-amber-400" />} />
        <StatsCard label="In Progress" value={stats.inProgress} color="bg-brand-500/15 border border-brand-500/20" icon={<Zap className="w-5 h-5 text-brand-400" />} />
        <StatsCard label="Completed" value={stats.completed} color="bg-emerald-500/15 border border-emerald-500/20" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} />
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-3 mb-4 flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
            className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
          />
          {filters.search && (
            <button onClick={() => setFilters(f => ({ ...f, search: '', page: 1 }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value as any, page: 1 }))}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value as any, page: 1 }))}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <ListTodo className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No tasks found</h3>
          <p className="text-slate-400 text-sm mb-5">
            {filters.search || filters.status || filters.priority
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          {!filters.search && !filters.status && !filters.priority && (
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-brand-500/20 hover:from-brand-500 hover:to-cyan-500 transition-all">
              <Plus className="w-4 h-4" />
              Create your first task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="text-xs text-slate-500 mb-3 px-1">
            Showing {tasks.length} of {total} task{total !== 1 ? 's' : ''}
          </div>
          <div className="space-y-2">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={(id) => setDeletingId(id)}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}
                className="p-2 rounded-lg glass hover:bg-white/10 text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-400">
                Page <span className="text-slate-200 font-medium">{pagination.page}</span> of{' '}
                <span className="text-slate-200 font-medium">{pagination.totalPages}</span>
              </span>
              <button
                disabled={!pagination.hasNext}
                onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                className="p-2 rounded-lg glass hover:bg-white/10 text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={closeModal}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          isLoading={isSaving}
        />
      )}

      {/* Delete Dialog */}
      {deletingId && (
        <DeleteDialog
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
