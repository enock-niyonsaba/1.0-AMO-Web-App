import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'
import { sendVerificationEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { username, email, password, role, companyId } = await req.json()

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('amo_user_login')
      .select('user_id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }

    // If user role is USER, verify company ID
    if (role === 'USER') {
      const { data: company } = await supabase
        .from('desktop_user')
        .select('desktop_user_id')
        .eq('desktop_user_id', companyId)
        .single()

      if (!company) {
        return NextResponse.json(
          { error: 'Invalid company ID' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification code
    const verificationCode = Math.random().toString(36).slice(-6).toUpperCase()

    // Create user
    const { data: user, error } = await supabase
      .from('amo_user_login')
      .insert({
        username,
        email,
        password: hashedPassword,
        user_role: role,
        verification_code: verificationCode
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Send verification email
    await sendVerificationEmail(email, verificationCode)

    return NextResponse.json({ 
      message: 'User created successfully. Please check your email for verification.',
      userId: user.user_id
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}