import Image from 'next/image'
import { notFound } from 'next/navigation'
import path from 'path'
import fs from 'fs'
import { getRecipeBySlug, getAllRecipesMeta } from '@/lib/mdx'
import { B3diBadge } from '@/components/badges/b3di-badge'
import { computeB3DI } from '@/lib/b3di'

export async function generateStaticParams() {
  const list = getAllRecipesMeta()
  return list.map((r) => ({ slug: r.slug }))
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'content', 'recipes', `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return notFound()

  const { frontmatter, content } = await getRecipeBySlug(slug)
  const fm: any = frontmatter
  const b3diScore = computeB3DI(fm.b3di)

  return (
    <article className="space-y-6">
      <header className="sticky top-[3.25rem] z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-semibold">{fm.title}</h1>
            <div className="flex items-center gap-3">
              <B3diBadge score={b3diScore} />
              <span className="rounded bg-amber px-2 py-0.5 text-xs text-amber-foreground">
                DKK — /serv
              </span>
              <span className="rounded bg-bpk-low px-2 py-0.5 text-xs text-white">BPK —</span>
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

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div>{content}</div>
      </div>
    </article>
  )
}
