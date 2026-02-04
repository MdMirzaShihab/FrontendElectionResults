import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMapData } from '@hooks/useMapData'
import { useDistrictMapData } from '@hooks/useDistrictMapData'
import { getDivisions } from '@data/mockData'
import { formatNumber, formatPercent } from '@utils/formatters'
import { cn } from '@utils/cn'
import { Card } from '@components/common/Card'
import { Select } from '@components/common/Select'
import { Skeleton } from '@components/common/Skeleton'
import { LastUpdatedIndicator } from '@components/common/LastUpdatedIndicator'
import { DistrictSVGMap } from '@components/map/DistrictSVGMap'
import { DistrictTooltip } from '@components/map/DistrictTooltip'

// Geographic layout: rough 2D arrangement of Bangladesh divisions
// Rows represent north-to-south; columns represent west-to-east
const DIVISION_LAYOUT = [
  ['div-7', 'div-8', 'div-6'],   // North: Rangpur, Mymensingh, Sylhet
  ['div-3', 'div-1', 'div-2'],   // Mid: Rajshahi, Dhaka, Chittagong
  ['div-4', 'div-5', null],      // South: Khulna, Barisal
]

function SeatTooltip({ seat, position }) {
  if (!seat) return null

  return (
    <div
      className="fixed z-50 pointer-events-none animate-fade-in"
      style={{
        left: position.x + 12,
        top: position.y - 8,
      }}
    >
      <Card
        variant="elevated"
        padding="sm"
        className="min-w-[180px] shadow-soft-lg"
      >
        <p className="font-display font-semibold text-sm text-olive-900 dark:text-sage-100 mb-1">
          {seat.name}
        </p>
        <div className="space-y-1 text-xs text-olive-600 dark:text-sage-300">
          <p>
            <span className="text-olive-400 dark:text-sage-500">
              Leading:{' '}
            </span>
            {seat.leadingPartyName}
          </p>
          <p>
            <span className="text-olive-400 dark:text-sage-500">Votes: </span>
            {formatNumber(seat.totalVotes)}
          </p>
          <p>
            <span className="text-olive-400 dark:text-sage-500">
              Completed:{' '}
            </span>
            {formatPercent(seat.completionPercent, 0)}
          </p>
        </div>
      </Card>
    </div>
  )
}

function SeatCell({ seat, index, onHover, onLeave, onClick }) {
  const handleMouseEnter = useCallback(
    (e) => {
      onHover(seat, { x: e.clientX, y: e.clientY })
    },
    [seat, onHover]
  )

  const isNoData = !seat.leadingPartyId || seat.totalVotes === 0
  const bgColor = isNoData ? '#D1D5DB' : seat.leadingPartyColor

  return (
    <button
      onClick={() => onClick(seat.seatId)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      className={cn(
        'w-12 h-12 sm:w-14 sm:h-14 rounded-lg transition-all duration-300 cursor-pointer',
        'hover:scale-110 hover:shadow-soft-lg hover:z-10',
        'focus:outline-none focus:ring-2 focus:ring-green-500/50',
        'animate-scale-in'
      )}
      style={{
        backgroundColor: bgColor,
        animationDelay: `${index * 20}ms`,
        opacity: isNoData ? 0.5 : 0.85 + (seat.completionPercent / 100) * 0.15,
      }}
      title={seat.name}
      aria-label={`${seat.name} - ${seat.leadingPartyName}`}
    >
      <span className="text-white/90 text-[10px] font-semibold drop-shadow-sm">
        {seat.seatNumber}
      </span>
    </button>
  )
}

function DivisionGroup({
  divisionName,
  seats,
  startIndex,
  onHover,
  onLeave,
  onClick,
}) {
  if (seats.length === 0) return null

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-display text-xs font-semibold text-olive-500 dark:text-sage-400 mb-2 uppercase tracking-wider">
        {divisionName}
      </h3>
      <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px]">
        {seats.map((seat, i) => (
          <SeatCell
            key={seat.seatId}
            seat={seat}
            index={startIndex + i}
            onHover={onHover}
            onLeave={onLeave}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  )
}

export default function MapPage() {
  const navigate = useNavigate()
  const { mapData, lastUpdated, isLoading } = useMapData()
  const [filterDivision, setFilterDivision] = useState('')
  const [hoveredSeat, setHoveredSeat] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // District map state
  const [selectedDistrictId, setSelectedDistrictId] = useState(null)
  const [hoveredDistrict, setHoveredDistrict] = useState(null)
  const [districtTooltipPos, setDistrictTooltipPos] = useState({ x: 0, y: 0 })

  const districtData = useDistrictMapData(mapData)

  const [isDark, setIsDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const divisions = getDivisions()

  const divisionOptions = [
    { value: '', label: 'All Divisions' },
    ...divisions.map((d) => ({ value: d.id, label: d.name })),
  ]

  const filteredData = useMemo(() => {
    if (!mapData) return []
    let data = mapData
    if (filterDivision) {
      data = data.filter((s) => s.divisionId === filterDivision)
    }
    if (selectedDistrictId) {
      data = data.filter((s) => s.districtId === selectedDistrictId)
    }
    return data
  }, [mapData, filterDivision, selectedDistrictId])

  const seatsByDivision = useMemo(() => {
    const map = {}
    for (const seat of filteredData) {
      if (!map[seat.divisionId]) {
        map[seat.divisionId] = []
      }
      map[seat.divisionId].push(seat)
    }
    return map
  }, [filteredData])

  const partyLegend = useMemo(() => {
    if (!mapData || mapData.length === 0) return []

    const seen = new Map()
    for (const seat of mapData) {
      if (seat.leadingPartyId && !seen.has(seat.leadingPartyId)) {
        seen.set(seat.leadingPartyId, {
          id: seat.leadingPartyId,
          name: seat.leadingPartyName,
          color: seat.leadingPartyColor,
        })
      }
    }
    return Array.from(seen.values())
  }, [mapData])

  const divisionNameMap = useMemo(() => {
    const map = {}
    for (const d of divisions) {
      map[d.id] = d.name
    }
    return map
  }, [divisions])

  // Seat tooltip handlers
  function handleHover(seat, position) {
    setHoveredSeat(seat)
    setTooltipPos(position)
  }

  function handleLeave() {
    setHoveredSeat(null)
  }

  function handleClick(seatId) {
    navigate(`/seats/${seatId}`)
  }

  // District map handlers
  const handleDistrictClick = useCallback((districtId) => {
    setSelectedDistrictId((prev) => (prev === districtId ? null : districtId))
  }, [])

  const handleDistrictHover = useCallback((district, position) => {
    setHoveredDistrict(district)
    setDistrictTooltipPos(position)
  }, [])

  const handleDistrictLeave = useCallback(() => {
    setHoveredDistrict(null)
  }, [])

  if (isLoading && mapData.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    )
  }

  // Find selected district name for the filter indicator
  const selectedDistrictName = selectedDistrictId
    ? districtData.find((d) => d.districtId === selectedDistrictId)?.name
    : null

  let globalIndex = 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-olive-900 dark:text-sage-50">
          Constituency Map
        </h1>
        <div className="w-full sm:w-48">
          <Select
            options={divisionOptions}
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* Party Legend */}
      <div className="flex flex-wrap gap-3">
        {partyLegend.map((party) => (
          <div key={party.id} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: party.color }}
            />
            <span className="text-olive-600 dark:text-sage-300">
              {party.name}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-3 h-3 rounded-full shrink-0 bg-gray-300" />
          <span className="text-olive-600 dark:text-sage-300">No Data</span>
        </div>
      </div>

      {/* Dual-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: District SVG Map */}
        <Card padding="lg" className="overflow-hidden">
          <h2 className="font-display text-sm font-semibold text-olive-700 dark:text-sage-200 mb-4 uppercase tracking-wider">
            District Map
          </h2>
          <DistrictSVGMap
            districtData={districtData}
            selectedDistrictId={selectedDistrictId}
            onDistrictClick={handleDistrictClick}
            onDistrictHover={handleDistrictHover}
            onDistrictLeave={handleDistrictLeave}
            isDark={isDark}
          />
        </Card>

        {/* Right Panel: Constituency Grid */}
        <Card padding="lg" className="overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-semibold text-olive-700 dark:text-sage-200 uppercase tracking-wider">
              Constituency Grid
            </h2>
            {selectedDistrictName && (
              <button
                onClick={() => setSelectedDistrictId(null)}
                className="text-xs text-green-600 dark:text-green-400 hover:underline"
              >
                Showing {selectedDistrictName} &mdash; Clear filter
              </button>
            )}
          </div>

          {filterDivision ? (
            // Single division view
            <div className="flex justify-center py-8">
              <DivisionGroup
                divisionName={divisionNameMap[filterDivision] || ''}
                seats={seatsByDivision[filterDivision] || []}
                startIndex={0}
                onHover={handleHover}
                onLeave={handleLeave}
                onClick={handleClick}
              />
            </div>
          ) : (
            // Geographic layout
            <div className="flex flex-col items-center gap-8 py-6">
              {DIVISION_LAYOUT.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-start justify-center gap-6 sm:gap-10 flex-wrap"
                >
                  {row.map((divId) => {
                    if (!divId) return null

                    const divSeats = seatsByDivision[divId] || []
                    const currentStartIndex = globalIndex
                    globalIndex += divSeats.length

                    return (
                      <DivisionGroup
                        key={divId}
                        divisionName={divisionNameMap[divId] || ''}
                        seats={divSeats}
                        startIndex={currentStartIndex}
                        onHover={handleHover}
                        onLeave={handleLeave}
                        onClick={handleClick}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Tooltips */}
      <SeatTooltip seat={hoveredSeat} position={tooltipPos} />
      <DistrictTooltip district={hoveredDistrict} position={districtTooltipPos} />

      {/* Last Updated */}
      <div className="flex justify-center pt-2">
        <LastUpdatedIndicator lastUpdated={lastUpdated} />
      </div>
    </div>
  )
}
