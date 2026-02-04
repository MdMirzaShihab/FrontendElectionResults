import { cn } from '@utils/cn'

const variantStyles = {
  default:
    'bg-sage-100 text-olive-700 dark:bg-sage-800 dark:text-sage-200',
  primary:
    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  secondary:
    'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
  success:
    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  warning:
    'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
  error:
    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  info:
    'bg-sage-200 text-sage-700 dark:bg-sage-800 dark:text-sage-300',
  outline:
    'bg-transparent border border-sage-300 text-olive-600 dark:border-sage-600 dark:text-sage-300',
}

const dotColors = {
  default: 'bg-olive-400 dark:bg-sage-400',
  primary: 'bg-green-500 dark:bg-green-400',
  secondary: 'bg-accent-500 dark:bg-accent-400',
  success: 'bg-green-500 dark:bg-green-400',
  warning: 'bg-accent-500 dark:bg-accent-400',
  error: 'bg-red-500 dark:bg-red-400',
  info: 'bg-sage-500 dark:bg-sage-400',
  outline: 'bg-olive-400 dark:bg-sage-400',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
}

const dotSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2 h-2',
}

function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  color,
  ...props
}) {
  const colorOverride = color
    ? { backgroundColor: `${color}20`, color }
    : undefined

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200',
        !color && variantStyles[variant],
        sizeStyles[size],
        className
      )}
      style={colorOverride}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'shrink-0 rounded-full',
            dotSizes[size],
            !color && dotColors[variant]
          )}
          style={color ? { backgroundColor: color } : undefined}
        />
      )}
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'

export { Badge }
export default Badge
