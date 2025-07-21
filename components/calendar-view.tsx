"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, setHours, setMinutes, isToday, addWeeks, subWeeks, addMonths, subMonths } from "date-fns"
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
  phone?: string
  notes?: string
  address?: string
}

export default function CalendarView() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [view, setView] = useState<"week" | "month">("month")
  const [today, setToday] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Lead | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("id, fullname, appointment_date, appointment_time, service_type, phone, notes, address")
        .not("appointment_date", "is", null)

      if (error) console.error("Error fetching appointments:", error)
      if (data) setLeads(data as Lead[])
    }

    fetchAppointments()
  }, [])

  const getAppointmentsByDate = (date: Date) => {
    return leads.filter((lead) => {
      if (!lead.appointment_date) return false
      return format(new Date(lead.appointment_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    })
  }

  const handlePrev = () => {
    setToday((prev) => view === "week" ? subWeeks(prev, 1) : subMonths(prev, 1))
  }

  const handleNext = () => {
    setToday((prev) => view === "week" ? addWeeks(prev, 1) : addMonths(prev, 1))
  }

  const renderDay = (date: Date) => {
    const appointments = getAppointmentsByDate(date)
    const highlightToday = isToday(date) ? "border-blue-500" : "border-gray-200"
    return (
      <div className={`border ${highlightToday} dark:border-gray-700 rounded-lg p-2 h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900`}>
        <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {format(date, "EEE MMM d")}
        </div>
        {appointments.map((appt) => {
          const color = SERVICE_COLORS[appt.service_type] || SERVICE_COLORS.default
          return (
            <div
              key={appt.id}
              className={`text-xs truncate px-1 py-0.5 rounded mb-1 cursor-pointer shadow ${color}`}
              onClick={() => setSelectedAppointment(appt)}
            >
              • {appt.fullname} ({appt.service_type.replace(/-/g, " ")})
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
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => (
          <div key={date.toDateString()}>{renderDay(date)}</div>
        ))}
      </div>
    )
  }

  const renderWeekView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 6)
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate() - dayOfWeek)
    const days = [...Array(7)].map((_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))

    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8">
          <div className="border-r"></div>
          {days.map((day, index) => (
            <div key={day.toDateString()} className="text-sm font-semibold text-center py-2 border-l border-gray-200">
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
              <div key={day.toDateString()} className="flex flex-col relative border-l border-gray-200">
                {hours.map((hour) => (
                  <div key={hour} className="h-16 border-t border-gray-200 relative">
                    {appointments.map((appt) => {
                      const [apptHour] = appt.appointment_time?.split(":" ) || []
                      if (Number(apptHour) !== hour) return null
                      const color = SERVICE_COLORS[appt.service_type] || SERVICE_COLORS.default
                      return (
                        <div
                          key={appt.id}
                          className={`absolute inset-1 rounded px-2 py-1 text-xs shadow ${color} cursor-pointer`}
                          onClick={() => setSelectedAppointment(appt)}
                        >
                          {appt.fullname} - {appt.service_type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrev}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {format(today, "MMMM yyyy")}
              </h2>
              <Button variant="outline" size="sm" onClick={handleNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-x-2">
              <Button variant={view === VIEWS.WEEK ? "default" : "outline"} onClick={() => setView("week")}>Week</Button>
              <Button variant={view === VIEWS.MONTH ? "default" : "outline"} onClick={() => setView("month")}>Month</Button>
            </div>
          </div>
          {view === VIEWS.WEEK ? renderWeekView() : renderMonthView()}
        </CardContent>
      </Card>

      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p><strong>Customer:</strong> {selectedAppointment.fullname}</p>
              <p><strong>Phone:</strong> {selectedAppointment.phone || "—"}</p>
              <p><strong>Address:</strong> {selectedAppointment.address || "—"}</p>
              <p><strong>Service:</strong> {selectedAppointment.service_type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p><strong>Date:</strong> {format(new Date(selectedAppointment.appointment_date || ''), "PPP")}</p>
              <p><strong>Time:</strong> {
                selectedAppointment.appointment_time ? (
                  (() => {
                    const [hourStr, minuteStr] = selectedAppointment.appointment_time.split(":")
                    if (!hourStr || !minuteStr) return "—"
                    const date = new Date()
                    const formatted = format(setMinutes(setHours(date, parseInt(hourStr)), parseInt(minuteStr)), "hh:mm a")
                    return formatted
                  })()
                ) : "—"
              }</p>
              <p><strong>Notes:</strong> {selectedAppointment.notes || "—"}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
