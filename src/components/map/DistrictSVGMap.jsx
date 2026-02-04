import { useCallback, useMemo, useState, useEffect } from 'react'
import { geoMercator, geoPath } from 'd3-geo'

const GEO_URL = '/bangladesh-districts.geojson'

const WIDTH = 400
const HEIGHT = 550

// Reverse coordinate winding order so d3-geo spherical projection
// correctly interprets polygon interiors (RFC 7946 uses CCW exteriors,
// but d3-geo expects CW exteriors for its right-hand rule).
function rewindFeature(feature) {
  const geom = feature.geometry
  const reverseRings = (rings) => rings.map((ring) => ring.slice().reverse())
  if (geom.type === 'Polygon') {
    return { ...feature, geometry: { ...geom, coordinates: reverseRings(geom.coordinates) } }
  }
  if (geom.type === 'MultiPolygon') {
    return {
      ...feature,
      geometry: { ...geom, coordinates: geom.coordinates.map(reverseRings) },
    }
  }
  return feature
}

export function DistrictSVGMap({
  districtData,
  selectedDistrictId,
  onDistrictClick,
  onDistrictHover,
  onDistrictLeave,
  isDark,
}) {
  const [geoData, setGeoData] = useState(null)

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((data) => ({
        ...data,
        features: data.features.map(rewindFeature),
      }))
      .then(setGeoData)
  }, [])

  const districtByName = useMemo(() => {
    const map = {}
    for (const d of districtData) {
      map[d.name] = d
    }
    return map
  }, [districtData])

  // Build projection fitted to the GeoJSON data
  const { projection, pathGenerator } = useMemo(() => {
    if (!geoData) return {}
    const proj = geoMercator().fitSize([WIDTH, HEIGHT], geoData)
    const gen = geoPath().projection(proj)
    return { projection: proj, pathGenerator: gen }
  }, [geoData])

  const strokeColor = isDark ? '#5a6e5a' : '#8a9a8a'
  const noDataFill = isDark ? '#475b47' : '#b0bdb0'

  const handleMouseMove = useCallback(
    (e, data) => {
      if (data) {
        onDistrictHover(data, { x: e.clientX, y: e.clientY })
      }
    },
    [onDistrictHover]
  )

  if (!geoData || !pathGenerator) {
    return (
      <div className="flex items-center justify-center" style={{ height: 400 }}>
        <div className="animate-pulse-slow text-olive-400 dark:text-sage-500 text-sm">
          Loading map...
        </div>
      </div>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      role="img"
      aria-label="District map of Bangladesh"
    >
      {geoData.features.map((feature, index) => {
        const geoName = feature.properties.ADM2_EN
        const data = districtByName[geoName]
        const hasData = data && data.leadingPartyId
        const isSelected = data && selectedDistrictId === data.districtId
        const isDimmed =
          selectedDistrictId &&
          (!data || selectedDistrictId !== data.districtId)

        const fill = hasData ? data.leadingPartyColor : noDataFill

        const d = pathGenerator(feature)
        if (!d) return null

        return (
          <path
            key={`district-${index}`}
            d={d}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={isSelected ? 3 : 1}
            opacity={isDimmed ? 0.35 : 1}
            cursor={data ? 'pointer' : 'default'}
            style={{
              transition: 'opacity 0.3s ease, fill 0.3s ease',
            }}
            onMouseMove={data ? (e) => handleMouseMove(e, data) : undefined}
            onMouseLeave={data ? onDistrictLeave : undefined}
            onClick={
              data
                ? () => onDistrictClick(data.districtId)
                : undefined
            }
          />
        )
      })}
    </svg>
  )
}
