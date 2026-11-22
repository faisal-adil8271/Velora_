import { useState, useEffect } from 'react'

export function useCurrentTime(intervalMs = 5000) {
  const [time, setTime] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setTime(Date.now()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return time
}

export function formatElapsedMinutes(isoString, currentTime) {
  if (!isoString) return 'Just now'
  const diffMs = (currentTime || Date.now()) - new Date(isoString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins <= 0) return 'Just now'
  return `${mins}m ago`
}
