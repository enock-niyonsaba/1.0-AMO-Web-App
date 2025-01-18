import express from 'express'
import { supabase } from '../index.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validateAdmin } from '../middleware/auth.js'

export const router = express.Router()

// Get all users (admin only)
router.get('/', validateAdmin, asyncHandler(async (req, res) => {
  const { data: users, error } = await supabase
    .from('amo_user_login')
    .select(`
      *,
      amo_user_info (*)
    `)

  if (error) throw error
  res.json(users)
}))

// Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from('amo_user_login')
    .select(`
      *,
      amo_user_info (*)
    `)
    .eq('user_id', req.params.id)
    .single()

  if (error) throw error
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
}))

// Update user
router.patch('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const updates = req.body

  // Start a transaction
  const { data: user, error } = await supabase.rpc('update_user', {
    p_user_id: id,
    p_updates: updates
  })

  if (error) throw error
  res.json(user)
}))

// Delete user (admin only)
router.delete('/:id', validateAdmin, asyncHandler(async (req, res) => {
  const { error } = await supabase
    .from('amo_user_login')
    .update({ is_deleted: true })
    .eq('user_id', req.params.id)

  if (error) throw error
  res.status(204).send()
}))