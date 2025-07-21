"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

interface DayAvailability {
  name: string
  enabled: boolean
  start: string
  end: string
  lunch: string
}

interface BlockedDate {
  label: string
  date: string
}

interface AvailabilitySettingsType {
  bookingWindow: string
  minNotice: string
  quoteDuration: string
  bufferTime: string
  days: DayAvailability[]
  blockedDates: BlockedDate[]
}

export function AvailabilitySettings() {
  const [availability, setAvailability] = useState<AvailabilitySettingsType>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("availabilitySettings")
      return stored
        ? JSON.parse(stored)
        : {
            bookingWindow: "30",
            minNotice: "24",
            quoteDuration: "60",
            bufferTime: "15",
            days: [
              { name: "Monday", enabled: true, start: "8", end: "17", lunch: "12-13" },
              { name: "Tuesday", enabled: true, start: "8", end: "17", lunch: "12-13" },
              { name: "Wednesday", enabled: true, start: "8", end: "17", lunch: "12-13" },
              { name: "Thursday", enabled: true, start: "8", end: "17", lunch: "12-13" },
              { name: "Friday", enabled: true, start: "8", end: "17", lunch: "12-13" },
              { name: "Saturday", enabled: true, start: "8", end: "14", lunch: "12-13" },
              { name: "Sunday", enabled: false, start: "8", end: "14", lunch: "12-13" },
            ],
            blockedDates: [],
          }
    }
    return {
      bookingWindow: "30",
      minNotice: "24",
      quoteDuration: "60",
      bufferTime: "15",
      days: [],
      blockedDates: [],
    }
  })

  const updateField = (field: keyof AvailabilitySettingsType, value: any) => {
    setAvailability((prev) => ({ ...prev, [field]: value }))
  }

  const updateDay = <K extends keyof DayAvailability>(index: number, key: K, value: DayAvailability[K]) => {
    const updatedDays = [...availability.days]
    updatedDays[index][key] = value
    setAvailability({ ...availability, days: updatedDays })
  }

  const addBlockedDate = () => {
    const newDate = prompt("Enter blocked date (YYYY-MM-DD):")
    if (!newDate) return
    const label = prompt("Enter reason or label for this block:") || "Blocked Date"
    const updated = [...availability.blockedDates, { label, date: newDate }]
    setAvailability({ ...availability, blockedDates: updated })
  }

  const removeBlockedDate = (indexToRemove: number) => {
    const updated = availability.blockedDates.filter((_, i) => i !== indexToRemove)
    setAvailability({ ...availability, blockedDates: updated })
  }

  const handleSave = () => {
    localStorage.setItem("availabilitySettings", JSON.stringify(availability))
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="booking-window">Booking Window (days ahead)</Label>
              <Select value={availability.bookingWindow} onValueChange={(val) => updateField("bookingWindow", val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                  <SelectItem value="60">2 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="min-notice">Minimum Notice (hours)</Label>
              <Select value={availability.minNotice} onValueChange={(val) => updateField("minNotice", val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quote-duration">Default Quote Duration</Label>
              <Select value={availability.quoteDuration} onValueChange={(val) => updateField("quoteDuration", val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="buffer-time">Buffer Time Between Appointments</Label>
              <Select value={availability.bufferTime} onValueChange={(val) => updateField("bufferTime", val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availability.days.map((day, index) => (
            <div key={day.name}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Switch checked={day.enabled} onCheckedChange={(val) => updateDay(index, "enabled", val)} />
                  <Label className="w-24 font-medium">{day.name}</Label>
                </div>
                {day.enabled && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">Start:</Label>
                      <Select value={day.start} onValueChange={(val) => updateDay(index, "start", val)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 6).map((hour) => (
                            <SelectItem key={hour} value={hour.toString()}>{hour}:00</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">End:</Label>
                      <Select value={day.end} onValueChange={(val) => updateDay(index, "end", val)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 12).map((hour) => (
                            <SelectItem key={hour} value={hour.toString()}>{hour}:00</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">Lunch:</Label>
                      <Select value={day.lunch} onValueChange={(val) => updateDay(index, "lunch", val)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="12-13">12-1 PM</SelectItem>
                          <SelectItem value="13-14">1-2 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Blocked Dates</CardTitle>
          <Button size="sm" onClick={addBlockedDate}>Add Blocked Date</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availability.blockedDates.map((block, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{block.label}</div>
                  <div className="text-sm text-gray-500">{format(new Date(block.date), "MMMM d, yyyy")}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => removeBlockedDate(index)}>Remove</Button>
              </div>
            ))}
            {availability.blockedDates.length === 0 && (
              <div className="text-gray-500 text-sm">No blocked dates added yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>Save Availability Settings</Button>
      </div>
    </div>
  )
}
