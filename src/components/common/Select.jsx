import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@utils/cn'

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-lg pr-8',
  md: 'px-3.5 py-2 text-sm rounded-xl pr-10',
  lg: 'px-4 py-2.5 text-base rounded-xl pr-11',
}

const iconPositions = {
  sm: 'right-2',
  md: 'right-3',
  lg: 'right-3.5',
}

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
}

const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    options = [],
    placeholder,
    size = 'md',
    fullWidth = true,
    className,
    id,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-olive-700 dark:text-sage-300 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full appearance-none bg-sage-50 border border-sage-200 text-olive-800',
            'transition-all duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'dark:bg-sage-900 dark:border-sage-700 dark:text-sage-100',
            'dark:focus:border-green-400 dark:focus:ring-green-400/50',
            sizeStyles[size],
            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500 dark:border-red-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div
          className={cn(
            'absolute inset-y-0 flex items-center pointer-events-none text-olive-400 dark:text-sage-500',
            iconPositions[size]
          )}
        >
          <ChevronDown size={iconSizes[size]} />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-olive-400 dark:text-sage-500">{helperText}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export { Select }
export default Select
