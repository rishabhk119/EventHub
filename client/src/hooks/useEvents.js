import { useCallback, useEffect, useState } from 'react'
import { API_BASE_URL } from '../lib/api'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // silent: refetch in the background (e.g. after a live notification) without the loading skeleton
  const reloadEvents = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true)
      setError(null)
    }
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
      setError(null)
    } catch {
      if (!silent) {
        setError('Unable to load events from the database.')
        setEvents([])
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    reloadEvents()
  }, [reloadEvents])

  return { events, loading, error, reloadEvents }
}
