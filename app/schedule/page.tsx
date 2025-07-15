"use client"

import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [unavailableSlots, setUnavailableSlots] = useState<{ [key: string]: string[] }>({})

  // Simulate fetching unavailable time slots from a backend
  useEffect(() => {
    const fetchUnavailableSlots = async () => {
      // Replace with real API call
      const fakeData = {
        "2025-07-16": ["9:00 AM", "2:00 PM"],
        "2025-07-17": ["10:30 AM", "3:00 PM", "4:30 PM"],
      }
      setUnavailableSlots(fakeData)
    }
    fetchUnavailableSlots()
  }, [])

  const generateTimeSlots = (): string[] => {
    const start = 9
    const end = 17
    const slots: string[] = []
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour}:00 AM`)
      slots.push(`${hour}:30 AM`)
    }
    return slots.map((time) => {
      const [hr, min, meridian] = time.split(/[: ]/)
      const hrNum = parseInt(hr)
      const adjustedHour = meridian === "PM" && hrNum < 12 ? hrNum + 12 : hrNum
      return `${adjustedHour}:${min}`.padStart(5, "0")
    })
  }

  const getDateKey = (date: Date) => {
    return date.toISOString().split("T")[0] // Format: YYYY-MM-DD
  }

  const renderTimeSlots = () => {
    if (!selectedDate) return null
    const dateKey = getDateKey(selectedDate)
    const blocked = unavailableSlots[dateKey] || []

    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {generateTimeSlots().map((time) => (
          <Button
            key={time}
            onClick={() => setSelectedTime(time)}
            disabled={blocked.includes(time)}
            className={`${selectedTime === time ? "bg-green-600 text-white" : ""}`}
            variant={blocked.includes(time) ? "outline" : "default"}
          >
            {time}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">Schedule your onsite quote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              inline
              minDate={new Date()}
            />
            {renderTimeSlots()}
            {selectedDate && selectedTime && (
              <div className="mt-6 text-center">
                <p className="text-lg font-medium text-gray-700">
                  You selected {selectedDate.toDateString()} at {selectedTime}
                </p>
                <Button className="mt-4 bg-green-600 text-white hover:bg-green-700">
                  Confirm Appointment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SchedulePage
