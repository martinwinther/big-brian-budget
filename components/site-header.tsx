'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/plans', label: 'Weekly Plans' },
  { href: '/methods', label: 'Methods' },
  { href: '/articles', label: 'Articles' },
  { href: '/newsletter', label: 'Newsletter' },
]

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Big Brain Budget
        </Link>
        <nav className="hidden gap-4 md:flex">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm ${
                  active ? 'font-semibold text-emerald-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
