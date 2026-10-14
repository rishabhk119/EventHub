import jwt from 'jsonwebtoken'

export function protect(req, res, next) {
  const authorization = req.headers.authorization || ''

  if (!authorization.startsWith('Bearer ')) {
    const error = new Error('Authentication token is required')
    error.status = 401
    return next(error)
  }

  const token = authorization.split(' ')[1]

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (error) {
    const authError = new Error('Invalid or expired token')
    authError.status = 401
    next(authError)
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error('Access denied: insufficient role')
      error.status = 403
      return next(error)
    }

    next()
  }
}
