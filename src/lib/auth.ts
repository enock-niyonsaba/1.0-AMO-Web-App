import { supabase } from './supabase'
import bcrypt from 'bcryptjs'
import { toast } from 'react-hot-toast'

export async function signUp(email: string, password: string, userData: any) {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in Supabase
    const { data: user, error } = await supabase
      .from('amo_user_login')
      .insert([{
        email,
        password: hashedPassword,
        username: userData.username,
        user_role: userData.role,
        is_verified: false,
        verification_code: Math.random().toString(36).slice(-6).toUpperCase()
      }])
      .select()
      .single()

    if (error) throw error

    // Create user info
    if (user) {
      await supabase
        .from('amo_user_info')
        .insert([{
          user_id: user.user_id,
          phone_number: userData.phone
        }])
    }

    toast.success('Account created successfully! Please check your email for verification.')
    return user
  } catch (error: any) {
    toast.error(error.message)
    return null
  }
}

export async function verifyEmail(email: string, code: string) {
  try {
    const { data: user, error } = await supabase
      .from('amo_user_login')
      .update({ is_verified: true, verification_code: null })
      .eq('email', email)
      .eq('verification_code', code)
      .select()
      .single()

    if (error) throw error
    if (!user) throw new Error('Invalid verification code')

    toast.success('Email verified successfully!')
    return true
  } catch (error: any) {
    toast.error(error.message)
    return false
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    toast.success('Password reset instructions sent to your email')
  } catch (error: any) {
    toast.error(error.message)
  }
}