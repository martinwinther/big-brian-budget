import { notFound } from 'next/navigation'
import path from 'path'
import fs from 'fs'
import { getArticleBySlug, getAllArticlesMeta } from '@/lib/mdx'

export async function generateStaticParams() {
  const list = getAllArticlesMeta()
  return list.map((a) => ({ slug: a.slug }))
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'content', 'articles', `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return notFound()

  const { frontmatter, content } = await getArticleBySlug(slug)

  return (
    <article className="prose prose-neutral max-w-none dark:prose-invert">
      <h1>{(frontmatter as any).title}</h1>
      <div>{content}</div>
    </article>
  )
}
