export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 You're Booked!</h1>
        <p className="text-lg text-gray-700 mb-6">
          We've received your appointment request. A landscaper will reach out to confirm.
        </p>
        <a
          href="/"
          className="text-green-700 font-medium underline hover:text-green-900 transition"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}
