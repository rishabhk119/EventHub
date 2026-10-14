import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000').replace(/\/$/, '')

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] })

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onNotification = (notification) => {
      setNotifications(current =>
        [notification, ...current.filter(item => item.id !== notification.id)].slice(0, 5)
      )
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onDisconnect)
    socket.on('eventNotification', onNotification)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onDisconnect)
      socket.off('eventNotification', onNotification)
      socket.disconnect()
    }
  }, [])

  return { notifications, connected }
}
