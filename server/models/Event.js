import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    venue: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    // 0 means unlimited seats
    capacity: {
      type: Number,
      default: 0
    },
    registeredCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Event', eventSchema)
