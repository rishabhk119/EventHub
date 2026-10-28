import { Router } from 'express'
import mongoose from 'mongoose'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import { validateEvent } from '../middleware/validateEvent.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

const editableFields = ['title', 'date', 'venue', 'category', 'description', 'capacity']

// Only copy fields an admin is allowed to set (registeredCount is server-managed)
function pickEventFields(body) {
  const fields = {}
  for (const key of editableFields) {
    if (body[key] !== undefined) {
      fields[key] = body[key]
    }
  }
  return fields
}

function notify(req, type, event, message) {
  req.app.get('io').emit('eventNotification', {
    id: String(event._id),
    type,
    message,
    createdAt: new Date().toISOString()
  })
}

function notFoundError() {
  const error = new Error('Event not found')
  error.status = 404
  return error
}

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

// GET ids of events the logged-in user has registered for
router.get('/registrations/me', protect, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id }).select('event')

    res.status(200).json({
      success: true,
      data: registrations.map(registration => String(registration.event))
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
      throw notFoundError()
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
    const event = await Event.create(pickEventFields(req.body))

    notify(req, 'created', event, `New event added: ${event.title}`)

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
      pickEventFields(req.body),
      {
        new: true,
        runValidators: true
      }
    )

    if (!event) {
      throw notFoundError()
    }

    notify(req, 'updated', event, `Event updated: ${event.title}`)

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
      throw notFoundError()
    }

    await Registration.deleteMany({ event: event._id })

    notify(req, 'deleted', event, `Event cancelled: ${event.title}`)

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// REGISTER the logged-in user for an event
router.post('/:id/register', protect, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || !(await Event.exists({ _id: req.params.id }))) {
      throw notFoundError()
    }

    try {
      await Registration.create({ user: req.user.id, event: req.params.id })
    } catch (error) {
      if (error.code === 11000) {
        error.status = 409
        error.message = 'You are already registered for this event'
      }
      throw error
    }

    // Atomically take a seat; capacity 0 means unlimited
    const event = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        $expr: {
          $or: [
            { $lte: ['$capacity', 0] },
            { $lt: [{ $ifNull: ['$registeredCount', 0] }, '$capacity'] }
          ]
        }
      },
      { $inc: { registeredCount: 1 } },
      { new: true }
    )

    if (!event) {
      await Registration.deleteOne({ user: req.user.id, event: req.params.id })
      const error = new Error('Event is full')
      error.status = 409
      throw error
    }

    res.status(201).json({
      success: true,
      data: event
    })
  } catch (error) {
    next(error)
  }
})

// CANCEL the logged-in user's registration
router.delete('/:id/register', protect, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw notFoundError()
    }

    const { deletedCount } = await Registration.deleteOne({ user: req.user.id, event: req.params.id })

    if (deletedCount === 0) {
      const error = new Error('You are not registered for this event')
      error.status = 404
      throw error
    }

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, registeredCount: { $gt: 0 } },
      { $inc: { registeredCount: -1 } },
      { new: true }
    )

    res.status(200).json({
      success: true,
      data: event
    })
  } catch (error) {
    next(error)
  }
})

export default router
