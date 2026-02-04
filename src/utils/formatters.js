export function formatNumber(n) {
  if (n == null) return '0'
  return Number(n).toLocaleString('en-US')
}

export function formatPercent(value, decimals = 1) {
  if (value == null) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

export function formatDate(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatTimeAgo(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
