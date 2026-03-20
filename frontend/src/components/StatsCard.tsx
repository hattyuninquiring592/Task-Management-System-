import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: number
  color: string
  icon: React.ReactNode
}

export function StatsCard({ label, value, color, icon }: StatsCardProps) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
