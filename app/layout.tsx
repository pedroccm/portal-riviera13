import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portal Riviera 13',
  description: 'Portal não oficial do condomínio Riviera 13',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen pb-20 bg-surface">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  )
}