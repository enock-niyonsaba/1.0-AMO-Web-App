import { supabase } from '../index.js'

export async function validateAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export async function validateAdmin(req, res, next) {
  try {
    const { data: userRole } = await supabase
      .from('amo_user_login')
      .select('user_role')
      .eq('user_id', req.user.id)
      .single()

    if (userRole?.user_role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    res.status(403).json({ error: 'Admin validation failed' })
  }
}