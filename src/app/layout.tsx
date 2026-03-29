import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Lumio — Personalized Learning for Every Child',
  description:
    'AI-powered platform helping teachers and parents create personalized learning support plans for children with diverse learning needs, ages 5-18.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
