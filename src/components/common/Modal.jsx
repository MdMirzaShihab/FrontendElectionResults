import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2 } from 'lucide-react'
import { cn } from '@utils/cn'
import { Button } from './Button'

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-[95vw]',
}

function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
}) {
  const handleEscapeKey = useCallback(
    (event) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    },
    [onClose, closeOnEscape]
  )

  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('keydown', handleEscapeKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscapeKey])

  if (!isOpen) return null

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10 w-full rounded-2xl',
          'bg-white dark:bg-gradient-to-br dark:from-[#1e2822] dark:to-[#161f1a]',
          'border border-sage-200 dark:border-sage-800',
          'shadow-soft-xl animate-scale-in',
          'max-h-[90vh] flex flex-col',
          sizeStyles[size]
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 p-5 pb-0">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="font-display font-semibold text-lg text-olive-900 dark:text-sage-100"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-olive-500 dark:text-sage-400">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className={cn(
                'shrink-0 p-1.5 rounded-lg transition-all duration-200',
                'text-olive-400 hover:text-olive-700 hover:bg-sage-100',
                'dark:text-sage-500 dark:hover:text-sage-200 dark:hover:bg-sage-800'
              )}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Close button when there is no title */}
        {!title && !description && (
          <button
            onClick={onClose}
            className={cn(
              'absolute top-3 right-3 z-10 p-1.5 rounded-lg transition-all duration-200',
              'text-olive-400 hover:text-olive-700 hover:bg-sage-100',
              'dark:text-sage-500 dark:hover:text-sage-200 dark:hover:bg-sage-800'
            )}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}

        {/* Body */}
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  )
}

Modal.displayName = 'Modal'

function ModalFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-5 pb-5 pt-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

ModalFooter.displayName = 'ModalFooter'

function ConfirmModal({
  isOpen,
  title = 'Confirm action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'primary',
  loading = false,
}) {
  const buttonVariant = variant === 'danger' ? 'danger' : 'primary'

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      {message && (
        <p className="text-sm text-olive-600 dark:text-sage-300">{message}</p>
      )}
      <div className="flex items-center justify-end gap-3 mt-5">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={buttonVariant} size="sm" onClick={onConfirm} loading={loading}>
          {loading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  )
}

ConfirmModal.displayName = 'ConfirmModal'

export { ModalFooter, ConfirmModal }
export default Modal
