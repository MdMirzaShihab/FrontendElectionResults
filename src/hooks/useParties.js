import { useCallback } from 'react'
import { useResultsStore } from '@store/resultsStore'
import { useAutoRefresh } from './useAutoRefresh'
import { useSimulation } from './useSimulation'

export function useParties() {
  const { parties, lastUpdated, isLoading, error, fetchParties } = useResultsStore()

  const fetch = useCallback(() => fetchParties(), [fetchParties])

  useAutoRefresh(fetch, { interval: 30000 })
  useSimulation(useCallback(() => fetchParties(), [fetchParties]))

  return { parties, lastUpdated, isLoading, error, refresh: fetch }
}
