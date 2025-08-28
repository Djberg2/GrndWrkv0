"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"
import { Users, Calendar, DollarSign, Target } from "lucide-react"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts"
import { useServiceColors, labelService, slugService } from "@/hooks/use-service-colors"

type Quote = {
  id: number
  created_at: string
  status?: string
  service_type?: string
  estimate?: number | string
  appointment_date?: string | null
}

export default function AnalyticsPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const { serviceColors } = useServiceColors()

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("id, created_at, status, service_type, estimate, appointment_date")
        .order("created_at", { ascending: true })

      if (!error && data) setQuotes(data as Quote[])
    }
    load()
  }, [])

  const kpis = useMemo(() => {
    const total = quotes.length
    const scheduled = quotes.filter((q) => (q.status || "").toLowerCase() === "scheduled").length
    const quoteSent = quotes.filter((q) => (q.status || "").toLowerCase() === "quote sent").length
    const converted = quoteSent
    const convRate = total ? Math.round((converted / total) * 100) : 0
    const avgEstimate = (() => {
      const nums = quotes
        .map((q) => Number(q.estimate))
        .filter((n) => Number.isFinite(n) && n > 0) as number[]
      if (!nums.length) return 0
      return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
    })()
    const pipeline = quotes
      .filter((q) => (q.status || "").toLowerCase() === "quote sent")
      .map((q) => Number(q.estimate))
      .filter((n) => Number.isFinite(n) && n > 0)
      .reduce((a, b) => a + b, 0)

    return { total, scheduled, quoteSent, convRate, avgEstimate, pipeline }
  }, [quotes])

  const leadsByMonth = useMemo(() => {
    const map = new Map<string, number>()
    quotes.forEach((q) => {
      const d = new Date(q.created_at)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`
      map.set(key, (map.get(key) || 0) + 1)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, value]) => ({ month: key, leads: value }))
  }, [quotes])

  const serviceMix = useMemo(() => {
    const map = new Map<string, number>()
    quotes.forEach((q) => {
      const key = slugService(q.service_type)
      if (!key) return
      map.set(key, (map.get(key) || 0) + 1)
    })
    const entries = Array.from(map.entries()).map(([key, count]) => ({
      name: labelService(key),
      key,
      value: count,
    }))
    return entries
  }, [quotes])

  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>()
    quotes.forEach((q) => {
      const value = Number(q.estimate)
      if (!Number.isFinite(value) || value <= 0) return
      const d = new Date(q.created_at)
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`
      map.set(key, (map.get(key) || 0) + value)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, value]) => ({ month: key, revenue: Math.round(value) }))
  }, [quotes])

  const chartConfig = {
    leads: { label: "Leads", color: "hsl(var(--chart-1))" },
    revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Insights that drive growth and customer happiness</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Total Leads</CardTitle>
              <Users className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.total}</div>
              <div className="text-xs text-gray-500">All-time</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Scheduled Quotes</CardTitle>
              <Calendar className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.scheduled}</div>
              <div className="text-xs text-gray-500">Currently scheduled</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Conv. Rate</CardTitle>
              <Target className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.convRate}%</div>
              <div className="text-xs text-gray-500">Leads → Quote Sent</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Avg. Estimate</CardTitle>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${kpis.avgEstimate.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Across all services</div>
            </CardContent>
          </Card>
        </div>

        {/* Leads over time & Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Leads Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <BarChart data={leadsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="var(--color-leads)" radius={[4,4,0,0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Service Mix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Mix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <PieChart width={320} height={220}>
                  <Tooltip />
                  <Pie
                    data={serviceMix}
                    dataKey="value"
                    nameKey="name"
                    cx={120}
                    cy={100}
                    outerRadius={70}
                    label
                  >
                    {serviceMix.map((entry, index) => (
                      <CellWithColor key={`cell-${index}`} serviceKey={entry.key} colorMap={serviceColors} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="space-y-1">
                  {serviceMix.map((s) => (
                    <div key={s.key} className="flex items-center gap-2 text-sm">
                      <span className={`inline-block w-3 h-3 rounded ${serviceColors[s.key]?.chip || "bg-gray-300"}`}></span>
                      <span>{s.name}</span>
                      <span className="text-gray-500">({s.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Quote Sent</div>
                <div className="text-xl font-semibold">{kpis.quoteSent}</div>
              </div>
              <div>
                <div className="text-gray-500">Pipeline $</div>
                <div className="text-xl font-semibold">${kpis.pipeline.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function CellWithColor({ serviceKey, colorMap }: { serviceKey: string; colorMap: Record<string, { chip: string }> }) {
  const cls = colorMap[serviceKey]?.chip || "bg-gray-300"
  const bg = cls.split(" ").find((c) => c.startsWith("bg-")) || "bg-gray-300"
  const color = bg.replace("bg-", "")
  const stroke = `var(--${color})`
  // Fallback to theme variable-based color not necessary; Recharts accepts hex, but we'll use CSS color by applying style via class for legend and fill via computed color
  return <RechartsCell fill={bgToHex(bg)} />
}

import { Cell as RechartsCell } from "recharts"

// rudimentary mapping from tailwind bg-* to hex; fallback to gray
const TAILWIND_HEX: Record<string, string> = {
  "bg-emerald-100": "#d1fae5",
  "bg-sky-100": "#e0f2fe",
  "bg-rose-100": "#ffe4e6",
  "bg-amber-100": "#fef3c7",
  "bg-lime-100": "#ecfccb",
  "bg-cyan-100": "#cffafe",
  "bg-violet-100": "#ede9fe",
  "bg-gray-300": "#d1d5db",
}

function bgToHex(cls: string) {
  return TAILWIND_HEX[cls] || "#d1d5db"
}

