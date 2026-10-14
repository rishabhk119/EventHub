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

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'EventHub API running'
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
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

startServer()
