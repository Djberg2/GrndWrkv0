"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Eye,
  ImageIcon
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { useServiceColors, slugService, labelService } from "@/hooks/use-service-colors"

// Updated Lead type with additional_info field
export type Lead = {
  id: number
  fullname: string
  email: string
  phone: string
  service_type: string
  square_footage: number
  estimate: string
  status: string
  created_at: string
  appointment_date?: string
  appointment_time?: string
  photo_urls: string[]
  address: string
  notes?: string
  additional_info?: string
  assigned_to?: string | null
}

type User = { id: string; fullname: string }

type LeadsTableProps = {
  leads: Lead[]
  users: User[]
  onChangeStatus: (id: number, newStatus: string) => Promise<void> | void
  onChangeNotes: (id: number, notes: string) => Promise<void> | void
  onAssign: (id: number, userId: string) => Promise<void> | void
}

export function LeadsTable({ leads, users, onChangeStatus, onChangeNotes, onAssign }: LeadsTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const { get } = useServiceColors()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800"
      case "Scheduled": return "bg-green-100 text-green-800"
      case "Contacted": return "bg-yellow-100 text-yellow-800"
      case "Quote Sent": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatAppointment = (date?: string, time?: string, longForm = false) => {
    if (!date || !time) return "—"
    const dt = new Date(`${date}T${time}`)
    return longForm
      ? dt.toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })
      : dt.toLocaleString("en-US", {
          month: "numeric",
          day: "2-digit",
          year: "2-digit",
          hour: "numeric",
          minute: "2-digit",
        })
  }

  const formatCreatedDate = (created_at: string) => {
    const dt = new Date(created_at)
    return dt.toLocaleString("en-US", {
      month: "numeric",
      day: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await onChangeStatus(id, newStatus)
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status: newStatus })
      toast({ title: "Status updated", description: `Lead marked as ${newStatus}.` })
    } catch (error: any) {
      toast({ title: "Failed to update status", description: String(error?.message || error), variant: "destructive" })
    }
  }

  const handleNotesUpdate = async (id: number, newNotes: string) => {
    try {
      await onChangeNotes(id, newNotes)
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, notes: newNotes })
      toast({ title: "Notes saved" })
    } catch (error: any) {
      toast({ title: "Failed to save notes", description: String(error?.message || error), variant: "destructive" })
    }
  }

  const handleAssign = async (id: number, userId: string) => {
    try {
      await onAssign(id, userId)
      const assignedValue = userId === "unassigned" ? null : userId
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, assigned_to: assignedValue })
      const label = assignedValue ? users.find(u => u.id === assignedValue)?.fullname ?? assignedValue : "Unassigned"
      toast({ title: "Estimator updated", description: `Assigned: ${label}` })
    } catch (error: any) {
      toast({ title: "Failed to assign estimator", description: String(error?.message || error), variant: "destructive" })
    }
  }

  const resolvePhotoUrl = (p: string) => {
    if (!p) return p
    if (/^https?:\/\//i.test(p)) return p
    return supabase.storage.from('quote-photos').getPublicUrl(p).data.publicUrl
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Estimate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {lead.fullname.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{lead.fullname}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatAppointment(lead.appointment_date, lead.appointment_time)}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      <span className={`inline-block px-2 py-0.5 rounded shadow-sm ${get(lead.service_type).chip}`}>
                        {lead.service_type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{lead.square_footage} sq ft</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="flex items-center space-x-1 mb-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{lead.photo_urls?.length ?? 0} photos</span>
                    </div>
                    <div className="text-gray-500 max-w-48 truncate">{lead.address}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">
                    ${Number(lead.estimate).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status ?? "New")}>
                    {lead.status ?? "New"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatCreatedDate(lead.created_at)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedLead && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Lead Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p><strong>Name:</strong> {selectedLead.fullname}</p>
                <p><strong>Email:</strong> {selectedLead.email}</p>
                <p><strong>Phone:</strong> {selectedLead.phone}</p>
                <p className="sm:col-span-2"><strong>Address:</strong> {selectedLead.address}</p>
                <p><strong>Service Type:</strong> {selectedLead.service_type}</p>
                <p><strong>Square Footage:</strong> {selectedLead.square_footage}</p>
                <p><strong>Estimate:</strong> ${Number(selectedLead.estimate).toLocaleString()}</p>
                <p><strong>Created:</strong> {new Date(selectedLead.created_at).toLocaleDateString("en-US")}</p>
                <p className="sm:col-span-2"><strong>Appointment:</strong> {formatAppointment(selectedLead.appointment_date, selectedLead.appointment_time, true)}</p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Status:</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800"
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Scheduled</option>
                  <option>Quote Sent</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Assign Estimator:</label>
                <select
                  value={selectedLead.assigned_to ?? "unassigned"}
                  onChange={(e) => handleAssign(selectedLead.id, e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800"
                >
                  <option value="unassigned">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.fullname}</option>
                  ))}
                </select>
              </div>

              {selectedLead.photo_urls?.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-1">Uploaded Photos:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedLead.photo_urls.map((url, idx) => (
                      <img
                        key={idx}
                        src={resolvePhotoUrl(url)}
                        alt={`Photo ${idx + 1}`}
                        className="rounded-lg object-cover w-full h-28"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedLead.additional_info && (
                <div className="mt-4">
                  <p className="font-semibold mb-1">Additional Info:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedLead.additional_info}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Internal Notes:</label>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 h-24 bg-white dark:bg-gray-800"
                  value={selectedLead.notes || ""}
                  placeholder="Add any internal comments here..."
                  onChange={(e) => handleNotesUpdate(selectedLead.id, e.target.value)}
                />
              </div>

              <Button
                className="mt-6 w-full"
                onClick={async () => {
                  if (selectedLead) {
                    const { id, status, notes } = selectedLead

                    await handleStatusChange(id, status)
                    await handleNotesUpdate(id, notes || "")
                  }

                  setSelectedLead(null)
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
