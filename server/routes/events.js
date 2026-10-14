import { Router } from 'express'
import Event from '../models/Event.js'
import { validateEvent } from '../middleware/validateEvent.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

// GET all events
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: events
    })
  } catch (error) {
    next(error)
  }
})

// GET event by ID
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      const error = new Error('Event not found')
      error.status = 404
      throw error
    }

    res.status(200).json({
      success: true,
      data: event
    })
  } catch (error) {
    next(error)
  }
})

// CREATE event
router.post('/', protect, authorize('admin'), validateEvent, async (req, res, next) => {
  try {
    const event = await Event.create(req.body)

    req.app.get('io').emit('eventNotification', {
      id: String(event._id),
      message: `New event added: ${event.title}`,
      createdAt: new Date().toISOString()
    })

    res.status(201).json({
      success: true,
      data: event
    })
  } catch (error) {
    next(error)
  }
})

// UPDATE event
router.put('/:id', protect, authorize('admin'), validateEvent, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!event) {
      const error = new Error('Event not found')
      error.status = 404
      throw error
    }

    res.status(200).json({
      success: true,
      data: event
    })
  } catch (error) {
    next(error)
  }
})

// DELETE event
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)

    if (!event) {
      const error = new Error('Event not found')
      error.status = 404
      throw error
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

export default router
