import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { router as userRouter } from './routes/users.js'
import { router as licenseRouter } from './routes/licenses.js'
import { router as activityRouter } from './routes/activities.js'
import { errorHandler } from './middleware/errorHandler.js'
import { validateAuth } from './middleware/auth.js'

const app = express()
const port = process.env.PORT || 3000

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Middleware
app.use(cors())
app.use(express.json())
app.use(validateAuth)

// Routes
app.use('/api/users', userRouter)
app.use('/api/licenses', licenseRouter)
app.use('/api/activities', activityRouter)

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})