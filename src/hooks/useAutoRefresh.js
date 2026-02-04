import { useEffect, useRef, useCallback } from 'react'

export function useAutoRefresh(fetchFn, { interval = 30000, enabled = true, onError } = {}) {
  const intervalRef = useRef(null)
  const pendingRef = useRef(false)
  const errorCountRef = useRef(0)
  const mountedRef = useRef(true)

  const refresh = useCallback(async () => {
    if (pendingRef.current || !mountedRef.current) return
    pendingRef.current = true
    try {
      await fetchFn()
      errorCountRef.current = 0
    } catch (err) {
      errorCountRef.current++
      if (errorCountRef.current >= 3 && onError) {
        onError(err)
      }
    } finally {
      pendingRef.current = false
    }
  }, [fetchFn, onError])

  useEffect(() => {
    mountedRef.current = true
    refresh()
    return () => { mountedRef.current = false }
  }, [refresh])

  useEffect(() => {
    if (!enabled) {
      clearInterval(intervalRef.current)
      return
    }

    const getDelay = () => {
      if (errorCountRef.current === 0) return interval
      return Math.min(interval * Math.pow(2, errorCountRef.current), 120000)
    }

    const tick = () => {
      refresh()
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(tick, getDelay())
    }

    intervalRef.current = setInterval(tick, getDelay())

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [enabled, interval, refresh])

  return { refresh, errorCount: errorCountRef.current }
}
