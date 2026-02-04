import { forwardRef } from 'react'
import { cn } from '@utils/cn'

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-3.5 py-2 text-sm rounded-xl',
  lg: 'px-4 py-2.5 text-base rounded-xl',
}

const iconPadding = {
  sm: { left: 'pl-8', right: 'pr-8' },
  md: { left: 'pl-10', right: 'pr-10' },
  lg: { left: 'pl-11', right: 'pr-11' },
}

const iconSize = {
  sm: 14,
  md: 16,
  lg: 18,
}

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    size = 'md',
    fullWidth = true,
    className,
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-olive-700 dark:text-sage-300 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-olive-400 dark:text-sage-500">
            <LeftIcon size={iconSize[size]} />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-sage-50 border border-sage-200 text-olive-800 placeholder:text-olive-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'dark:bg-sage-900 dark:border-sage-700 dark:text-sage-100 dark:placeholder:text-sage-500',
            'dark:focus:border-green-400 dark:focus:ring-green-400/50',
            sizeStyles[size],
            LeftIcon && iconPadding[size].left,
            RightIcon && iconPadding[size].right,
            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500 dark:border-red-400',
            className
          )}
          {...props}
        />

        {RightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-olive-400 dark:text-sage-500">
            <RightIcon size={iconSize[size]} />
          </div>
        )}
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

Input.displayName = 'Input'

export { Input }
export default Input
