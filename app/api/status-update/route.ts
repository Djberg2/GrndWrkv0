// app/api/update-lead-status/route.ts
import { supabase } from "@/lib/supabaseClient"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { leadId, status } = await req.json()

  if (!leadId || !status) {
    return NextResponse.json({ error: "Missing leadId or status" }, { status: 400 })
  }

  const { error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", leadId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
