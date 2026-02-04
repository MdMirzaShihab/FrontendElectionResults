import { useCallback } from 'react'
import { useResultsStore } from '@store/resultsStore'
import { useAutoRefresh } from './useAutoRefresh'
import { useSimulation } from './useSimulation'

export function useSeatDetail(seatId) {
  const { seatDetail, seatCentres, isLoading, error, fetchSeatDetail, fetchSeatCentres } = useResultsStore()

  const fetch = useCallback(async () => {
    if (!seatId) return
    await Promise.all([fetchSeatDetail(seatId), fetchSeatCentres(seatId)])
  }, [seatId, fetchSeatDetail, fetchSeatCentres])

  useAutoRefresh(fetch, { interval: 30000, enabled: !!seatId })
  useSimulation(useCallback(() => { if (seatId) fetch() }, [seatId, fetch]))

  return { seatDetail, seatCentres, isLoading, error, refresh: fetch }
}
