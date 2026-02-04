import { useCallback, useEffect } from 'react'
import { useResultsStore } from '@store/resultsStore'
import { useFilterStore } from '@store/filterStore'
import { useAutoRefresh } from './useAutoRefresh'
import { useSimulation } from './useSimulation'

export function useSeats() {
  const { seats, seatsPagination, isLoading, error, fetchSeats } = useResultsStore()
  const filters = useFilterStore()

  const fetch = useCallback(() => {
    return fetchSeats({
      divisionId: filters.divisionId,
      districtId: filters.districtId,
      status: filters.seatStatus,
      searchQuery: filters.searchQuery,
      page: filters.page,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    })
  }, [fetchSeats, filters.divisionId, filters.districtId, filters.seatStatus, filters.searchQuery, filters.page, filters.sortBy, filters.sortOrder])

  useAutoRefresh(fetch, { interval: 30000 })
  useSimulation(useCallback(() => fetch(), [fetch]))

  useEffect(() => {
    fetch()
  }, [filters.divisionId, filters.districtId, filters.seatStatus, filters.searchQuery, filters.page])

  return { seats, pagination: seatsPagination, isLoading, error, refresh: fetch }
}
