import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { getAllArticlesMeta } from '@/lib/mdx'

export const metadata = { title: 'Articles · Big Brain Budget' }

export default function ArticlesPage() {
  const articles = getAllArticlesMeta()

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Card key={a.slug} className="p-4">
            <Link href={`/articles/${a.slug}`}>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{a.summary}</p>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}
