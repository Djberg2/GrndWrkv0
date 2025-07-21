import { supabase } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  const { id, notes } = await req.json()

  const { error } = await supabase
    .from("quotes")
    .update({ notes })
    .eq("id", id)

  if (error) {
    console.error("Notes update failed:", error)
    return new Response("Error updating notes", { status: 500 })
  }

  return new Response("Notes updated", { status: 200 })
}
