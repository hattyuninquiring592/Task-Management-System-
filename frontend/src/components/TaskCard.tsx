'use client'

import { Task } from '@/types'
import { cn, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_DOT, formatDate, isOverdue } from '@/lib/utils'
import { Pencil, Trash2, RotateCcw, Calendar, AlertCircle } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status)

  return (
    <div className={cn(
      'glass rounded-xl p-4 group transition-all duration-200 hover:bg-white/7 animate-slide-up',
      task.status === 'COMPLETED' && 'opacity-70'
    )}>
      <div className="flex items-start gap-3">
        {/* Toggle checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200',
            task.status === 'COMPLETED'
              ? 'bg-emerald-500 border-emerald-500'
              : task.status === 'IN_PROGRESS'
              ? 'border-brand-500 bg-brand-500/20'
              : 'border-slate-600 hover:border-brand-500'
          )}
          title="Toggle status"
        >
          {task.status === 'COMPLETED' && (
            <svg className="w-3 h-3 text-white m-auto" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              'text-sm font-medium text-slate-100 leading-snug',
              task.status === 'COMPLETED' && 'line-through text-slate-400'
            )}>
              {task.title}
            </h3>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg hover:bg-brand-500/20 text-slate-500 hover:text-brand-400 transition-all">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onToggle(task.id)}
                className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-500 hover:text-slate-300 transition-all"
                title="Cycle status">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
          )}

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', STATUS_COLORS[task.status])}>
              {STATUS_LABELS[task.status]}
            </span>
            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border', PRIORITY_COLORS[task.priority])}>
              <span className={cn('w-1.5 h-1.5 rounded-full', PRIORITY_DOT[task.priority])} />
              {PRIORITY_LABELS[task.priority]}
            </span>
            {task.dueDate && (
              <span className={cn(
                'inline-flex items-center gap-1 text-xs',
                overdue ? 'text-red-400' : 'text-slate-500'
              )}>
                {overdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
