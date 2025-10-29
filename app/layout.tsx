import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SiteHeader from '@/components/site-header'
import Providers from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Big Brain Budget',
  description: 'Eat smart on a smart budget — evidence-aligned, ultra-budget meals.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <a href="#content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <SiteHeader />
        <Providers>
          <main id="content" className="mx-auto max-w-6xl px-4 py-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
