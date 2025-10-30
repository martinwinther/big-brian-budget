import Image from 'next/image'
import { notFound } from 'next/navigation'
import path from 'path'
import fs from 'fs'
import { getRecipeBySlug, getAllRecipesMeta } from '@/lib/mdx'
import { B3diBadge } from '@/components/badges/b3di-badge'
import { computeB3DI } from '@/lib/b3di'
import { loadPriceBook, estimatePrice, computeBpk } from '@/lib/price'
import { BpkBadge } from '@/components/badges/bpk-badge'
import PriceBreakdownTable from '@/components/price-breakdown-table'

export async function generateStaticParams() {
  const list = getAllRecipesMeta()
  return list.map((r) => ({ slug: r.slug }))
}

export default async function RecipeDetailPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content', 'recipes', `${params.slug}.mdx`)

  if (!fs.existsSync(filePath)) return notFound()

  const { frontmatter, content } = await getRecipeBySlug(params.slug)
  const fm: any = frontmatter
  const b3diScore = computeB3DI(fm.b3di)

  const pb = loadPriceBook('dk')
  let perServing: number | null = null
  let total: number | null = null
  let breakdown: any[] = []
  let currency = pb.meta.currency
  let warnings: string[] = []

  if (fm.price_inputs && fm.servings) {
    const res = estimatePrice(fm.price_inputs, fm.servings, pb)
    perServing = res.per_serving
    total = res.total
    breakdown = res.breakdown as any
    currency = res.currency
    warnings = res.warnings
  }

  const bpk = computeBpk(b3diScore, perServing)

  return (
    <article className="space-y-6">
      <header className="sticky top-[3.25rem] z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-semibold">{fm.title}</h1>
            <div className="flex items-center gap-3">
              <B3diBadge score={b3diScore} />
              <span className="rounded bg-amber px-2 py-0.5 text-xs text-amber-foreground">
                {currency} {perServing !== null ? `${perServing.toFixed(2)} /serv` : '— /serv'}
              </span>
              <BpkBadge value={bpk} />
            </div>
          </div>
        </div>
      </header>

      {fm.hero_image ? (
        <Image
          src={fm.hero_image}
          alt={fm.image_alt || fm.title}
          width={1200}
          height={600}
          className="h-64 w-full rounded-xl object-cover"
        />
      ) : null}

      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Price estimate incomplete: {warnings.join('; ')}
        </div>
      )}

      <div className="prose prose-neutral max-w-none dark:prose-invert">{content}</div>

      <section aria-labelledby="price-breakdown">
        <h2 id="price-breakdown" className="mt-4 text-lg font-semibold">
          Cost breakdown
        </h2>
        <PriceBreakdownTable currency={currency} rows={breakdown as any} total={total} />
      </section>
    </article>
  )
}
