import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Appointment request:", body)
    }

    const {
      name,
      email,
      phone,
      address,
      serviceType,
      squareFootage,
      additionalInfo,
      photos,
      estimate,
      scheduledDateTime,
    } = body

    if (!name || !phone || !address || !serviceType || !estimate || !scheduledDateTime) {
      return NextResponse.json(
        { error: { message: "Missing required fields." } },
        { status: 400 }
      )
    }

    // Split the scheduledDateTime into date and time
    const dateObj = new Date(scheduledDateTime)
    const appointment_date = dateObj.toISOString().split("T")[0]
    const appointment_time = dateObj.toTimeString().split(" ")[0] // "HH:MM:SS"

    const { error } = await supabase.from("quotes").insert([
      {
        fullname: name,
        email,
        phone,
        address,
        service_type: serviceType,
        square_footage: squareFootage,
        additional_info: additionalInfo || "",
        photo_urls: photos || [],
        estimate,
        appointment_date,
        appointment_time,
        status: "New", // optional field
      },
    ])

    if (error) {
      console.error("❌ Supabase insert error:", error)
      return NextResponse.json(
        { error: { message: "Database insert failed." } },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Appointment scheduled and quote saved." }, { status: 200 })
  } catch (error) {
    console.error("❌ Error scheduling appointment:", error)
    return NextResponse.json(
      { error: { message: "Failed to schedule appointment" } },
      { status: 500 }
    )
  }
}
