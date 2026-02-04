import { formatNumber, formatPercent } from '@utils/formatters'
import { Card } from '@components/common/Card'

export function DistrictTooltip({ district, position }) {
  if (!district) return null

  return (
    <div
      className="fixed z-50 pointer-events-none animate-fade-in"
      style={{
        left: position.x + 12,
        top: position.y - 8,
      }}
    >
      <Card
        variant="elevated"
        padding="sm"
        className="min-w-[200px] shadow-soft-lg"
      >
        <p className="font-display font-semibold text-sm text-olive-900 dark:text-sage-100 mb-1.5">
          {district.name}
        </p>
        <div className="space-y-1.5 text-xs text-olive-600 dark:text-sage-300">
          <p className="flex items-center gap-1.5">
            <span className="text-olive-400 dark:text-sage-500">Leading: </span>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 inline-block"
              style={{ backgroundColor: district.leadingPartyColor }}
            />
            {district.leadingPartyName}
          </p>
          <p>
            <span className="text-olive-400 dark:text-sage-500">Seats: </span>
            {district.seatBreakdown || `${district.seatCount} total`}
          </p>
          <p>
            <span className="text-olive-400 dark:text-sage-500">Votes: </span>
            {formatNumber(district.totalVotes)}
          </p>
          <div>
            <span className="text-olive-400 dark:text-sage-500">
              Completed:{' '}
            </span>
            {formatPercent(district.completionPercent, 0)}
            <div className="mt-1 w-full h-1.5 bg-sage-200 dark:bg-sage-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${district.completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
