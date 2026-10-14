import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  )
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      const error = new Error('Name, email and password are required')
      error.status = 400
      throw error
    }

    if (password.length < 6) {
      const error = new Error('Password must contain at least 6 characters')
      error.status = 400
      throw error
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    })

    if (existingUser) {
      const error = new Error('Email is already registered')
      error.status = 409
      throw error
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    })

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user)
      }
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      const error = new Error('Email and password are required')
      error.status = 400
      throw error
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    })

    const validPassword = user
      ? await bcrypt.compare(password, user.password)
      : false

    if (!user || !validPassword) {
      const error = new Error('Invalid email or password')
      error.status = 401
      throw error
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user)
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router
