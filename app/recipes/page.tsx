import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { getAllRecipesMeta } from '@/lib/mdx'
import { B3diBadge } from '@/components/badges/b3di-badge'
import { BpkBadge } from '@/components/badges/bpk-badge'
import { loadPriceBook, estimatePrice, computeBpk } from '@/lib/price'

export const metadata = { title: 'Recipes · Big Brain Budget' }

export default async function RecipesPage() {
  const recipes = getAllRecipesMeta()
  const pb = loadPriceBook('dk')

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Recipes</h1>
      <p className="text-sm text-muted-foreground">Budget-first DK recipes with B3DI + Brain-per-Krone (BPK).</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((r) => {
          let perServing: number | null = null
          let bpk: number | null = null
          try {
            const fs = require('fs')
            const path = require('path')
            const matter = require('gray-matter')
            const p = path.join(process.cwd(), 'content', 'recipes', `${r.slug}.mdx`)
            const src = fs.readFileSync(p, 'utf8')
            const { data } = matter(src)
            if (data.price_inputs && data.servings) {
              const res = estimatePrice(data.price_inputs, data.servings, pb)
              perServing = res.per_serving
              bpk = computeBpk(r.b3di_score || 0, perServing)
            }
          } catch {}

          return (
          <Card key={r.slug} className="overflow-hidden">
            <Link href={`/recipes/${r.slug}`}>
              {r.hero_image ? (
                <Image
                  src={r.hero_image}
                  alt={r.image_alt || r.title}
                  width={800}
                  height={500}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-muted" />
              )}

                <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{r.title}</h3>
                  <B3diBadge score={r.b3di_score || 0} />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.summary}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{(r.prep_minutes || 0) + (r.cook_minutes || 0)} min</span>
                  <span>•</span>
                  <span>{r.servings || 0} servings</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <span className="rounded bg-amber px-2 py-0.5 text-xs text-amber-foreground">
                      DKK {perServing !== null ? `${perServing.toFixed(2)} /serv` : '— /serv'}
                    </span>
                    <BpkBadge value={bpk} />
                </div>
              </div>
            </Link>
          </Card>
          )
        })}
      </div>
    </section>
  )
}
