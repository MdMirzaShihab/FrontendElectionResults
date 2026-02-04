import { forwardRef } from 'react'
import { cn } from '@utils/cn'

const cardVariants = {
  default:
    'bg-white border border-sage-200 shadow-card dark:bg-gradient-to-br dark:from-[#1e2822] dark:to-[#161f1a] dark:border-sage-800',
  elevated:
    'bg-white border border-sage-200 shadow-soft-lg dark:bg-gradient-to-br dark:from-[#1e2822] dark:to-[#161f1a] dark:border-sage-800 dark:shadow-dark-soft',
  outlined:
    'bg-transparent border border-sage-300 dark:border-sage-600',
  glass:
    'glass',
  gradient:
    'bg-gradient-to-br from-green-50 to-sage-50 border border-green-200/50 dark:from-green-950 dark:to-sage-950 dark:border-green-800/30',
}

const cardPaddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

const Card = forwardRef(function Card(
  {
    children,
    className,
    variant = 'default',
    padding = 'md',
    hover = false,
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl transition-all duration-300',
        cardVariants[variant],
        cardPaddings[padding],
        hover && 'hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

CardHeader.displayName = 'CardHeader'

function CardTitle({ children, className, as: Tag = 'h3', ...props }) {
  return (
    <Tag
      className={cn(
        'font-display font-semibold text-olive-900 dark:text-sage-100',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

CardTitle.displayName = 'CardTitle'

function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn('text-sm text-olive-500 dark:text-sage-400', className)}
      {...props}
    >
      {children}
    </p>
  )
}

CardDescription.displayName = 'CardDescription'

function CardContent({ children, className, ...props }) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

CardContent.displayName = 'CardContent'

function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 mt-4 pt-4 border-t border-sage-200 dark:border-sage-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card
