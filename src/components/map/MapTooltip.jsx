import { cn } from '@utils/cn'
import { formatNumber } from '@utils/formatters'

function MapTooltip({ seat, position, visible }) {
  if (!seat) return null

  return (
    <div
      className={cn(
        'fixed z-50 pointer-events-none',
        'bg-white dark:bg-sage-900',
        'border border-sage-200 dark:border-sage-800',
        'rounded-xl shadow-soft-lg p-3',
        'transition-all duration-150 ease-out',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-1'
      )}
      style={{
        left: position?.x ? position.x + 12 : 0,
        top: position?.y ? position.y - 8 : 0,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <p className="font-display font-semibold text-sm text-olive-900 dark:text-sage-100">
          {seat.name}
        </p>
        <span className="text-xs text-olive-500 dark:text-sage-400">
          #{seat.seatNumber}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: seat.leadingPartyColor }}
        />
        <span className="text-xs font-medium text-olive-700 dark:text-sage-200">
          {seat.leadingPartyName}
        </span>
      </div>

      <p className="text-xs text-olive-600 dark:text-sage-300 mb-2">
        {formatNumber(seat.totalVotes)} votes
      </p>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-olive-500 dark:text-sage-400">
            Completion
          </span>
          <span className="text-[10px] font-medium text-olive-600 dark:text-sage-300">
            {seat.completionPercent}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-sage-200 dark:bg-sage-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 dark:bg-green-400 transition-all duration-500"
            style={{ width: `${seat.completionPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

MapTooltip.displayName = 'MapTooltip'

export default MapTooltip
