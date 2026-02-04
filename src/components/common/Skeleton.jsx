import { cn } from '@utils/cn'

function Skeleton({ className, width, height }) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-sage-200 via-sage-100 to-sage-200',
        'dark:from-sage-800 dark:via-sage-700 dark:to-sage-800',
        'animate-pulse bg-[length:200%_100%] rounded',
        className
      )}
      style={{
        width: width || undefined,
        height: height || undefined,
      }}
    />
  )
}

Skeleton.displayName = 'Skeleton'

function SeatCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 border border-sage-200 dark:border-sage-800',
        'bg-white dark:bg-gradient-to-br dark:from-[#1e2822] dark:to-[#161f1a]',
        className
      )}
    >
      {/* Seat name */}
      <Skeleton className="h-5 w-3/4 mb-3 rounded-md" />

      {/* Candidate name */}
      <Skeleton className="h-4 w-1/2 mb-4 rounded-md" />

      {/* Progress bar */}
      <Skeleton className="h-2.5 w-full mb-3 rounded-full" />

      {/* Vote count row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-20 rounded-md" />
        <Skeleton className="h-3.5 w-16 rounded-md" />
      </div>
    </div>
  )
}

SeatCardSkeleton.displayName = 'SeatCardSkeleton'

function StatCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 border border-sage-200 dark:border-sage-800',
        'bg-white dark:bg-gradient-to-br dark:from-[#1e2822] dark:to-[#161f1a]',
        className
      )}
    >
      {/* Label */}
      <Skeleton className="h-3.5 w-20 mb-3 rounded-md" />

      {/* Number */}
      <Skeleton className="h-8 w-16 mb-2 rounded-md" />

      {/* Subtext */}
      <Skeleton className="h-3 w-24 rounded-md" />
    </div>
  )
}

StatCardSkeleton.displayName = 'StatCardSkeleton'

export { Skeleton, SeatCardSkeleton, StatCardSkeleton }
export default Skeleton
