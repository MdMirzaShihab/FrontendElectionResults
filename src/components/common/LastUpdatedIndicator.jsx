import { useState, useEffect } from 'react'
import { cn } from '@utils/cn'

function formatRelativeTime(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 5) return 'Just updated'
  if (seconds < 60) return `Updated ${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Updated ${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Updated ${hours}h ago`

  const days = Math.floor(hours / 24)
  return `Updated ${days}d ago`
}

function LastUpdatedIndicator({ lastUpdated }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!lastUpdated) return

    const interval = setInterval(() => {
      setTick((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  if (!lastUpdated) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-olive-500 dark:text-sage-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-olive-300 opacity-50 dark:bg-sage-600" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-olive-400 dark:bg-sage-500" />
        </span>
        <span>Waiting for data...</span>
      </div>
    )
  }

  const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
  const isRecent = seconds < 5

  return (
    <div className="inline-flex items-center gap-2 text-sm text-olive-500 dark:text-sage-400">
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
            isRecent
              ? 'bg-green-400 dark:bg-green-300'
              : 'bg-green-500 dark:bg-green-400'
          )}
        />
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            isRecent
              ? 'bg-green-400 dark:bg-green-300'
              : 'bg-green-500 dark:bg-green-400'
          )}
        />
      </span>
      <span>{formatRelativeTime(lastUpdated)}</span>
    </div>
  )
}

LastUpdatedIndicator.displayName = 'LastUpdatedIndicator'

export { LastUpdatedIndicator }
export default LastUpdatedIndicator
