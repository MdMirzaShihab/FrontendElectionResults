import { cn } from '@utils/cn'

const sizeStyles = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

function Spinner({ size = 'md', className }) {
  return (
    <svg
      className={cn('animate-spin text-green-500 dark:text-green-400', sizeStyles[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

Spinner.displayName = 'Spinner'

function LoadingOverlay({ message = 'Loading...', size = 'lg', className }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-4',
        'bg-white/80 dark:bg-olive-950/80 backdrop-blur-sm',
        className
      )}
    >
      <Spinner size={size} />
      <p className="text-sm font-medium text-olive-600 dark:text-sage-300">
        {message}
      </p>
    </div>
  )
}

LoadingOverlay.displayName = 'LoadingOverlay'

export { Spinner, LoadingOverlay }
