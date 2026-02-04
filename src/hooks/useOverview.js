import { useCallback } from 'react'
import { useResultsStore } from '@store/resultsStore'
import { useAutoRefresh } from './useAutoRefresh'
import { useSimulation } from './useSimulation'

export function useOverview() {
  const { overview, lastUpdated, isLoading, error, fetchOverview } = useResultsStore()

  const fetch = useCallback(() => fetchOverview(), [fetchOverview])

  useAutoRefresh(fetch, { interval: 30000 })
  useSimulation(useCallback(() => fetchOverview(), [fetchOverview]))

  return { overview, lastUpdated, isLoading, error, refresh: fetch }
}
