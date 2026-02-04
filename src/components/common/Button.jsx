import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@utils/cn'

const variantStyles = {
  primary:
    'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-soft hover:from-green-700 hover:to-green-600 dark:from-green-500 dark:to-green-400 dark:text-green-950',
  secondary:
    'bg-sage-200 text-olive-800 hover:bg-sage-300 dark:bg-sage-800 dark:text-sage-100 dark:hover:bg-sage-700',
  outline:
    'border border-sage-300 bg-transparent text-olive-700 hover:bg-sage-100 dark:border-sage-600 dark:text-sage-200 dark:hover:bg-sage-800',
  ghost:
    'bg-transparent text-olive-700 hover:bg-sage-100 dark:text-sage-200 dark:hover:bg-sage-800',
  danger:
    'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-soft hover:from-red-700 hover:to-red-600 dark:from-red-500 dark:to-red-400',
  success:
    'bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:text-green-950 dark:hover:bg-green-300',
  link:
    'bg-transparent text-green-600 underline-offset-4 hover:underline dark:text-green-400 p-0 h-auto',
}

const sizeStyles = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1',
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2',
  xl: 'px-6 py-3 text-lg rounded-2xl gap-2.5',
}

const Button = forwardRef(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    fullWidth = false,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2',
        'active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === 'xs' ? 14 : 16} />
      ) : (
        LeftIcon && <LeftIcon className="shrink-0" size={size === 'xs' ? 14 : 16} />
      )}
      {children}
      {!loading && RightIcon && (
        <RightIcon className="shrink-0" size={size === 'xs' ? 14 : 16} />
      )}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }
export default Button
