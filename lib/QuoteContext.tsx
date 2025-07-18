// lib/QuoteContext.tsx

"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

type QuoteData = {
  fullname: string
  email: string
  phone: string
  address: string
  service_type: string
  square_footage: string
  additional_info: string
  photo_urls: string[]
  estimate: string
}

type QuoteContextType = {
  quoteData: QuoteData | null
  setQuoteData: (data: QuoteData) => void
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)

  return (
    <QuoteContext.Provider value={{ quoteData, setQuoteData }}>
      {children}
    </QuoteContext.Provider>
  )
}

export const useQuoteContext = () => {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuoteContext must be used within a QuoteProvider')
  }
  return context
}
