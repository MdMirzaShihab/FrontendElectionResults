import { Outlet } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'
import PublicHeader from './PublicHeader'
import PublicFooter from './PublicFooter'
import { useUIStore } from '@store/uiStore'

export default function PublicLayout() {
  const { simulationEnabled, toggleSimulation } = useUIStore()

  return (
    <div className="page-ambient">
      <PublicHeader />
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-12rem)]">
        <Outlet />
      </main>
      <PublicFooter />

      <button
        onClick={toggleSimulation}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          simulationEnabled
            ? 'bg-green-500 text-white shadow-glow-green hover:bg-green-600'
            : 'bg-sage-200 text-olive-600 hover:bg-sage-300 dark:bg-sage-800 dark:text-olive-300 dark:hover:bg-sage-700'
        }`}
        title={simulationEnabled ? 'Pause live simulation' : 'Start live simulation'}
      >
        {simulationEnabled ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  )
}
