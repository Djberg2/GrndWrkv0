"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    const customerData = JSON.parse(localStorage.getItem("quoteData") || "null")
    if (customerData) {
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-green-700">🎉 Appointment Sent for Confirmation</h1>
        <p className="text-lg text-gray-700">
          Thank you for requesting a quote! One of our local landscapers will reach out shortly to confirm your appointment details.
        </p>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block text-sm font-medium">
          Expect a text and email shortly with next steps.
        </div>
        <a
          href="/"
          className="inline-block mt-4 text-green-700 font-semibold underline hover:text-green-900 transition"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}
