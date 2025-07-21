"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, setHours, setMinutes, addWeeks, subWeeks, addMonths, subMonths, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

const VIEWS = {
  WEEK: "week",
  MONTH: "month",
} as const

const SERVICE_COLORS: Record<string, string> = {
  "lawn-mowing": "bg-green-100 text-green-800",
  "tree-removal": "bg-red-100 text-red-800",
  "landscaping-design": "bg-blue-100 text-blue-800",
  "default": "bg-gray-200 text-gray-800",
}

type Lead = {
  id: number
  fullname: string
  appointment_date?: string
  appointment_time?: string
  service_type: string
}

type Availability = {
  availableDays: string[]
  workingHours: Record<string, { start: number; end: number }>
  quoteDuration: number
}

export default function CalendarView() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [view, setView] = useState<"week" | "month">("month")
  const [today, setToday] = useState(new Date())
  const [filterType, setFilterType] = useState<string>("All")
  const [availability, setAvailability] = useState<Availability>(() => {
    const stored = localStorage.getItem("availabilitySettings")
    return stored
      ? JSON.parse(stored)
      : {
          availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          workingHours: {
            Monday: { start: 8, end: 17 },
            Tuesday: { start: 8, end: 17 },
            Wednesday: { start: 8, end: 17 },
            Thursday: { start: 8, end: 17 },
            Friday: { start: 8, end: 17 },
            Saturday: { start: 8, end: 14 },
          },
          quoteDuration: 30,
        }
  })

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("id, fullname, appointment_date, appointment_time, service_type")
        .not("appointment_date", "is", null)

      if (error) console.error("Error fetching appointments:", error)
      if (data) setLeads(data as Lead[])
    }

    fetchAppointments()
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("availabilitySettings")
      if (stored) setAvailability(JSON.parse(stored))
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const getAppointmentsByDate = (date: Date) => {
    return leads
      .filter((lead) => {
        if (!lead.appointment_date) return false
        const matchesFilter = filterType === "All" || lead.service_type === filterType
        const weekday = format(new Date(lead.appointment_date), "EEEE")
        const isAvailable = availability.availableDays.includes(weekday)
        return (
          matchesFilter &&
          isAvailable &&
          format(new Date(lead.appointment_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
        )
      })
      .sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''))
  }

  const renderDay = (date: Date) => {
    const appointments = getAppointmentsByDate(date)
    const highlightToday = isToday(date) ? "border-blue-500" : "border-border"
    return (
      <div className={`border ${highlightToday} dark:border-border rounded-xl p-3 min-h-[160px] bg-background dark:bg-muted shadow-sm`}>
        <div className="text-sm font-semibold text-foreground mb-2">
          {format(date, "EEE MMM d")}
        </div>
        {appointments.map((appt) => {
          const [hourStr, minuteStr] = appt.appointment_time?.split(":") || []
          const time = hourStr && minuteStr
            ? format(setMinutes(setHours(new Date(), Number(hourStr)), Number(minuteStr)), "hh:mm a")
            : "Unknown time"
          const color = SERVICE_COLORS[appt.service_type] || SERVICE_COLORS.default
          return (
            <div
              key={appt.id}
              className={`text-xs px-2 py-1 rounded-lg mb-1 shadow ${color}`}
            >
              <div className="font-medium truncate">
                {appt.fullname}
              </div>
              <div className="text-[11px]">
                {appt.service_type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} @ {time}
              </div>
              <div className="text-[10px] text-gray-400">{availability.quoteDuration} min</div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderMonthView = () => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const days = [...Array(daysInMonth)].map((_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1))

    return (
      <div className="grid grid-cols-7 gap-3">
        {days.map((date) => (
          <div key={date.toDateString()}>{renderDay(date)}</div>
        ))}
      </div>
    )
  }

  const renderWeekView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 6) // 6 AM - 8 PM
    const currentHour = new Date().getHours()
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate() - dayOfWeek)
    const days = [...Array(7)].map((_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))

    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8">
          <div className="border-r"></div>
          {days.map((day) => (
            <div key={day.toDateString()} className="text-sm font-semibold text-center py-2">
              {format(day, "EEE MMM d")}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8">
          <div className="flex flex-col">
            {hours.map((hour) => (
              <div key={hour} className="h-16 px-2 text-xs text-right text-gray-400">
                {format(setHours(new Date(), hour), "h a")}
              </div>
            ))}
          </div>
          {days.map((day) => {
            const appointments = getAppointmentsByDate(day)
            return (
              <div key={day.toDateString()} className="flex flex-col relative">
                {hours.map((hour) => (
                  <div key={hour} className="h-16 border-t border-gray-200 relative">
                    {appointments.map((appt) => {
                      const [apptHour] = appt.appointment_time?.split(":") || []
                      if (Number(apptHour) !== hour) return null
                      const color = SERVICE_COLORS[appt.service_type] || SERVICE_COLORS.default
                      return (
                        <div
                          key={appt.id}
                          className={`absolute inset-1 rounded px-2 py-1 text-xs shadow ${color}`}
                        >
                          {appt.fullname} - {appt.service_type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      )
                    })}
                    {isToday(day) && hour === currentHour && (
                      <div className="absolute left-0 right-0 h-0.5 bg-blue-500 top-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const handlePrev = () => {
    setToday((prev) => view === "week" ? subWeeks(prev, 1) : subMonths(prev, 1))
  }

  const handleNext = () => {
    setToday((prev) => view === "week" ? addWeeks(prev, 1) : addMonths(prev, 1))
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const serviceTypes = Array.from(new Set(leads.map((lead) => lead.service_type)))

  return (
    <div className="space-y-6">
      <Card className="bg-background border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-4 text-xl font-bold">
            <Button variant="outline" size="sm" onClick={handlePrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              {monthNames[today.getMonth()]} {today.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={handleNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardTitle>
          <div className="space-x-3 flex items-center">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Services</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>{type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
            <Button variant={view === VIEWS.WEEK ? "default" : "outline"} onClick={() => setView("week")}>Week</Button>
            <Button variant={view === VIEWS.MONTH ? "default" : "outline"} onClick={() => setView("month")}>Month</Button>
          </div>
        </CardHeader>
        <CardContent>
          {view === VIEWS.WEEK ? renderWeekView() : renderMonthView()}
        </CardContent>
      </Card>
    </div>
  )
}
