import { useEffect, useState } from 'react'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reloadEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`)
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const payload = await response.json()
      const eventsData = Array.isArray(payload) ? payload : payload?.data
      if (Array.isArray(eventsData)) {
        setEvents(eventsData)
      } else {
        setEvents([])
      }
    } catch {
      setError('Unable to load events from the database.')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadEvents()
  }, [])

  return { events, loading, error, reloadEvents }
}
