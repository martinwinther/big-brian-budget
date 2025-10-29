'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { B3diBadge } from '@/components/badges/b3di-badge'
import { BpkBadge } from '@/components/badges/bpk-badge'

export function GlossaryTooltip({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger className="underline decoration-dotted">{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs text-sm">
        <p>{term}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// Example usage inside MDX will be added later; components exported for injection if needed.
export const MDXComponents = { GlossaryTooltip, B3diBadge, BpkBadge }
