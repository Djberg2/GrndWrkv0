"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

export default function LeadsInbox() {
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) console.error("Error fetching leads:", error)
      else setLeads(data || [])
    }

    fetchLeads()
  }, [])

  const formatTime = (timeStr: string) => {
    try {
      const [hour, minute] = timeStr.split(":" )
      const date = new Date()
      date.setHours(parseInt(hour), parseInt(minute))
      return format(date, "hh:mm a")
    } catch {
      return timeStr
    }
  }

  const renderLeadCard = (lead: any) => (
    <div key={lead.id} className="border rounded-xl bg-white dark:bg-muted p-4 shadow-sm space-y-1">
      <div className="text-md font-semibold">{lead.fullname || "Unnamed"}</div>
      {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
      {lead.address && <div className="text-sm text-gray-500">{lead.address}</div>}
      <div className="text-sm text-gray-500 italic">
        {lead.service_type?.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Unknown Service"}
      </div>
      {lead.appointment_date && (
        <div className="text-sm text-gray-600">
          {format(new Date(lead.appointment_date), "PPP")}
          {lead.appointment_time && ` @ ${formatTime(lead.appointment_time)}`}
        </div>
      )}
      <div className="text-xs text-gray-400">
        Submitted: {lead.created_at ? format(new Date(lead.created_at), "PPPp") : "Unknown"}
      </div>
      <div className="pt-2">
        <Button variant="default" size="sm">Confirm</Button>
      </div>
    </div>
  )

  const categorized = {
    pending: leads.filter((lead) => !lead.appointment_date),
    confirmed: leads.filter((lead) => lead.appointment_date),
  }

  return (
    <div className="space-y-6">
      <Card className="bg-background border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Leads Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending">🕒 Pending ({categorized.pending.length})</TabsTrigger>
              <TabsTrigger value="confirmed">✅ Confirmed ({categorized.confirmed.length})</TabsTrigger>
            </TabsList>
            <TabsContent
              value="pending"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4"
            >
              {categorized.pending.length
                ? categorized.pending.map(renderLeadCard)
                : <p className="text-muted-foreground">No pending leads</p>}
            </TabsContent>
            <TabsContent
              value="confirmed"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4"
            >
              {categorized.confirmed.length
                ? categorized.confirmed.map(renderLeadCard)
                : <p className="text-muted-foreground">No confirmed leads</p>}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}