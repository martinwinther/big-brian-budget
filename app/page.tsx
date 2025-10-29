import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Eat smart on a smart budget.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Transparent, budget-first recipes scored for brain-positive features (B3DI) and
          Brain‑per‑Krone (BPK). Start with our 7‑day Starter Week.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <a href="/recipes">Browse recipes</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/plans/starter-week">Starter Week</a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-4">
          <h3 className="font-semibold">Budget‑first</h3>
          <p className="text-sm text-muted-foreground">
            Real DK prices, price/serving, and cost breakdowns.
          </p>
        </div>
        <div className="rounded-2xl border p-4">
          <h3 className="font-semibold">Evidence‑aligned</h3>
          <p className="text-sm text-muted-foreground">
            Simple B3DI scoring—no medical claims, just clarity.
          </p>
        </div>
        <div className="rounded-2xl border p-4">
          <h3 className="font-semibold">Cook fast</h3>
          <p className="text-sm text-muted-foreground">
            15–30 minute meals, batch‑friendly, student‑proof.
          </p>
        </div>
      </div>
    </section>
  )
}
