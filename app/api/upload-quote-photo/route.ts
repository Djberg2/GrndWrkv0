import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Initialize Supabase server client with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This stays server-side only
)

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const cleanName = file.name.replace(/[^\w.-]/g, "_") // Replace invalid chars
const fileName = `${uuidv4()}-${cleanName}`

  const blob = new Blob([buffer], { type: file.type })  

console.log("Uploading:", fileName, file);

  const { data, error } = await supabase.storage
    .from('quote-photos')
    .upload(fileName, blob, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  // Return just the file path (we'll store this in the DB)
  return NextResponse.json({ path: fileName })
}
