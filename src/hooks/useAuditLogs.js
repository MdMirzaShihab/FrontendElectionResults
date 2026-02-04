import { useState, useCallback, useEffect } from 'react'
import { getAuditLogs } from '@data/mockData'

export function useAuditLogs() {
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({ seatId: null, action: null, page: 1 })

  const fetch = useCallback(async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 300))
    const result = getAuditLogs(filters, filters.page, 15)
    setLogs(result.logs)
    setPagination({ page: result.page, totalPages: result.totalPages, total: result.total })
    setIsLoading(false)
  }, [filters])

  useEffect(() => { fetch() }, [fetch])

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const setPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  return { logs, pagination, isLoading, filters, updateFilters, setPage, refresh: fetch }
}
