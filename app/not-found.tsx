export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center bg-background text-foreground">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      </div>
    </main>
  )
}

