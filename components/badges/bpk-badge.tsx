import { cn } from '@/lib/utils'

export function BpkBadge({
  value,
  tier,
}: {
  value: number
  tier: 'excellent' | 'great' | 'good' | 'fair' | 'low'
}) {
  const bg = {
    excellent: 'bg-bpk-excellent text-white',
    great: 'bg-bpk-great text-white',
    good: 'bg-bpk-good text-white',
    fair: 'bg-bpk-fair text-white',
    low: 'bg-bpk-low text-white',
  }[tier]

  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', bg)}
    >
      BPK {value.toFixed(2)}
    </span>
  )
}
