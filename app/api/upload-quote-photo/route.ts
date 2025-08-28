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

if (process.env.NODE_ENV !== 'production') {
  // Avoid logging large file buffers in production
  console.log("Uploading:", fileName)
}

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

  // Build public URL
  const { data: pub } = supabase.storage.from('quote-photos').getPublicUrl(fileName)

  // Return file path and public URL
  return NextResponse.json({ path: fileName, publicUrl: pub.publicUrl })
}
