import { useMemo } from 'react'
import { useOverview } from '@hooks/useOverview'
import { formatNumber, formatPercent } from '@utils/formatters'
import { cn } from '@utils/cn'
import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'
import { Badge } from '@components/common/Badge'
import { StatCardSkeleton, Skeleton } from '@components/common/Skeleton'
import { LastUpdatedIndicator } from '@components/common/LastUpdatedIndicator'
import { Vote, Trophy, BarChart3, Percent, TrendingUp } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const STAT_CARDS = [
  {
    key: 'totalVotes',
    label: 'Total Votes Cast',
    icon: Vote,
    colorClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    getValue: (o) => formatNumber(o.totalVotesCast),
  },
  {
    key: 'seatsDeclared',
    label: 'Seats Declared',
    icon: Trophy,
    colorClass: 'bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-400',
    getValue: (o) => `${o.seatsDeclared}/300`,
  },
  {
    key: 'seatsReporting',
    label: 'Seats Reporting',
    icon: BarChart3,
    colorClass: 'bg-sage-200 text-sage-600 dark:bg-sage-800 dark:text-sage-300',
    getValue: (o) => String(o.seatsReporting),
  },
  {
    key: 'turnout',
    label: 'Voter Turnout',
    icon: Percent,
    colorClass: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
    getValue: (o) => formatPercent(o.turnoutPercent),
  },
]

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <div className="rounded-xl bg-white dark:bg-olive-900 border border-sage-200 dark:border-sage-700 px-3 py-2 shadow-soft-lg text-sm">
      <p className="font-semibold text-olive-800 dark:text-sage-100">
        {data.name}
      </p>
      <p className="text-olive-600 dark:text-sage-300">
        {formatNumber(data.value)} votes ({formatPercent(data.percent)})
      </p>
    </div>
  )
}

function CustomBarTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <div className="rounded-xl bg-white dark:bg-olive-900 border border-sage-200 dark:border-sage-700 px-3 py-2 shadow-soft-lg text-sm">
      <p className="font-semibold text-olive-800 dark:text-sage-100">
        {data.name}
      </p>
      <p className="text-olive-600 dark:text-sage-300">
        {formatNumber(data.totalVotes)} votes
      </p>
    </div>
  )
}

export default function OverviewPage() {
  const { overview, lastUpdated, isLoading } = useOverview()

  const pieData = useMemo(() => {
    if (!overview?.partyStandings) return []

    const sorted = [...overview.partyStandings].sort(
      (a, b) => b.totalVotes - a.totalVotes
    )
    const top5 = sorted.slice(0, 5)
    const othersVotes = sorted
      .slice(5)
      .reduce((sum, p) => sum + p.totalVotes, 0)

    const result = top5.map((p) => ({
      name: p.abbreviation,
      value: p.totalVotes,
      percent: p.voteSharePercent,
      color: p.color,
    }))

    if (othersVotes > 0) {
      const totalVotes = overview.totalVotesCast || 1
      result.push({
        name: 'Others',
        value: othersVotes,
        percent: Math.round((othersVotes / totalVotes) * 10000) / 100,
        color: '#9CA3AF',
      })
    }

    return result
  }, [overview])

  const barData = useMemo(() => {
    if (!overview?.partyStandings) return []

    return [...overview.partyStandings]
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .map((p) => ({
        name: p.abbreviation,
        totalVotes: p.totalVotes,
        color: p.color,
      }))
  }, [overview])

  const topParties = useMemo(() => {
    if (!overview?.partyStandings) return []
    return [...overview.partyStandings]
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 4)
  }, [overview])

  if (isLoading && !overview) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Skeleton className="h-64 w-full rounded-xl" />
          </Card>
          <Card>
            <Skeleton className="h-64 w-full rounded-xl" />
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!overview) return null

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, index) => {
          const Icon = card.icon

          return (
            <div
              key={card.key}
              className={cn(
                'stat-card animate-slide-up',
                index === 1 && 'animate-delay-100',
                index === 2 && 'animate-delay-200',
                index === 3 && 'animate-delay-300'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-olive-500 dark:text-sage-400 mb-1">
                    {card.label}
                  </p>
                  <p className="font-display text-3xl font-bold text-olive-900 dark:text-sage-50 number-transition">
                    {card.getValue(overview)}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-xl',
                    card.colorClass
                  )}
                >
                  <Icon size={20} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                <TrendingUp size={12} />
                <span>Live</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-olive-400 dark:text-sage-500">
                No vote data available
              </div>
            )}
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-olive-600 dark:text-sage-300">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Party Vote Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, bottom: 0, left: 40 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={40}
                    tick={{ fontSize: 12, fill: '#696752' }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="totalVotes" radius={[0, 6, 6, 0]} barSize={20}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-olive-400 dark:text-sage-500">
                No vote data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leading Parties */}
      <div>
        <h2 className="font-display text-xl font-semibold text-olive-900 dark:text-sage-100 mb-4">
          Leading Parties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topParties.map((party, index) => (
            <Card
              key={party.partyId}
              className={cn(
                'animate-slide-up overflow-hidden',
                index === 1 && 'animate-delay-100',
                index === 2 && 'animate-delay-200',
                index === 3 && 'animate-delay-300'
              )}
              padding="none"
            >
              <div className="flex">
                <div
                  className="w-1.5 shrink-0"
                  style={{ backgroundColor: party.color }}
                />
                <div className="p-4 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-display font-semibold text-olive-900 dark:text-sage-100 truncate">
                      {party.name}
                    </h3>
                    <Badge size="sm" color={party.color}>
                      {party.abbreviation}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-olive-500 dark:text-sage-400 text-xs">
                        Seats Won
                      </p>
                      <p className="font-semibold text-olive-800 dark:text-sage-200">
                        {party.seatsWon}
                      </p>
                    </div>
                    <div>
                      <p className="text-olive-500 dark:text-sage-400 text-xs">
                        Leading
                      </p>
                      <p className="font-semibold text-olive-800 dark:text-sage-200">
                        {party.seatsLeading}
                      </p>
                    </div>
                    <div>
                      <p className="text-olive-500 dark:text-sage-400 text-xs">
                        Total Votes
                      </p>
                      <p className="font-semibold text-olive-800 dark:text-sage-200">
                        {formatNumber(party.totalVotes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-olive-500 dark:text-sage-400 text-xs">
                        Vote Share
                      </p>
                      <p className="font-semibold text-olive-800 dark:text-sage-200">
                        {formatPercent(party.voteSharePercent)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex justify-center pt-2">
        <LastUpdatedIndicator lastUpdated={lastUpdated} />
      </div>
    </div>
  )
}
