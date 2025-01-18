import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendContactEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Save message to database
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message
      })

    if (error) throw error

    // Send notification email
    await sendContactEmail(name, email, subject, message)

    return NextResponse.json({ 
      message: 'Message sent successfully' 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}