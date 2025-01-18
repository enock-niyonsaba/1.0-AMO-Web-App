import { supabase } from './supabase'

// User Management
export async function getUsers() {
  const { data, error } = await supabase
    .from('amo_user_login')
    .select('*')
  if (error) throw error
  return data
}

export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('amo_user_login')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

// Company Management
export async function getCompanies() {
  const { data, error } = await supabase
    .from('desktop_user')
    .select(`
      *,
      company_info (*)
    `)
    .eq('is_deleted', false)
  if (error) throw error
  return data
}

export async function getCompany(companyId: string) {
  const { data, error } = await supabase
    .from('desktop_user')
    .select(`
      *,
      company_info (*)
    `)
    .eq('desktop_user_id', companyId)
    .single()
  if (error) throw error
  return data
}

// License Management
export async function getLicenses() {
  const { data, error } = await supabase
    .from('licenses')
    .select(`
      *,
      desktop_user (
        company_name,
        status
      )
    `)
  if (error) throw error
  return data
}

export async function createLicense(licenseData: any) {
  const { data, error } = await supabase
    .from('licenses')
    .insert([licenseData])
    .select()
  if (error) throw error
  return data
}

// Activity Logs
export async function getActivities(userType: string, userId: string) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_type', userType)
    .eq('affected_user', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createActivity(activityData: any) {
  const { data, error } = await supabase
    .from('activities')
    .insert([activityData])
    .select()
  if (error) throw error
  return data
}

// Contact Messages
export async function getMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createMessage(messageData: any) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([messageData])
    .select()
  if (error) throw error
  return data
}