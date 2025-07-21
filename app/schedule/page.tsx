"use client"

import React, { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarDays } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuoteContext } from "@/lib/QuoteContext"

type UnavailableSlots = {
  [date: string]: string[]
}

function convertTo24Hour(timeStr: string): string {
  const [time, meridian] = timeStr.split(" ")
  let [hours, minutes] = time.split(":").map(Number)

  if (meridian === "PM" && hours !== 12) hours += 12
  if (meridian === "AM" && hours === 12) hours = 0

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [unavailableSlots, setUnavailableSlots] = useState<UnavailableSlots>({})
  const [message, setMessage] = useState<string | null>(null)

  const { quoteData } = useQuoteContext()
  const router = useRouter()

  useEffect(() => {
    const fetchBlockedTimes = async () => {
      const mockData: UnavailableSlots = {
        "2025-07-16": ["9:00 AM", "2:00 PM"],
        "2025-07-17": ["10:30 AM", "3:00 PM", "4:30 PM"],
      }
      setUnavailableSlots(mockData)
    }

    fetchBlockedTimes()
  }, [])

  const getDateKey = (date: Date) => date.toISOString().split("T")[0]

  const generateTimeSlots = (): string[] => {
    const slots: string[] = []
    for (let hour = 8; hour <= 17; hour++) {
      for (let min of [0, 30]) {
        const displayHour = ((hour + 11) % 12) + 1
        const meridian = hour >= 12 ? "PM" : "AM"
        const displayMin = min === 0 ? "00" : "30"
        slots.push(`${displayHour}:${displayMin} ${meridian}`)
      }
    }
    return slots
  }

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !quoteData) return

    try {
      const payload = {
        name: quoteData.fullname,
        email: quoteData.email,
        phone: quoteData.phone,
        address: quoteData.address,
        serviceType: quoteData.service_type,
        squareFootage: quoteData.square_footage,
        additionalInfo: quoteData.additional_info,
        photos: quoteData.photo_urls,
        estimate: quoteData.estimate,
        scheduledDateTime: new Date(
          `${getDateKey(selectedDate)}T${convertTo24Hour(selectedTime)}`
        ).toISOString(),
      }
console.log("📦 Payload being submitted:", payload)
      setMessage("⏳ Scheduling your appointment...")
      const res = await fetch("/api/schedule-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || "Unknown error")
      }

      router.push("/schedule/thank-you")
    } catch (err) {
      console.error("❌ Server error:", err)
      setMessage("❌ Failed to reach server.")
    }
  }

  const renderTimeSlots = () => {
    if (!selectedDate) return null

    const dateKey = getDateKey(selectedDate)
    const blocked = unavailableSlots[dateKey] || []

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {generateTimeSlots().map((slot) => {
          const isUnavailable = blocked.includes(slot)
          const isSelected = selectedTime === slot

          return (
            <Button
              key={slot}
              variant={isUnavailable ? "outline" : "secondary"}
              disabled={isUnavailable}
              onClick={() => setSelectedTime(slot)}
              className={cn(
                "text-sm",
                isSelected && "bg-green-600 text-white hover:bg-green-600",
                isUnavailable && "opacity-50 cursor-not-allowed"
              )}
            >
              {slot}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg py-8">
          <div className="flex flex-col items-center">
            <CalendarDays className="w-10 h-10 mb-2 text-white" />
            <CardTitle className="text-2xl font-bold">Book Your On-Site Quote</CardTitle>
            <p className="text-sm text-white mt-1">Quick scheduling for a hassle-free consultation</p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={(date) => {
                setSelectedDate(date ?? null)
                setSelectedTime(null)
                setMessage(null)
              }}
              className="rounded-md border"
              disabled={(date) => {
                const now = new Date()
                const cutoff = new Date(now.setDate(now.getDate() + 2))
                cutoff.setHours(0, 0, 0, 0)
                return date < cutoff
              }}
            />
          </div>

          {renderTimeSlots()}

          {selectedDate && selectedTime && (
            <div className="text-center space-y-4">
              <p className="text-lg font-medium text-gray-700">
                You selected {selectedDate.toDateString()} at {selectedTime}
              </p>
              <Button
                onClick={handleConfirm}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Confirm Appointment
              </Button>
              {message && <p className="text-green-700">{message}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
