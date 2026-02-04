import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@utils/cn'

const basePageClass =
  'inline-flex items-center justify-center min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg transition-all duration-200'

function getPageRange(currentPage, totalPages) {
  const delta = 1
  const pages = []

  const rangeStart = Math.max(2, currentPage - delta)
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

  pages.push(1)

  if (rangeStart > 2) {
    pages.push('start-ellipsis')
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  if (rangeEnd < totalPages - 1) {
    pages.push('end-ellipsis')
  }

  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = getPageRange(currentPage, totalPages)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center">
      {/* Desktop pagination */}
      <div className="hidden sm:flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={cn(
            basePageClass,
            'bg-sage-100 text-olive-600 hover:bg-sage-200',
            'dark:bg-sage-800 dark:text-sage-300 dark:hover:bg-sage-700',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sage-100',
            'dark:disabled:hover:bg-sage-800'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page) => {
          if (typeof page === 'string') {
            return (
              <span
                key={page}
                className="inline-flex items-center justify-center min-w-[36px] h-9 text-sm text-olive-400 dark:text-sage-500"
              >
                ...
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                basePageClass,
                isActive
                  ? 'bg-green-500 text-white shadow-soft dark:bg-green-500'
                  : 'bg-sage-100 text-olive-600 hover:bg-sage-200 dark:bg-sage-800 dark:text-sage-300 dark:hover:bg-sage-700'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          )
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={cn(
            basePageClass,
            'bg-sage-100 text-olive-600 hover:bg-sage-200',
            'dark:bg-sage-800 dark:text-sage-300 dark:hover:bg-sage-700',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sage-100',
            'dark:disabled:hover:bg-sage-800'
          )}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Mobile pagination */}
      <div className="flex sm:hidden items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={cn(
            basePageClass,
            'bg-sage-100 text-olive-600 hover:bg-sage-200',
            'dark:bg-sage-800 dark:text-sage-300 dark:hover:bg-sage-700',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-sm text-olive-600 dark:text-sage-300">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={cn(
            basePageClass,
            'bg-sage-100 text-olive-600 hover:bg-sage-200',
            'dark:bg-sage-800 dark:text-sage-300 dark:hover:bg-sage-700',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  )
}

Pagination.displayName = 'Pagination'

export { Pagination }
export default Pagination
