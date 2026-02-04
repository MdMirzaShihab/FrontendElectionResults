import { cn } from '@utils/cn'

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercent = false,
  color,
  size = 'md',
  className,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-olive-700 dark:text-sage-300">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-sm font-medium text-olive-500 dark:text-sage-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full bg-sage-200 dark:bg-sage-800 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            !color && 'bg-green-500 dark:bg-green-400'
          )}
          style={{
            width: `${percentage}%`,
            ...(color ? { backgroundColor: color } : {}),
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
export default ProgressBar
