import { useCallback } from 'react'
import { useResultsStore } from '@store/resultsStore'
import { useAutoRefresh } from './useAutoRefresh'
import { useSimulation } from './useSimulation'

export function useMapData() {
  const { mapData, lastUpdated, isLoading, error, fetchMapData } = useResultsStore()

  const fetch = useCallback(() => fetchMapData(), [fetchMapData])

  useAutoRefresh(fetch, { interval: 30000 })
  useSimulation(useCallback(() => fetchMapData(), [fetchMapData]))

  return { mapData, lastUpdated, isLoading, error, refresh: fetch }
}
