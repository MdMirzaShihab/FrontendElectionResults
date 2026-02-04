function PartyColorLegend({ parties }) {
  if (!parties || parties.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {parties.map((party) => (
        <div key={party.abbreviation} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: party.color }}
          />
          <span className="text-xs text-olive-600 dark:text-olive-300">
            {party.abbreviation}
          </span>
        </div>
      ))}
    </div>
  )
}

PartyColorLegend.displayName = 'PartyColorLegend'

export default PartyColorLegend
