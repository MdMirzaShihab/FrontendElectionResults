import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSeats } from '@hooks/useSeats'
import { useFilterStore } from '@store/filterStore'
import { getDivisions, getDistricts } from '@data/mockData'
import { formatNumber } from '@utils/formatters'
import { cn } from '@utils/cn'
import { Card } from '@components/common/Card'
import { Input } from '@components/common/Input'
import { Select } from '@components/common/Select'
import { Button } from '@components/common/Button'
import { Badge } from '@components/common/Badge'
import { ProgressBar } from '@components/common/ProgressBar'
import { Pagination } from '@components/common/Pagination'
import { SeatCardSkeleton } from '@components/common/Skeleton'
import { Search, Filter } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const STATUS_COLORS = {
  not_started: 'bg-red-500',
  in_progress: 'bg-accent-500',
  completed: 'bg-green-500',
}

const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

function SeatCard({ seat, onClick }) {
  const completionPercent =
    seat.totalCentres > 0
      ? Math.round((seat.reportedCentreCount / seat.totalCentres) * 100)
      : 0

  return (
    <Card hover onClick={onClick} className="animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="primary" size="sm">
            #{seat.seatNumber}
          </Badge>
          <h3 className="font-display font-semibold text-olive-900 dark:text-sage-100 truncate">
            {seat.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              'w-2 h-2 rounded-full shrink-0',
              STATUS_COLORS[seat.status]
            )}
          />
          <span className="text-xs text-olive-500 dark:text-sage-400">
            {STATUS_LABELS[seat.status]}
          </span>
        </div>
      </div>

      {seat.leadingCandidate ? (
        <div className="mb-3">
          <p className="text-sm text-olive-700 dark:text-sage-200 truncate">
            {seat.leadingCandidate.name}
          </p>
          <Badge
            size="sm"
            color={seat.leadingCandidate.partyColor}
            className="mt-1"
          >
            {seat.leadingCandidate.partyAbbreviation}
          </Badge>
        </div>
      ) : (
        <div className="mb-3">
          <p className="text-sm text-olive-400 dark:text-sage-500 italic">
            No results yet
          </p>
        </div>
      )}

      <ProgressBar
        value={completionPercent}
        color={seat.leadingCandidate?.partyColor}
        size="sm"
        className="mb-2"
      />

      <div className="flex items-center justify-between text-xs text-olive-500 dark:text-sage-400">
        <span>
          {seat.reportedCentreCount} of {seat.totalCentres} centres
        </span>
        {seat.leadingCandidate && (
          <span className="font-medium">
            {formatNumber(seat.leadingCandidate.totalVotes)} votes
          </span>
        )}
      </div>
    </Card>
  )
}

export default function SeatBrowserPage() {
  const navigate = useNavigate()
  const { seats, pagination, isLoading } = useSeats()
  const {
    divisionId,
    districtId,
    seatStatus,
    searchQuery,
    setDivision,
    setDistrict,
    setSeatStatus,
    setSearchQuery,
    setPage,
    resetFilters,
  } = useFilterStore()

  const [localSearch, setLocalSearch] = useState(searchQuery)
  const debounceTimer = useRef(null)

  const divisions = getDivisions()
  const districts = divisionId ? getDistricts(divisionId) : []

  const divisionOptions = [
    { value: '', label: 'All Divisions' },
    ...divisions.map((d) => ({ value: d.id, label: d.name })),
  ]

  const districtOptions = [
    { value: '', label: 'All Districts' },
    ...districts.map((d) => ({ value: d.id, label: d.name })),
  ]

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value
      setLocalSearch(value)

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      debounceTimer.current = setTimeout(() => {
        setSearchQuery(value)
      }, 300)
    },
    [setSearchQuery]
  )

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  function handleDivisionChange(e) {
    const value = e.target.value || null
    setDivision(value)
  }

  function handleDistrictChange(e) {
    const value = e.target.value || null
    setDistrict(value)
  }

  function handleStatusChange(e) {
    const value = e.target.value || null
    setSeatStatus(value)
  }

  function handleReset() {
    resetFilters()
    setLocalSearch('')
  }

  function handleSeatClick(seatId) {
    navigate(`/seats/${seatId}`)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-olive-500 dark:text-sage-400" />
          <h2 className="font-display font-semibold text-olive-900 dark:text-sage-100">
            Search & Filter
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input
            placeholder="Search seats..."
            leftIcon={Search}
            value={localSearch}
            onChange={handleSearchChange}
          />

          <Select
            options={divisionOptions}
            value={divisionId || ''}
            onChange={handleDivisionChange}
          />

          <Select
            options={districtOptions}
            value={districtId || ''}
            onChange={handleDistrictChange}
            disabled={!divisionId}
          />

          <Select
            options={STATUS_OPTIONS}
            value={seatStatus || ''}
            onChange={handleStatusChange}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="self-end"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Results count */}
      <p className="text-sm text-olive-600 dark:text-sage-300">
        <span className="font-semibold">{pagination.total}</span> seats found
      </p>

      {/* Seat Cards Grid */}
      {isLoading && seats.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SeatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seats.map((seat) => (
            <SeatCard
              key={seat.id}
              seat={seat}
              onClick={() => handleSeatClick(seat.id)}
            />
          ))}
        </div>
      )}

      {seats.length === 0 && !isLoading && (
        <div className="text-center py-12 text-olive-500 dark:text-sage-400">
          <p className="text-lg font-display">No seats found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="pt-2">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
