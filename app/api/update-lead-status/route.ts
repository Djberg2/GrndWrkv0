import { supabase } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  const { id, status } = await req.json()

  const { error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", id)

  if (error) {
    console.error("Status update failed:", error)
    return new Response("Error updating status", { status: 500 })
  }

  return new Response("Status updated", { status: 200 })
}
