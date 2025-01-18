export function errorHandler(err, req, res, next) {
  console.error(err.stack)

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  // Handle Supabase errors
  if (err.code) {
    switch (err.code) {
      case '23505': // unique violation
        return res.status(409).json({ error: 'Resource already exists' })
      case '23503': // foreign key violation
        return res.status(400).json({ error: 'Invalid reference' })
      default:
        return res.status(500).json({ error: 'Database error' })
    }
  }

  res.status(500).json({ error: 'Something went wrong!' })
}