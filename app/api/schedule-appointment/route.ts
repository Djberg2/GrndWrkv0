import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("✅ Appointment request:", body)

    // Placeholder success response
    return NextResponse.json({ message: "Appointment scheduled" }, { status: 200 })
  } catch (error) {
    console.error("❌ Error scheduling appointment:", error)
    return NextResponse.json(
      { error: { message: "Failed to schedule appointment" } },
      { status: 500 }
    )
  }
}
