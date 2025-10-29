export function B3diBadge({ score }: { score: number }) {
  const segments = 7

  return (
    <div className="inline-flex items-center gap-1">
      <span className="text-xs font-medium">B3DI</span>
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <span key={i} className={`h-2 w-2 rounded-sm ${i < score ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>
    </div>
  )
}
