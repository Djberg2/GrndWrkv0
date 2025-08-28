"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useServiceColors, labelService } from "@/hooks/use-service-colors"

export type Lead = {
  id: number
  fullname?: string
  phone?: string
  address?: string
  service_type?: string
  square_footage?: number
  appointment_date?: string
  appointment_time?: string
  created_at?: string
  assigned_to?: string
  status?: string
}

type User = {
  id: string
  fullname: string
}

type Props = {
  leads: Lead[]
  users: User[]
  onAssign: (leadId: number, userId: string) => Promise<void> | void
  onChangeStatus: (leadId: number, status: string) => Promise<void> | void
}

export function LeadsInbox({ leads, users, onAssign, onChangeStatus }: Props) {
  const [selectedEstimator, setSelectedEstimator] = useState<string>("all")
  const { get } = useServiceColors()

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

  const handleAssign = async (leadId: number, userId: string) => {
    try {
      await onAssign(leadId, userId)
      const user = users.find(u => u.id === userId)
      toast({ title: "Lead assigned", description: user ? `Assigned to ${user.fullname}` : "Assignment saved" })
    } catch (e: any) {
      toast({ title: "Assignment failed", description: String(e?.message || e), variant: "destructive" })
    }
  }

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await onChangeStatus(leadId, newStatus)
      toast({ title: "Status updated", description: `Lead marked as ${newStatus}.` })
    } catch (e: any) {
      toast({ title: "Failed to update status", description: String(e?.message || e), variant: "destructive" })
    }
  }

  const renderLeadCard = (lead: Lead, showAssign: boolean) => (
    <div key={lead.id} className="border rounded-xl bg-white dark:bg-muted p-4 shadow-sm space-y-1">
      <div className="text-md font-semibold">{lead.fullname || "Unnamed"}</div>
      {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
      {lead.address && <div className="text-sm text-gray-500">{lead.address}</div>}
      <div>
        <span className={`inline-block px-2 py-0.5 rounded text-xs shadow-sm ${get(lead.service_type).chip}`}>
          {labelService(lead.service_type || "")}
        </span>
      </div>
      {lead.square_footage && <div className="text-sm text-gray-500">{lead.square_footage} sqft</div>}
      {lead.appointment_date && (
        <div className="text-sm text-gray-600">
          {format(new Date(lead.appointment_date), "PPP")}
          {lead.appointment_time && ` @ ${formatTime(lead.appointment_time)}`}
        </div>
      )}
      <div className="text-xs text-gray-400">
        Submitted: {lead.created_at ? format(new Date(lead.created_at), "PPPp") : "Unknown"}
      </div>

      {showAssign && (
        <div className="pt-2">
          {lead.assigned_to ? (
            <p className="text-sm text-green-600 font-medium">
              Assigned to: {users.find((u) => u.id === lead.assigned_to)?.fullname || lead.assigned_to}
            </p>
          ) : (
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Assign to Estimator:</Label>
              <Select onValueChange={(val) => handleAssign(lead.id, val)}>
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Select Estimator" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.fullname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      <div className="pt-2 flex gap-2 items-center">
        <Button variant="default" size="sm" onClick={() => handleStatusChange(lead.id, "Scheduled")}>
          Mark Scheduled
        </Button>
        <Button variant="secondary" size="sm" onClick={() => handleStatusChange(lead.id, "Quote Sent")}>
          Mark Quote Sent
        </Button>
      </div>
    </div>
  )

  const categorized = {
    pending: leads.filter((lead) => lead.status !== "Scheduled" && lead.status !== "Quote Sent"),
    scheduled: leads.filter((lead) => lead.status === "Scheduled"),
    quoteSent: leads.filter((lead) => lead.status === "Quote Sent"),
  }

  const filterByEstimator = (list: Lead[]) =>
    selectedEstimator === "all" ? list : list.filter(lead => lead.assigned_to === selectedEstimator)

  return (
    <div className="space-y-6">
      <Card className="bg-background border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Leads Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending">🆕 New/Pending ({categorized.pending.length})</TabsTrigger>
              <TabsTrigger value="scheduled">✅ Scheduled ({categorized.scheduled.length})</TabsTrigger>
              <TabsTrigger value="quoteSent">📨 Quote Sent ({categorized.quoteSent.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {categorized.pending.length
                ? categorized.pending.map((lead) => renderLeadCard(lead, true))
                : <p className="text-muted-foreground">No pending leads</p>}
            </TabsContent>

            <TabsContent value="scheduled" className="pt-4">
              <div className="mb-4 max-w-xs">
                <Label>Filter by Estimator</Label>
                <Select value={selectedEstimator} onValueChange={setSelectedEstimator}>
                  <SelectTrigger className="w-full h-8">
                    <SelectValue placeholder="All Estimators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Estimators</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.fullname}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterByEstimator(categorized.scheduled).length
                  ? filterByEstimator(categorized.scheduled).map((lead) => renderLeadCard(lead, false))
                  : <p className="text-muted-foreground">No scheduled leads</p>}
              </div>
            </TabsContent>

            <TabsContent value="quoteSent" className="pt-4">
              <div className="mb-4 max-w-xs">
                <Label>Filter by Estimator</Label>
                <Select value={selectedEstimator} onValueChange={setSelectedEstimator}>
                  <SelectTrigger className="w-full h-8">
                    <SelectValue placeholder="All Estimators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Estimators</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.fullname}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterByEstimator(categorized.quoteSent).length
                  ? filterByEstimator(categorized.quoteSent).map((lead) => renderLeadCard(lead, false))
                  : <p className="text-muted-foreground">No leads with quotes sent</p>}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
