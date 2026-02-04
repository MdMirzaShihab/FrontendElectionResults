import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { useAuditLogs } from '@hooks/useAuditLogs'
import { getSeats } from '@data/mockData'
import { Card, CardContent } from '@components/common/Card'
import { Select } from '@components/common/Select'
import { Badge } from '@components/common/Badge'
import { Pagination } from '@components/common/Pagination'
import { Skeleton } from '@components/common/Skeleton'
import { formatDate } from '@utils/formatters'
import { cn } from '@utils/cn'

const ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  { value: 'CENTRE_RESULT_SUBMITTED', label: 'Result Submitted' },
  { value: 'CENTRE_RESULT_UPDATED', label: 'Result Updated' },
  { value: 'SEAT_STATUS_CHANGED', label: 'Status Changed' },
  { value: 'USER_LOGIN', label: 'Login' },
  { value: 'USER_LOGOUT', label: 'Logout' },
  { value: 'DATA_EXPORT', label: 'Export' },
  { value: 'RESULT_VERIFIED', label: 'Verified' },
  { value: 'RESULT_CORRECTION', label: 'Correction' },
]

function getActionBadgeVariant(action) {
  if (action.includes('SUBMITTED') || action.includes('VERIFIED')) return 'primary'
  if (action.includes('UPDATED') || action.includes('CORRECTION') || action.includes('CHANGED')) return 'warning'
  if (action.includes('DELETE')) return 'error'
  return 'info'
}

function getActionLabel(action) {
  const match = ACTION_OPTIONS.find((opt) => opt.value === action)
  if (match) return match.label
  return action.replace(/_/g, ' ').toLowerCase()
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-sage-100 dark:divide-sage-800">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-md flex-1" />
          <Skeleton className="h-4 w-40 rounded-md hidden lg:block" />
        </div>
      ))}
    </div>
  )
}

function ExpandableDetail({ text }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text && text.length > 60

  if (!text) return <span className="text-olive-300 dark:text-sage-600">--</span>

  if (!isLong) {
    return (
      <span className="text-sm text-olive-600 dark:text-sage-300">{text}</span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setExpanded((prev) => !prev)}
      className="text-left text-sm text-olive-600 dark:text-sage-300 hover:text-olive-800 dark:hover:text-sage-100"
    >
      {expanded ? text : `${text.slice(0, 57)}...`}
    </button>
  )
}

export default function AuditLogPage() {
  const { logs, pagination, isLoading, filters, updateFilters, setPage } = useAuditLogs()

  const seatOptions = useMemo(() => {
    const allSeats = getSeats({ page: 1, limit: 100 }).seats
    return [
      { value: '', label: 'All Seats' },
      ...allSeats.map((seat) => ({
        value: seat.id,
        label: `${seat.seatNumber}. ${seat.name}`,
      })),
    ]
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-olive-900 dark:text-sage-100">
          Audit Logs
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-56">
          <Select
            label="Seat"
            options={seatOptions}
            value={filters.seatId || ''}
            onChange={(e) => updateFilters({ seatId: e.target.value || null })}
            size="sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            label="Action"
            options={ACTION_OPTIONS}
            value={filters.action || ''}
            onChange={(e) => updateFilters({ action: e.target.value || null })}
            size="sm"
          />
        </div>
      </div>

      {/* Table */}
      <Card variant="default" padding="none">
        {isLoading ? (
          <TableSkeleton />
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FileText size={32} className="text-olive-300 dark:text-sage-600" />
            <p className="text-sm text-olive-400 dark:text-sage-500">
              No audit logs found
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table header */}
            <div className="hidden lg:flex items-center gap-4 px-5 py-3 border-b border-sage-200 dark:border-sage-800 bg-sage-50 dark:bg-sage-900/50 rounded-t-2xl">
              <span className="text-xs font-medium text-olive-500 dark:text-sage-400 uppercase tracking-wider w-40">
                Timestamp
              </span>
              <span className="text-xs font-medium text-olive-500 dark:text-sage-400 uppercase tracking-wider w-36">
                Admin
              </span>
              <span className="text-xs font-medium text-olive-500 dark:text-sage-400 uppercase tracking-wider w-28">
                Action
              </span>
              <span className="text-xs font-medium text-olive-500 dark:text-sage-400 uppercase tracking-wider w-36">
                Seat
              </span>
              <span className="text-xs font-medium text-olive-500 dark:text-sage-400 uppercase tracking-wider flex-1">
                Details
              </span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-sage-100 dark:divide-sage-800">
              {logs.map((log, index) => (
                <div
                  key={log.id}
                  className={cn(
                    'flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 px-5 py-3',
                    index % 2 === 1 && 'bg-sage-50/50 dark:bg-sage-900/20'
                  )}
                >
                  {/* Timestamp */}
                  <div className="lg:w-40 shrink-0">
                    <span className="text-sm text-olive-600 dark:text-sage-300 lg:text-xs">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>

                  {/* Admin */}
                  <div className="lg:w-36 shrink-0">
                    <p className="text-sm font-medium text-olive-700 dark:text-sage-200">
                      {log.adminName || log.adminId}
                    </p>
                    <p className="text-xs text-olive-400 dark:text-sage-500">
                      {log.adminEmail}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="lg:w-28 shrink-0">
                    <Badge
                      variant={getActionBadgeVariant(log.action)}
                      size="sm"
                    >
                      {getActionLabel(log.action)}
                    </Badge>
                  </div>

                  {/* Seat */}
                  <div className="lg:w-36 shrink-0">
                    <span className="text-sm text-olive-600 dark:text-sage-300">
                      {log.seatName || log.seatId || '--'}
                    </span>
                    {log.centreName && (
                      <p className="text-xs text-olive-400 dark:text-sage-500">
                        {log.centreName}
                      </p>
                    )}
                  </div>

                  {/* Details (hidden on mobile, visible on desktop) */}
                  <div className="hidden lg:block flex-1 min-w-0">
                    <ExpandableDetail text={log.detail || log.details} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
