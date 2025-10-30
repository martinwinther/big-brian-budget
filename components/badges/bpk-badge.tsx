import { cn } from '@/lib/utils'
import { bpkTier } from '@/lib/price'

export function BpkBadge({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-bpk-low px-2.5 py-0.5 text-xs font-medium text-white">
        BPK —
      </span>
    )
  }
  const tier = bpkTier(value)
  const bg = {
    excellent: 'bg-bpk-excellent text-white',
    great: 'bg-bpk-great text-white',
    good: 'bg-bpk-good text-white',
    fair: 'bg-bpk-fair text-white',
    low: 'bg-bpk-low text-white',
  }[tier]

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', bg)}>
      BPK {value.toFixed(2)}
    </span>
  )
}
