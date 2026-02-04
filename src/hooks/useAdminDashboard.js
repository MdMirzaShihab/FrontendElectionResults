import { useCallback } from 'react'
import { useResultsStore } from '@store/resultsStore'
import { useAutoRefresh } from './useAutoRefresh'

export function useAdminDashboard() {
  const { adminDashboard, isLoading, error, fetchAdminDashboard } = useResultsStore()

  const fetch = useCallback(() => fetchAdminDashboard(), [fetchAdminDashboard])

  useAutoRefresh(fetch, { interval: 60000 })

  return { dashboard: adminDashboard, isLoading, error, refresh: fetch }
}
