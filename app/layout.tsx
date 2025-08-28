import './globals.css'
import { Inter } from 'next/font/google'
import { QuoteProvider } from '@/lib/QuoteContext'
import { Toaster } from '@/components/ui/toaster'
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
          <Toaster />
        </QuoteProvider>
      </body>
    </html>
  )
}
