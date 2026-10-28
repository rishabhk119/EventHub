import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000').replace(/\/$/, '')

// onNotification is called for every incoming event notification (e.g. to reload the list)
export function useNotifications(onNotification) {
  const [notifications, setNotifications] = useState([])
  const [connected, setConnected] = useState(false)
  const callbackRef = useRef(onNotification)

  useEffect(() => {
    callbackRef.current = onNotification
  }, [onNotification])

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] })

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const handleNotification = (notification) => {
      // id is the event id, so one event can produce several notifications (created/updated/deleted)
      const item = { ...notification, key: `${notification.id}-${notification.type || 'created'}-${notification.createdAt}` }
      setNotifications(current =>
        [item, ...current.filter(existing => existing.key !== item.key)].slice(0, 5)
      )
      callbackRef.current?.(notification)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onDisconnect)
    socket.on('eventNotification', handleNotification)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onDisconnect)
      socket.off('eventNotification', handleNotification)
      socket.disconnect()
    }
  }, [])

  return { notifications, connected }
}
