import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@utils/cn'
import { formatNumber } from '@utils/formatters'

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null

  const entry = payload[0]
  const { name, abbreviation, value } = entry.payload
  const percent = entry.percent

  return (
    <div
      className={cn(
        'bg-white dark:bg-sage-900',
        'border border-sage-200 dark:border-sage-800',
        'rounded-xl shadow-soft p-3'
      )}
    >
      <p className="font-display font-semibold text-sm text-olive-900 dark:text-sage-100">
        {name}
      </p>
      <p className="text-xs text-olive-500 dark:text-sage-400 mt-0.5">
        {abbreviation}
      </p>
      <p className="text-sm font-medium text-olive-700 dark:text-sage-200 mt-1.5">
        {formatNumber(value)} votes
      </p>
      <p className="text-xs text-olive-500 dark:text-sage-400">
        {(percent * 100).toFixed(1)}%
      </p>
    </div>
  )
}

function legendFormatter(value, entry) {
  const abbreviation = entry.payload?.abbreviation || value
  return (
    <span className="text-xs text-olive-600 dark:text-olive-300">
      {abbreviation}
    </span>
  )
}

function PartyPieChart({ data }) {
  if (!data || data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          label={({ name, percent }) =>
            percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : ''
          }
          labelLine
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          layout="horizontal"
          formatter={legendFormatter}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

PartyPieChart.displayName = 'PartyPieChart'

export default PartyPieChart
