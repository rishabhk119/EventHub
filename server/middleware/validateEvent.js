const datePattern = /^\d{4}-\d{2}-\d{2}$/

export function validateEvent(req, res, next) {
  const { title, date, venue, category, description, capacity } = req.body
  const errors = []

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must contain at least 3 characters.')
  }

  if (!date || typeof date !== 'string' || !datePattern.test(date)) {
    errors.push('Date must use YYYY-MM-DD format.')
  }

  if (!venue || typeof venue !== 'string' || venue.trim().length < 3) {
    errors.push('Venue must contain at least 3 characters.')
  }

  if (category !== undefined && typeof category !== 'string') {
    errors.push('Category must be a string.')
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string.')
  }

  if (
    capacity !== undefined &&
    (!Number.isInteger(capacity) || capacity < 0)
  ) {
    errors.push('Capacity must be a non-negative integer.')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}
