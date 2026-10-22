import { createServer } from 'node:http'
import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import eventRoutes from './routes/events.js'
import authRoutes from './routes/auth.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const allowedOrigins = (process.env.CLIENT_URLS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins
  }
})
app.set('io', io)

io.on('connection', socket => {
  console.log('Socket connected:', socket.id)
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id))
})

const port = process.env.PORT || 4000

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

let cachedDbPromise = null

function formatMongoUri(uri) {
  if (!uri || typeof uri !== 'string') return uri
  let cleanUri = uri.trim()
  if ((cleanUri.startsWith('"') && cleanUri.endsWith('"')) || (cleanUri.startsWith("'") && cleanUri.endsWith("'"))) {
    cleanUri = cleanUri.slice(1, -1).trim()
  }
  if (cleanUri.startsWith('MONGODB_URI=')) {
    cleanUri = cleanUri.replace(/^MONGODB_URI=\s*/, '').trim()
  }

  const protoMatch = cleanUri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/)
  if (!protoMatch) return cleanUri

  const scheme = protoMatch[1]
  const remainder = protoMatch[2]

  const lastAt = remainder.lastIndexOf('@')
  if (lastAt === -1) return cleanUri

  const authPart = remainder.slice(0, lastAt)
  const hostPart = remainder.slice(lastAt + 1)

  const colonIdx = authPart.indexOf(':')
  if (colonIdx === -1) return cleanUri

  let username = authPart.slice(0, colonIdx)
  let password = authPart.slice(colonIdx + 1)

  if (password.startsWith('<') && password.endsWith('>')) {
    password = password.slice(1, -1)
  }
  if (username.startsWith('<') && username.endsWith('>')) {
    username = username.slice(1, -1)
  }

  const safeEncode = (str) => {
    try {
      return encodeURIComponent(decodeURIComponent(str))
    } catch {
      return encodeURIComponent(str)
    }
  }

  const encodedUser = safeEncode(username)
  const encodedPass = safeEncode(password)

  let finalHostPart = hostPart
  if (!finalHostPart.includes('/')) {
    finalHostPart += '/eventhub?retryWrites=true&w=majority'
  } else if (finalHostPart.endsWith('/')) {
    finalHostPart += 'eventhub?retryWrites=true&w=majority'
  } else if (finalHostPart.endsWith('/?')) {
    finalHostPart = finalHostPart.replace('/?', '/eventhub?')
  }

  return `${scheme}${encodedUser}:${encodedPass}@${finalHostPart}`
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  if (!cachedDbPromise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set')
    }
    const connectionUri = formatMongoUri(process.env.MONGODB_URI)
    cachedDbPromise = mongoose.connect(connectionUri).then((m) => {
      console.log('MongoDB connected')
      return m
    })
  }
  await cachedDbPromise
}

app.use(async (req, res, next) => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB()
    }
    next()
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    next(error)
  }
})

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EventHub API running',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      auth: '/api/auth'
    }
  })
})

app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState >= 1
  res.json({
    success: true,
    message: 'EventHub API running',
    database: isDbConnected ? 'connected' : 'disconnected'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.get('/api/test-error', (req, res, next) => {
  next(new Error('Simulated server error'))
})
app.use(notFound)
app.use(errorHandler)

async function startServer() {
  try {
    await connectDB()
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

if (!process.env.VERCEL) {
  startServer()
}

export default app
