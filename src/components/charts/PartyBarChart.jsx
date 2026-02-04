import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@utils/cn'
import { formatNumber } from '@utils/formatters'

function formatAbbreviated(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null

  const entry = payload[0].payload

  return (
    <div
      className={cn(
        'bg-white dark:bg-sage-900',
        'border border-sage-200 dark:border-sage-800',
        'rounded-xl shadow-soft p-3'
      )}
    >
      <p className="font-display font-semibold text-sm text-olive-900 dark:text-sage-100">
        {entry.name}
      </p>
      <p className="text-sm font-medium text-olive-700 dark:text-sage-200 mt-1">
        {formatNumber(entry.votes)} votes
      </p>
    </div>
  )
}

function PartyBarChart({ data }) {
  if (!data || data.length === 0) return null

  const sorted = [...data].sort((a, b) => b.votes - a.votes)
  const chartHeight = Math.max(300, sorted.length * 45)

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart layout="vertical" data={sorted}>
        <XAxis
          type="number"
          tickFormatter={formatAbbreviated}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="abbreviation"
          width={50}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="votes" barSize={24} radius={[0, 6, 6, 0]}>
          {sorted.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

PartyBarChart.displayName = 'PartyBarChart'

export default PartyBarChart
