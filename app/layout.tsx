import './globals.css'
import { Inter } from 'next/font/google'
import { QuoteProvider } from '@/lib/QuoteContext'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GrndWrk',
  description: 'Instant landscaping estimates and scheduling',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QuoteProvider>
          {children}
        </QuoteProvider>
      </body>
    </html>
  )
}
