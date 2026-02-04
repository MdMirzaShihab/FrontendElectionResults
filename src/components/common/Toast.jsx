import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useUIStore } from '@store/uiStore'
import { cn } from '@utils/cn'

const typeConfig = {
  success: {
    icon: CheckCircle,
    containerClass:
      'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    iconClass: 'text-green-600 dark:text-green-400',
    textClass: 'text-green-800 dark:text-green-200',
  },
  error: {
    icon: XCircle,
    containerClass:
      'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    iconClass: 'text-red-600 dark:text-red-400',
    textClass: 'text-red-800 dark:text-red-200',
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      'bg-accent-50 border-accent-200 dark:bg-accent-950 dark:border-accent-800',
    iconClass: 'text-accent-600 dark:text-accent-400',
    textClass: 'text-accent-800 dark:text-accent-200',
  },
  info: {
    icon: Info,
    containerClass:
      'bg-sage-100 border-sage-300 dark:bg-sage-900 dark:border-sage-700',
    iconClass: 'text-sage-600 dark:text-sage-400',
    textClass: 'text-olive-700 dark:text-sage-200',
  },
}

function Toast({ type = 'info', message, onClose }) {
  const config = typeConfig[type] || typeConfig.info
  const IconComponent = config.icon

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-soft-lg',
        'animate-slide-down transition-all duration-200',
        'min-w-[320px] max-w-[420px]',
        config.containerClass
      )}
      role="alert"
    >
      <IconComponent className={cn('shrink-0 mt-0.5', config.iconClass)} size={18} />

      <p className={cn('flex-1 text-sm font-medium', config.textClass)}>
        {message}
      </p>

      <button
        onClick={onClose}
        className={cn(
          'shrink-0 p-1 rounded-lg transition-all duration-200',
          'text-olive-400 hover:text-olive-600 hover:bg-black/5',
          'dark:text-sage-500 dark:hover:text-sage-200 dark:hover:bg-white/5'
        )}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}

Toast.displayName = 'Toast'

function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts)
  const removeToast = useUIStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

ToastContainer.displayName = 'ToastContainer'

export { Toast }
export default ToastContainer
