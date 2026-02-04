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
        {entry.voteSharePercent.toFixed(2)}%
      </p>
    </div>
  )
}

function VoteShareChart({ data }) {
  if (!data || data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap="20%">
        <XAxis
          dataKey="abbreviation"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="voteSharePercent" barSize={32} radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

VoteShareChart.displayName = 'VoteShareChart'

export default VoteShareChart
