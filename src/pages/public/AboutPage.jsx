import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'
import { Badge } from '@components/common/Badge'
import { Info, Building2 } from 'lucide-react'

const TECH_STACK = ['React', 'Tailwind CSS', 'Zustand', 'Recharts', 'Vite']

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-olive-900 dark:text-sage-50 mb-3">
          Bangladesh Election Results Tracker
        </h1>
        <p className="text-lg text-olive-600 dark:text-sage-300 max-w-2xl mx-auto">
          Real-time election results tracking and analysis platform
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                <Info size={16} />
              </div>
              <CardTitle className="text-base">About This Platform</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-olive-600 dark:text-sage-300 leading-relaxed">
              This platform provides comprehensive tracking of Bangladesh
              parliamentary election results. It covers all 300 constituencies
              with real-time vote counting, party standings, seat-by-seat
              breakdowns, and interactive visualizations to help citizens stay
              informed about election outcomes.
            </p>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="animate-slide-up animate-delay-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sage-200 dark:bg-sage-800 text-sage-600 dark:text-sage-300">
                <Building2 size={16} />
              </div>
              <CardTitle className="text-base">Data Sources</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-olive-600 dark:text-sage-300 leading-relaxed">
              This demo uses simulated data for presentation purposes. In
              production, data would be sourced from the Election Commission of
              Bangladesh, providing officially verified vote counts and results
              directly from polling centres across the country.
            </p>
          </CardContent>
        </Card>

        {/* Technology */}
        <Card className="animate-slide-up animate-delay-200">
          <CardHeader>
            <CardTitle className="text-base">Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-olive-600 dark:text-sage-300 mb-4">
              Built with a modern, performant web stack designed for real-time
              data updates and responsive design.
            </p>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <Badge key={tech} variant="primary" size="md">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card
        className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 animate-slide-up animate-delay-300"
      >
        <div className="flex gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-red-800 dark:text-red-300 mb-1">
              Important Notice
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
              This is a demonstration application. All data shown is simulated
              and does not represent actual election results. This platform is
              intended solely for showcasing the capabilities of the tracking
              system and should not be used as a source of real election
              information.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
