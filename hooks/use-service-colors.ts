"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export type ServiceColor = { chip: string }

const PALETTE: ServiceColor[] = [
  { chip: "bg-emerald-100 text-emerald-800" },
  { chip: "bg-sky-100 text-sky-800" },
  { chip: "bg-rose-100 text-rose-800" },
  { chip: "bg-amber-100 text-amber-800" },
  { chip: "bg-lime-100 text-lime-800" },
  { chip: "bg-cyan-100 text-cyan-800" },
  { chip: "bg-violet-100 text-violet-800" },
]

const DEFAULT_COLOR: ServiceColor = { chip: "bg-gray-200 text-gray-800" }

export const slugService = (s?: string) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
export const labelService = (k: string) => k.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

export function useServiceColors() {
  const [colors, setColors] = useState<Record<string, ServiceColor>>({})

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("settings").select("data").eq("key", "pricing").single()
      const map: Record<string, ServiceColor> = {}
      if (data?.data?.services) {
        try {
          const services = data.data.services as Array<{ name: string }>
          services.forEach((s, idx) => {
            if (!s?.name) return
            map[slugService(s.name)] = PALETTE[idx % PALETTE.length]
          })
        } catch {}
      }
      setColors(map)
    }
    load()
  }, [])

  const get = useMemo(() => (serviceType?: string) => {
    const key = slugService(serviceType)
    return colors[key] || DEFAULT_COLOR
  }, [colors])

  return { serviceColors: colors, get, slugService, labelService, DEFAULT_COLOR }
}

