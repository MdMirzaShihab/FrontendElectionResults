import { useEffect, useRef } from 'react'
import { useUIStore } from '@store/uiStore'
import { simulateTick } from '@data/mockData'

export function useSimulation(onTick) {
  const simulationEnabled = useUIStore((s) => s.simulationEnabled)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!simulationEnabled) {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      const updates = simulateTick()
      if (updates.length > 0 && onTick) {
        onTick(updates)
      }
    }, 30000)

    return () => clearInterval(intervalRef.current)
  }, [simulationEnabled, onTick])
}
