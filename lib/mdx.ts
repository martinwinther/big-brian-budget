import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import { computeB3DI } from './b3di'

export type RecipeFrontmatter = {
  slug: string
  title: string
  summary?: string
  servings?: number
  prep_minutes?: number
  cook_minutes?: number
  hero_image?: string
  image_alt?: string
  categories?: string[]
  tags?: string[]
  allergens?: string[]
  macros?: {
    calories?: number
    protein_g?: number
    fiber_g?: number
    fat_g?: number
  }
  b3di?: {
    evoo?: boolean
    nuts?: boolean
    berries?: boolean
    legumes?: boolean
    leafy_greens?: boolean
    whole_grains?: boolean
    oily_fish?: boolean
  }
  price_inputs?: unknown // handled later
  ingredients_list?: string[]
  steps?: string[]
  substitutions?: string[]
  notes?: string[]
}

export type ArticleFrontmatter = {
  slug: string
  title: string
  summary?: string
  hero_image?: string
  image_alt?: string
  tags?: string[]
}

const ROOT = process.cwd()
const RECIPES_DIR = path.join(ROOT, 'content', 'recipes')
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')

function listFiles(dir: string) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
}

export type Meta = {
  slug: string
  title: string
  summary?: string
  hero_image?: string
  image_alt?: string
  tags?: string[]
  // Computed
  b3di_score?: number
  price_per_serving_dkk?: number | null
  bpk?: number | null
  prep_minutes?: number
  cook_minutes?: number
  servings?: number
}

export function getAllRecipesMeta(): Meta[] {
  return listFiles(RECIPES_DIR).map((file) => {
    const full = path.join(RECIPES_DIR, file)
    const src = fs.readFileSync(full, 'utf8')
    const { data } = matter(src)

    const fm = data as RecipeFrontmatter
    const b3di_score = computeB3DI(fm.b3di)

    return {
      slug: fm.slug || file.replace(/\.mdx$/, ''),
      title: fm.title,
      summary: fm.summary,
      hero_image: fm.hero_image,
      image_alt: fm.image_alt,
      tags: fm.tags,
      b3di_score,
      price_per_serving_dkk: null,
      bpk: null,
      prep_minutes: fm.prep_minutes,
      cook_minutes: fm.cook_minutes,
      servings: fm.servings,
    }
  })
}

export function getAllArticlesMeta(): Meta[] {
  return listFiles(ARTICLES_DIR).map((file) => {
    const full = path.join(ARTICLES_DIR, file)
    const src = fs.readFileSync(full, 'utf8')
    const { data } = matter(src)

    const fm = data as ArticleFrontmatter

    return {
      slug: fm.slug || file.replace(/\.mdx$/, ''),
      title: fm.title,
      summary: fm.summary,
      hero_image: fm.hero_image,
      image_alt: fm.image_alt,
      tags: fm.tags,
    }
  })
}

type CompileResult = {
  frontmatter: any
  content: any
}

export async function getRecipeBySlug(slug: string): Promise<CompileResult> {
  const file = path.join(RECIPES_DIR, `${slug}.mdx`)
  const source = fs.readFileSync(file, 'utf8')
  const { content, data } = matter(source)

  const mdx = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      },
    },
    components: {}, // custom components injected later
  })

  return { frontmatter: data, content: mdx.content }
}

export async function getArticleBySlug(slug: string): Promise<CompileResult> {
  const file = path.join(ARTICLES_DIR, `${slug}.mdx`)
  const source = fs.readFileSync(file, 'utf8')
  const { content, data } = matter(source)

  const mdx = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      },
    },
    components: {},
  })

  return { frontmatter: data, content: mdx.content }
}
