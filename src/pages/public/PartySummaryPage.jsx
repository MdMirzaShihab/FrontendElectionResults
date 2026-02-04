import { useState, useMemo } from 'react'
import { useParties } from '@hooks/useParties'
import { formatNumber, formatPercent } from '@utils/formatters'
import { cn } from '@utils/cn'
import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'
import { Badge } from '@components/common/Badge'
import { StatCardSkeleton, Skeleton } from '@components/common/Skeleton'
import { LastUpdatedIndicator } from '@components/common/LastUpdatedIndicator'
import { ArrowUpDown } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'

const SORTABLE_COLUMNS = [
  { key: 'name', label: 'Party Name' },
  { key: 'totalVotes', label: 'Votes' },
  { key: 'voteSharePercent', label: 'Vote Share %' },
  { key: 'seatsLeading', label: 'Leading' },
  { key: 'seatsWon', label: 'Won' },
]

function CustomBarTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <div className="rounded-xl bg-white dark:bg-olive-900 border border-sage-200 dark:border-sage-700 px-3 py-2 shadow-soft-lg text-sm">
      <p className="font-semibold text-olive-800 dark:text-sage-100">
        {data.name}
      </p>
      <p className="text-olive-600 dark:text-sage-300">
        {formatPercent(data.voteSharePercent)} vote share
      </p>
    </div>
  )
}

export default function PartySummaryPage() {
  const { parties, lastUpdated, isLoading } = useParties()
  const [sortKey, setSortKey] = useState('totalVotes')
  const [sortOrder, setSortOrder] = useState('desc')

  const sortedParties = useMemo(() => {
    if (!parties || parties.length === 0) return []

    return [...parties].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]

      if (sortKey === 'name') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
        if (sortOrder === 'asc') return aVal < bVal ? -1 : 1
        return aVal > bVal ? -1 : 1
      }

      if (sortOrder === 'asc') return aVal - bVal
      return bVal - aVal
    })
  }, [parties, sortKey, sortOrder])

  const topParties = useMemo(() => {
    if (!parties || parties.length === 0) return []
    return [...parties]
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 4)
  }, [parties])

  const chartData = useMemo(() => {
    if (!parties || parties.length === 0) return []
    return [...parties]
      .sort((a, b) => b.voteSharePercent - a.voteSharePercent)
      .map((p) => ({
        name: p.abbreviation,
        voteSharePercent: p.voteSharePercent,
        color: p.color,
      }))
  }, [parties])

  function handleSort(key) {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  if (isLoading && parties.length === 0) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Party Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topParties.map((party, index) => (
          <Card
            key={party.partyId}
            padding="none"
            className={cn(
              'overflow-hidden animate-slide-up',
              index === 1 && 'animate-delay-100',
              index === 2 && 'animate-delay-200',
              index === 3 && 'animate-delay-300'
            )}
          >
            <div className="flex">
              <div
                className="w-1 shrink-0"
                style={{ backgroundColor: party.color }}
              />
              <div className="p-4 flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-display font-semibold text-olive-900 dark:text-sage-100 truncate text-sm">
                    {party.name}
                  </h3>
                  <Badge size="sm" color={party.color}>
                    {party.abbreviation}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
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
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* All Parties Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Parties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-olive-500 dark:text-sage-400 text-xs border-b border-sage-200 dark:border-sage-800">
                  {SORTABLE_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'pb-3 font-medium cursor-pointer select-none hover:text-olive-700 dark:hover:text-sage-200 transition-colors',
                        col.key === 'name' ? 'text-left' : 'text-right',
                        (col.key === 'seatsLeading' ||
                          col.key === 'seatsWon') &&
                          'hidden sm:table-cell'
                      )}
                      onClick={() => handleSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown
                          size={12}
                          className={cn(
                            sortKey === col.key
                              ? 'text-green-500'
                              : 'opacity-40'
                          )}
                        />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedParties.map((party) => (
                  <tr
                    key={party.partyId}
                    className="border-b border-sage-100 dark:border-sage-800/50 last:border-0"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: party.color }}
                        />
                        <span className="font-medium text-olive-800 dark:text-sage-200">
                          {party.name}
                        </span>
                        <span className="text-olive-400 dark:text-sage-500 text-xs hidden sm:inline">
                          ({party.abbreviation})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium text-olive-800 dark:text-sage-200">
                      {formatNumber(party.totalVotes)}
                    </td>
                    <td className="py-3 text-right text-olive-600 dark:text-sage-300">
                      {formatPercent(party.voteSharePercent)}
                    </td>
                    <td className="py-3 text-right text-olive-600 dark:text-sage-300 hidden sm:table-cell">
                      {party.seatsLeading}
                    </td>
                    <td className="py-3 text-right font-medium text-olive-800 dark:text-sage-200 hidden sm:table-cell">
                      {party.seatsWon}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Vote Share Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Vote Share Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#696752' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#696752' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="voteSharePercent"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-olive-400 dark:text-sage-500">
              No party data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="flex justify-center pt-2">
        <LastUpdatedIndicator lastUpdated={lastUpdated} />
      </div>
    </div>
  )
}
