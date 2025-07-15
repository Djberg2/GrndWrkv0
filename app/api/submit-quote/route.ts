import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('✅ Received form submission:', body)

    // Simulate success
    return NextResponse.json({ message: 'Quote received!' }, { status: 200 })
  } catch (error) {
    console.error('❌ Error in /api/submit-quote:', error)
    return NextResponse.json({ error: { message: 'Failed to process request' } }, { status: 500 })
  }
}
