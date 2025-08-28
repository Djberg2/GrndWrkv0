"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"

type Hours = { day: string; enabled: boolean; start: string; end: string }
type BusinessState = {
  businessName: string
  ownerName: string
  phone: string
  email: string
  address: string
  description: string
  primaryCity: string
  serviceRadius: string
  additionalAreas: string
  hours: Hours[]
}

const DEFAULT_BIZ: BusinessState = {
  businessName: "GreenScapes Landscaping",
  ownerName: "John Doe",
  phone: "(555) 123-4567",
  email: "john@greenscapes.com",
  address: "123 Business Park Drive\nSpringfield, IL 62701",
  description:
    "Professional landscaping services including lawn care, design, and maintenance for residential and commercial properties.",
  primaryCity: "Springfield",
  serviceRadius: "25",
  additionalAreas: "Chatham, Rochester, Sherman, New Berlin",
  hours: [
    { day: "Monday", enabled: true, start: "8", end: "17" },
    { day: "Tuesday", enabled: true, start: "8", end: "17" },
    { day: "Wednesday", enabled: true, start: "8", end: "17" },
    { day: "Thursday", enabled: true, start: "8", end: "17" },
    { day: "Friday", enabled: true, start: "8", end: "17" },
    { day: "Saturday", enabled: true, start: "8", end: "14" },
    { day: "Sunday", enabled: false, start: "8", end: "14" },
  ],
}

export function BusinessSettings() {
  const [state, setState] = useState<BusinessState>(DEFAULT_BIZ)
  const [loading, setLoading] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("settings").select("data, updated_at").eq("key", "business").single()
      if (!error && data?.data) {
        try {
          setState({ ...DEFAULT_BIZ, ...(data.data as BusinessState) })
          if (data.updated_at) setLastSaved(data.updated_at)
        } catch {}
      } else {
        // Attempt one-time migration from localStorage
        try {
          const raw = typeof window !== 'undefined' ? localStorage.getItem("businessSettings") : null
          if (raw) {
            const parsed = JSON.parse(raw) as BusinessState
            const merged = { ...DEFAULT_BIZ, ...parsed }
            setState(merged)
            const up = await supabase
              .from("settings")
              .upsert({ key: "business", data: merged, updated_at: new Date().toISOString() })
            if (!up.error) {
              toast({ title: "Imported local business settings" })
              localStorage.removeItem("businessSettings")
              setLastSaved(new Date().toISOString())
            }
          }
        } catch {}
      }
      setLoading(false)
    }
    load()
  }, [])

  const saveBusiness = async () => {
    setLoading(true)
    const { error } = await supabase.from("settings").upsert({ key: "business", data: state, updated_at: new Date().toISOString() })
    setLoading(false)
    if (error) {
      toast({ title: "Failed to save business settings", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Business settings saved" })
      setLastSaved(new Date().toISOString())
    }
  }

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" value={state.businessName} onChange={(e) => setState((p) => ({ ...p, businessName: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="owner-name">Owner Name</Label>
              <Input id="owner-name" value={state.ownerName} onChange={(e) => setState((p) => ({ ...p, ownerName: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={state.phone} onChange={(e) => setState((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={state.email} onChange={(e) => setState((p) => ({ ...p, email: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <Textarea id="address" value={state.address} onChange={(e) => setState((p) => ({ ...p, address: e.target.value }))} />
          </div>

          <div>
            <Label htmlFor="description">Business Description</Label>
            <Textarea id="description" placeholder="Brief description..." value={state.description} onChange={(e) => setState((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-city">Primary City</Label>
              <Input id="primary-city" value={state.primaryCity} onChange={(e) => setState((p) => ({ ...p, primaryCity: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="service-radius">Service Radius (miles)</Label>
              <Select value={state.serviceRadius} onValueChange={(v) => setState((p) => ({ ...p, serviceRadius: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 miles</SelectItem>
                  <SelectItem value="15">15 miles</SelectItem>
                  <SelectItem value="25">25 miles</SelectItem>
                  <SelectItem value="50">50 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="additional-areas">Additional Service Areas</Label>
            <Textarea id="additional-areas" placeholder="List additional areas..." value={state.additionalAreas} onChange={(e) => setState((p) => ({ ...p, additionalAreas: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.hours.map((h, idx) => (
            <div key={h.day} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Switch checked={h.enabled} onCheckedChange={(v) => setState((p) => ({ ...p, hours: p.hours.map((x,i) => i===idx ? { ...x, enabled: v } : x) }))} />
                <Label className="w-20">{h.day}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={h.start} onValueChange={(v) => setState((p)=> ({ ...p, hours: p.hours.map((x,i)=> i===idx ? { ...x, start: v } : x) }))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 6).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>to</span>
                <Select value={h.end} onValueChange={(v) => setState((p)=> ({ ...p, hours: p.hours.map((x,i)=> i===idx ? { ...x, end: v } : x) }))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 12).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {lastSaved ? `Last saved ${new Date(lastSaved).toLocaleString()}` : "Not saved yet"}
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={saveBusiness} disabled={loading}>
          {loading ? "Saving..." : "Save Business Settings"}
        </Button>
      </div>
    </div>
  )
}
