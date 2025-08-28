"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { LeadsTable, type Lead as TableLead } from "@/components/leads-table"
import { LeadsFilters } from "@/components/leads-filters"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LeadsInbox, type Lead as InboxLead } from "@/components/leads-inbox"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "@/hooks/use-toast"
import { useMemo } from "react"

type Lead = TableLead & InboxLead
type User = { id: string; fullname: string }

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [users, setUsers] = useState<User[]>([])
  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all"|"new"|"scheduled"|"contacted"|"quote-sent">("all")
  const [serviceFilter, setServiceFilter] = useState<"all"|"lawn-mowing"|"landscaping"|"tree-removal"|"hardscaping">("all")
  const [createdRange, setCreatedRange] = useState<"all"|"today"|"week"|"month">("all")
  const [scheduledRange, setScheduledRange] = useState<"all"|"today"|"week"|"month">("all")
  const FAKE_USERS: User[] = [
    { id: "est-1", fullname: "Alex Estimator" },
    { id: "est-2", fullname: "Jamie Johnson" },
    { id: "est-3", fullname: "Taylor Rivera" },
  ]

  const readLocalAssignments = (): Record<number, string> => {
    if (typeof window === "undefined") return {}
    try {
      const raw = localStorage.getItem("inboxAssignments")
      return raw ? (JSON.parse(raw) as Record<number, string>) : {}
    } catch {
      return {}
    }
  }

  const writeLocalAssignment = (leadId: number, userId: string) => {
    if (typeof window === "undefined") return
    const map = readLocalAssignments()
    map[leadId] = userId
    localStorage.setItem("inboxAssignments", JSON.stringify(map))
  }

  const clearLocalAssignment = (leadId: number) => {
    if (typeof window === "undefined") return
    const map = readLocalAssignments()
    if (leadId in map) {
      delete map[leadId]
      localStorage.setItem("inboxAssignments", JSON.stringify(map))
    }
  }

  const readLocalStatuses = (): Record<number, string> => {
    if (typeof window === "undefined") return {}
    try {
      const raw = localStorage.getItem("leadStatusOverrides")
      return raw ? (JSON.parse(raw) as Record<number, string>) : {}
    } catch {
      return {}
    }
  }

  const writeLocalStatus = (leadId: number, status: string) => {
    if (typeof window === "undefined") return
    const map = readLocalStatuses()
    map[leadId] = status
    localStorage.setItem("leadStatusOverrides", JSON.stringify(map))
  }

  const clearLocalStatus = (leadId: number) => {
    if (typeof window === "undefined") return
    const map = readLocalStatuses()
    if (leadId in map) {
      delete map[leadId]
      localStorage.setItem("leadStatusOverrides", JSON.stringify(map))
    }
  }

  const readLocalNotes = (): Record<number, string> => {
    if (typeof window === "undefined") return {}
    try {
      const raw = localStorage.getItem("leadNotesOverrides")
      return raw ? (JSON.parse(raw) as Record<number, string>) : {}
    } catch {
      return {}
    }
  }

  const writeLocalNotes = (leadId: number, notes: string) => {
    if (typeof window === "undefined") return
    const map = readLocalNotes()
    map[leadId] = notes
    localStorage.setItem("leadNotesOverrides", JSON.stringify(map))
  }

  const clearLocalNotes = (leadId: number) => {
    if (typeof window === "undefined") return
    const map = readLocalNotes()
    if (leadId in map) {
      delete map[leadId]
      localStorage.setItem("leadNotesOverrides", JSON.stringify(map))
    }
  }

  useEffect(() => {
    const load = async () => {
      const [leadsRes, usersRes] = await Promise.all([
        supabase.from("quotes").select("*").order("created_at", { ascending: false }),
        supabase.from("users").select("id, fullname"),
      ])

      if (leadsRes.error) {
        console.error(leadsRes.error)
        toast({ title: "Failed to load leads", description: leadsRes.error.message, variant: "destructive" })
      }
      const localAssign = readLocalAssignments()
      const localStatuses = readLocalStatuses()
      const localNotes = readLocalNotes()
      const loadedLeads = (leadsRes.data || []).map((l: any) => ({
        ...l,
        assigned_to: localAssign[l.id] ?? l.assigned_to ?? null,
        status: localStatuses[l.id] ?? l.status,
        notes: localNotes[l.id] ?? l.notes,
      })) as Lead[]
      setLeads(loadedLeads)

      if (usersRes.error || !usersRes.data || usersRes.data.length === 0) {
        console.warn("Using temporary estimator list.")
        setUsers(FAKE_USERS)
      } else {
        setUsers(usersRes.data as User[])
      }
    }
    load()
  }, [])

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase()
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 7)
    const startOfMonth = new Date(now)
    startOfMonth.setDate(now.getDate() - 30)

    const inCreatedRange = (createdAt: string) => {
      const d = new Date(createdAt)
      switch (createdRange) {
        case "today": return d >= startOfToday
        case "week": return d >= startOfWeek
        case "month": return d >= startOfMonth
        default: return true
      }
    }

    const inScheduledRange = (appointmentDate?: string) => {
      if (scheduledRange === "all") return true
      if (!appointmentDate) return false
      const d = new Date(appointmentDate + 'T00:00:00')
      switch (scheduledRange) {
        case "today": return d >= startOfToday
        case "week": return d >= startOfWeek
        case "month": return d >= startOfMonth
        default: return true
      }
    }

    const statusMatches = (s?: string) => {
      if (statusFilter === "all") return true
      if (!s) return false
      const canon = s.toLowerCase()
      if (statusFilter === "new") return canon === "new"
      if (statusFilter === "scheduled") return canon === "scheduled"
      if (statusFilter === "contacted") return canon === "contacted"
      if (statusFilter === "quote-sent") return canon === "quote sent"
      return true
    }

    const serviceMatches = (sv?: string) => {
      if (serviceFilter === "all") return true
      if (!sv) return false
      return sv.toLowerCase() === serviceFilter
    }

    const searchMatches = (l: Lead) => {
      if (!q) return true
      const hay = [l.fullname, l.email, l.phone, l.address, l.service_type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return hay.includes(q)
    }

    return leads.filter((l) =>
      inCreatedRange(l.created_at) &&
      inScheduledRange(l.appointment_date) &&
      statusMatches(l.status) &&
      serviceMatches(l.service_type) &&
      searchMatches(l)
    )
  }, [leads, search, statusFilter, serviceFilter, createdRange, scheduledRange])

  const handleChangeStatus = async (id: number, status: string) => {
    const { error } = await supabase.from("quotes").update({ status }).eq("id", id)
    if (error) {
      // fallback locally if DB not available
      writeLocalStatus(id, status)
    } else {
      clearLocalStatus(id)
    }
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)))
  }

  const handleChangeNotes = async (id: number, notes: string) => {
    const { error } = await supabase.from("quotes").update({ notes }).eq("id", id)
    if (error) {
      writeLocalNotes(id, notes)
    } else {
      clearLocalNotes(id)
    }
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, notes } : l)))
  }

  const handleAssign = async (id: number, userId: string) => {
    const assignedValue = userId === "unassigned" ? null : userId
    const { error } = await supabase.from("quotes").update({ assigned_to: assignedValue }).eq("id", id)
    if (error) {
      // fallback local
      if (assignedValue) writeLocalAssignment(id, assignedValue)
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, assigned_to: assignedValue || undefined } : l)))
      // don't throw to avoid toasts marking as failure only; UI already updated
      return
    }
    clearLocalAssignment(id)
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, assigned_to: assignedValue || undefined } : l)))
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads & Quotes</h1>
            <p className="text-gray-600">Manage your customer inquiries and scheduled quotes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

          <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="inbox">Inbox View</TabsTrigger>
          </TabsList>
          <TabsContent value="table" className="mt-4">
            <LeadsFilters
              search={search}
              status={statusFilter}
              service={serviceFilter}
              createdRange={createdRange}
              scheduledRange={scheduledRange}
              onSearch={setSearch}
              onStatus={setStatusFilter}
              onService={setServiceFilter}
              onCreatedRange={setCreatedRange}
              onScheduledRange={setScheduledRange}
              onClear={() => {
                setSearch("")
                setStatusFilter("all")
                setServiceFilter("all")
                setCreatedRange("all")
                setScheduledRange("all")
              }}
            />
            <LeadsTable
              leads={filteredLeads}
              users={users}
              onChangeStatus={handleChangeStatus}
              onChangeNotes={handleChangeNotes}
              onAssign={handleAssign}
            />
          </TabsContent>
          <TabsContent value="inbox" className="mt-4">
            <LeadsInbox
              leads={filteredLeads}
              users={users}
              onAssign={handleAssign}
              onChangeStatus={handleChangeStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
