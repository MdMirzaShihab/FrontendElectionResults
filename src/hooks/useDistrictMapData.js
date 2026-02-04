import { useMemo } from 'react'
import { getDistricts } from '@data/mockData'

export function useDistrictMapData(mapData) {
  return useMemo(() => {
    if (!mapData || mapData.length === 0) return []

    const districts = getDistricts()

    return districts.map((district) => {
      const seats = mapData.filter((s) => s.districtId === district.id)
      const totalVotes = seats.reduce((sum, s) => sum + s.totalVotes, 0)
      const completionPercent =
        seats.length > 0
          ? Math.round(
              seats.reduce((sum, s) => sum + s.completionPercent, 0) /
                seats.length
            )
          : 0

      // Count seats leading per party
      const partySeats = {}
      const partyVotes = {}
      for (const seat of seats) {
        if (!seat.leadingPartyId) continue
        partySeats[seat.leadingPartyId] = (partySeats[seat.leadingPartyId] || 0) + 1
        partyVotes[seat.leadingPartyId] = (partyVotes[seat.leadingPartyId] || 0) + seat.totalVotes
      }

      // District winner = party with most seats; tiebreak by total votes
      let leadingPartyId = null
      let maxSeats = 0
      let maxVotes = 0
      for (const [partyId, count] of Object.entries(partySeats)) {
        const votes = partyVotes[partyId] || 0
        if (count > maxSeats || (count === maxSeats && votes > maxVotes)) {
          maxSeats = count
          maxVotes = votes
          leadingPartyId = partyId
        }
      }

      // Get leading party info from any matching seat
      const leadingSeat = leadingPartyId
        ? seats.find((s) => s.leadingPartyId === leadingPartyId)
        : null

      // Build seat breakdown string: "Party A × 3, Party B × 1"
      const breakdownParts = Object.entries(partySeats)
        .sort((a, b) => b[1] - a[1])
        .map(([partyId, count]) => {
          const seat = seats.find((s) => s.leadingPartyId === partyId)
          return `${seat?.leadingPartyName || partyId} × ${count}`
        })

      return {
        districtId: district.id,
        name: district.name,
        divisionId: district.divisionId,
        leadingPartyId,
        leadingPartyColor: leadingSeat?.leadingPartyColor || '#CCCCCC',
        leadingPartyName: leadingSeat?.leadingPartyName || 'None',
        seatCount: seats.length,
        totalVotes,
        completionPercent,
        seatBreakdown: breakdownParts.join(', '),
        seats,
      }
    })
  }, [mapData])
}
