export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  })
}

export function errorHandler(error, req, res, next) {
  console.error(error.message)

  const statusCode = error.status || 500

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error'
  })
}
