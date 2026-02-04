import { BarChart3, Building2, Clock, ChevronRight, Check } from 'lucide-react'
import { useAdminDashboard } from '@hooks/useAdminDashboard'
import { Button } from '@components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'
import { Badge } from '@components/common/Badge'
import { ProgressBar } from '@components/common/ProgressBar'
import { Skeleton } from '@components/common/Skeleton'
import { formatNumber, formatTimeAgo } from '@utils/formatters'

const STAT_CARDS = [
  { key: 'totalSeats', label: 'Total Seats', icon: BarChart3, suffix: '/300' },
  { key: 'seatsWithResults', label: 'Seats Reporting', icon: Check },
  { key: 'totalCentres', label: 'Total Centres', icon: Building2 },
  { key: 'centresReported', label: 'Centres Reported', icon: Check },
]

function getProgressColor(percent) {
  if (percent > 80) return '#22c55e'
  if (percent >= 40) return '#f59e0b'
  return '#ef4444'
}

function StatCard({ label, value, suffix, icon: Icon }) {
  return (
    <Card variant="default" padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-olive-500 dark:text-sage-400">{label}</p>
          <p className="mt-1 text-2xl font-display font-bold text-olive-900 dark:text-sage-100">
            {formatNumber(value)}
            {suffix && (
              <span className="text-base font-normal text-olive-400 dark:text-sage-500">
                {suffix}
              </span>
            )}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center">
          <Icon size={20} className="text-green-600 dark:text-green-400" />
        </div>
      </div>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} variant="default" padding="md">
            <Skeleton className="h-4 w-24 mb-3 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </Card>
        ))}
      </div>
      <Card variant="default" padding="md">
        <Skeleton className="h-5 w-40 mb-4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-full" />
      </Card>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { dashboard, isLoading, refresh } = useAdminDashboard()

  if (isLoading && !dashboard) {
    return <DashboardSkeleton />
  }

  if (!dashboard) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-olive-500 dark:text-sage-400">Unable to load dashboard data.</p>
        <Button variant="outline" onClick={refresh}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-olive-900 dark:text-sage-100">
          Dashboard
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          loading={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <StatCard
            key={card.key}
            label={card.label}
            value={dashboard[card.key]}
            suffix={card.suffix}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Overall progress */}
      <Card variant="gradient" padding="md">
        <ProgressBar
          value={dashboard.overallPercent}
          max={100}
          label="Overall Completion"
          showPercent
          size="lg"
        />
      </Card>

      {/* Division progress */}
      <Card variant="default" padding="none">
        <CardHeader className="px-5 pt-5">
          <CardTitle>Division Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-sage-100 dark:divide-sage-800">
            {dashboard.divisionProgress.map((div) => (
              <div
                key={div.divisionId}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3"
              >
                <span className="text-sm font-medium text-olive-700 dark:text-sage-300 sm:w-32 shrink-0">
                  {div.name}
                </span>
                <div className="flex-1">
                  <ProgressBar
                    value={div.percent}
                    max={100}
                    size="md"
                    color={getProgressColor(div.percent)}
                  />
                </div>
                <span className="text-sm font-medium text-olive-500 dark:text-sage-400 sm:w-20 text-right shrink-0">
                  {div.reported}/{div.total} ({div.percent}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card variant="default" padding="none">
        <CardHeader className="px-5 pt-5">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {dashboard.recentActivity.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-olive-400 dark:text-sage-500">
              No recent activity
            </p>
          ) : (
            <div className="divide-y divide-sage-100 dark:divide-sage-800">
              {dashboard.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 px-5 py-3"
                >
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-sage-100 dark:bg-sage-800 flex items-center justify-center shrink-0">
                    <Clock size={14} className="text-olive-400 dark:text-sage-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="primary" size="sm">
                        {activity.adminName || activity.adminEmail}
                      </Badge>
                      <span className="text-xs text-olive-400 dark:text-sage-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-olive-600 dark:text-sage-300 truncate">
                      {activity.detail || activity.action}
                    </p>
                    {(activity.seatName || activity.seatId) && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-olive-400 dark:text-sage-500">
                        <ChevronRight size={12} />
                        <span>
                          {activity.seatName || activity.seatId}
                          {activity.centreName && ` / ${activity.centreName}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
