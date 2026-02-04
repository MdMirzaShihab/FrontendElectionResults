import { useState, useMemo, useCallback } from 'react'
import { cn } from '@utils/cn'
import MapTooltip from './MapTooltip'

const DIVISION_LAYOUT = [
  // Row 1
  [
    { divisionId: 'div-7', name: 'Rangpur' },
    { divisionId: 'div-8', name: 'Mymensingh' },
  ],
  // Row 2
  [
    { divisionId: 'div-3', name: 'Rajshahi' },
    { divisionId: 'div-1', name: 'Dhaka' },
    { divisionId: 'div-6', name: 'Sylhet' },
  ],
  // Row 3
  [
    { divisionId: 'div-4', name: 'Khulna' },
    { divisionId: 'div-5', name: 'Barisal' },
    { divisionId: 'div-2', name: 'Chittagong' },
  ],
]

function BangladeshMap({ seatData, onSeatClick, selectedDivision }) {
  const [hoveredSeat, setHoveredSeat] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const seatsByDivision = useMemo(() => {
    if (!seatData) return {}

    const grouped = {}
    for (const seat of seatData) {
      if (!grouped[seat.divisionId]) {
        grouped[seat.divisionId] = []
      }
      grouped[seat.divisionId].push(seat)
    }
    return grouped
  }, [seatData])

  const handleMouseEnter = useCallback((seat, event) => {
    setHoveredSeat(seat)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }, [])

  const handleMouseMove = useCallback((event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredSeat(null)
  }, [])

  const handleSeatClick = useCallback(
    (seatId) => {
      if (onSeatClick) {
        onSeatClick(seatId)
      }
    },
    [onSeatClick]
  )

  let seatIndex = 0

  return (
    <div className="flex flex-col items-center gap-6">
      {DIVISION_LAYOUT.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {row.map((division) => {
            const seats = seatsByDivision[division.divisionId] || []
            const isDimmed =
              selectedDivision && selectedDivision !== division.divisionId

            return (
              <div
                key={division.divisionId}
                className={cn(
                  'flex flex-col items-center transition-opacity duration-300',
                  isDimmed && 'opacity-30'
                )}
              >
                <p className="font-display font-semibold text-sm text-olive-600 dark:text-olive-300 mb-2">
                  {division.name}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px]">
                  {seats.map((seat) => {
                    const cellDelay = seatIndex * 30
                    seatIndex++

                    const opacity = seat.completionPercent > 0
                      ? Math.max(0.4, seat.completionPercent / 100)
                      : 0.4

                    const bgColor = seat.totalVotes > 0
                      ? seat.leadingPartyColor
                      : '#D1D5DB'

                    return (
                      <button
                        key={seat.seatId}
                        type="button"
                        onClick={() => handleSeatClick(seat.seatId)}
                        onMouseEnter={(e) => handleMouseEnter(seat, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                          'w-14 h-14 sm:w-16 sm:h-16 rounded-xl',
                          'flex items-center justify-center',
                          'cursor-pointer select-none',
                          'transition-all duration-200',
                          'hover:scale-105 hover:shadow-soft-lg',
                          'animate-scale-in'
                        )}
                        style={{
                          backgroundColor: bgColor,
                          opacity,
                          animationDelay: `${cellDelay}ms`,
                        }}
                      >
                        <span className="text-white font-bold text-xs drop-shadow-sm">
                          {seat.seatNumber}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ))}

      <MapTooltip
        seat={hoveredSeat}
        position={tooltipPosition}
        visible={hoveredSeat !== null}
      />
    </div>
  )
}

BangladeshMap.displayName = 'BangladeshMap'

export default BangladeshMap
