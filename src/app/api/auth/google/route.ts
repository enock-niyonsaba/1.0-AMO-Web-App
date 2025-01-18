import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { OAuth2Client } from 'google-auth-library'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    if (!payload) throw new Error('Invalid token')

    const { email, name, picture } = payload

    // Check if user exists
    let { data: user } = await supabase
      .from('amo_user_login')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('amo_user_login')
        .insert({
          email,
          username: name,
          user_role: 'USER',
          is_verified: true,
          password: '' // Google users don't need a password
        })
        .select()
        .single()

      if (error) throw error
      user = newUser
    }

    return NextResponse.json({ 
      user,
      message: 'Google authentication successful' 
    })
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}