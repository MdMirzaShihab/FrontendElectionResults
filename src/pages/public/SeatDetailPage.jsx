import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSeatDetail } from '@hooks/useSeatDetail'
import { formatNumber, formatPercent } from '@utils/formatters'
import { cn } from '@utils/cn'
import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'
import { Badge } from '@components/common/Badge'
import { ProgressBar } from '@components/common/ProgressBar'
import { Skeleton } from '@components/common/Skeleton'
import { Trophy, ChevronRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react'

function CentreAccordion({ centre, candidates }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-sage-200 dark:border-sage-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-left',
          'hover:bg-sage-50 dark:hover:bg-sage-900/50 transition-colors duration-200'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-medium text-sm text-olive-800 dark:text-sage-200 truncate">
            {centre.name}
          </span>
          <Badge
            size="sm"
            variant={centre.isReported ? 'success' : 'default'}
          >
            {centre.isReported ? 'Reported' : 'Pending'}
          </Badge>
        </div>
        {isOpen ? (
          <ChevronUp
            size={16}
            className="shrink-0 text-olive-400 dark:text-sage-500"
          />
        ) : (
          <ChevronDown
            size={16}
            className="shrink-0 text-olive-400 dark:text-sage-500"
          />
        )}
      </button>

      {isOpen && centre.isReported && centre.results.length > 0 && (
        <div className="border-t border-sage-200 dark:border-sage-800 px-4 py-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-olive-500 dark:text-sage-400 text-xs">
                <th className="text-left pb-2 font-medium">Candidate</th>
                <th className="text-left pb-2 font-medium">Party</th>
                <th className="text-right pb-2 font-medium">Votes</th>
              </tr>
            </thead>
            <tbody>
              {[...centre.results]
                .sort((a, b) => b.votes - a.votes)
                .map((result) => {
                  const candidate = candidates?.find(
                    (c) => c.id === result.candidateId
                  )

                  return (
                    <tr
                      key={result.candidateId}
                      className="border-t border-sage-100 dark:border-sage-800/50"
                    >
                      <td className="py-2 text-olive-800 dark:text-sage-200">
                        {result.candidateName}
                      </td>
                      <td className="py-2">
                        <Badge size="sm" color={result.partyColor}>
                          {result.partyAbbreviation}
                        </Badge>
                      </td>
                      <td className="py-2 text-right font-medium text-olive-800 dark:text-sage-200">
                        {formatNumber(result.votes)}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && !centre.isReported && (
        <div className="border-t border-sage-200 dark:border-sage-800 px-4 py-4 text-sm text-olive-400 dark:text-sage-500 italic text-center">
          Results not yet reported for this centre
        </div>
      )}
    </div>
  )
}

function SeatDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-48 rounded-md" />
      <Skeleton className="h-10 w-72 rounded-md" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full rounded-full" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  )
}

export default function SeatDetailPage() {
  const { seatId } = useParams()
  const { seatDetail, seatCentres, isLoading } = useSeatDetail(seatId)

  if (isLoading && !seatDetail) {
    return <SeatDetailSkeleton />
  }

  if (!seatDetail) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-display text-olive-600 dark:text-sage-300">
          Seat not found
        </p>
        <Link
          to="/seats"
          className="text-green-600 dark:text-green-400 text-sm hover:underline mt-2 inline-block"
        >
          Back to seats
        </Link>
      </div>
    )
  }

  const completionPercent =
    seatDetail.totalCentres > 0
      ? Math.round(
          (seatDetail.reportedCentreCount / seatDetail.totalCentres) * 100
        )
      : 0

  const winner =
    seatDetail.status === 'completed' && seatDetail.candidates.length > 0
      ? seatDetail.candidates[0]
      : null

  const leadingColor = seatDetail.candidates[0]?.partyColor

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-olive-500 dark:text-sage-400">
        <Link
          to="/"
          className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          Home
        </Link>
        <ChevronRight size={14} />
        <Link
          to="/seats"
          className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          Seats
        </Link>
        <ChevronRight size={14} />
        <span className="text-olive-800 dark:text-sage-200 font-medium">
          {seatDetail.name}
        </span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-display text-3xl font-bold text-olive-900 dark:text-sage-50">
            {seatDetail.name}
          </h1>
          <Badge variant="primary">#{seatDetail.seatNumber}</Badge>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="info" size="sm">
            <MapPin size={12} className="mr-0.5" />
            {seatDetail.divisionName}
          </Badge>
          <Badge variant="info" size="sm">
            {seatDetail.districtName}
          </Badge>
        </div>

        {/* Progress */}
        <div className="max-w-xl">
          <ProgressBar
            value={completionPercent}
            color={leadingColor}
            size="lg"
            className="mb-2"
          />
          <p className="text-sm text-olive-600 dark:text-sage-300">
            {seatDetail.reportedCentreCount} of {seatDetail.totalCentres}{' '}
            centres reported ({completionPercent}%)
          </p>
        </div>
      </div>

      {/* Winner Card */}
      {winner && (
        <Card
          className="border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30 shadow-[0_0_20px_-4px_rgba(0,105,85,0.15)]"
          padding="lg"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide mb-0.5">
                Winner
              </p>
              <p className="font-display text-xl font-bold text-olive-900 dark:text-sage-50">
                {winner.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge size="sm" color={winner.partyColor}>
                  {winner.partyAbbreviation}
                </Badge>
                <span className="text-sm text-olive-600 dark:text-sage-300">
                  {formatNumber(winner.totalVotes)} votes (
                  {formatPercent(winner.votePercent)})
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Candidate Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-olive-500 dark:text-sage-400 text-xs border-b border-sage-200 dark:border-sage-800">
                  <th className="text-left pb-3 font-medium w-8">#</th>
                  <th className="text-left pb-3 font-medium">Candidate</th>
                  <th className="text-left pb-3 font-medium">Party</th>
                  <th className="text-right pb-3 font-medium">Votes</th>
                  <th className="text-right pb-3 font-medium">Share</th>
                  <th className="text-left pb-3 font-medium pl-4 hidden md:table-cell w-40">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody>
                {seatDetail.candidates.map((candidate, index) => {
                  const isLeading = index === 0

                  return (
                    <tr
                      key={candidate.id}
                      className={cn(
                        'border-b border-sage-100 dark:border-sage-800/50 last:border-0',
                        isLeading &&
                          'bg-green-50/50 dark:bg-green-950/20'
                      )}
                    >
                      <td className="py-3 text-olive-500 dark:text-sage-400 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 font-medium text-olive-800 dark:text-sage-200">
                        {candidate.name}
                      </td>
                      <td className="py-3">
                        <Badge size="sm" color={candidate.partyColor}>
                          {candidate.partyAbbreviation}
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-medium text-olive-800 dark:text-sage-200">
                        {formatNumber(candidate.totalVotes)}
                      </td>
                      <td className="py-3 text-right text-olive-600 dark:text-sage-300">
                        {formatPercent(candidate.votePercent)}
                      </td>
                      <td className="py-3 pl-4 hidden md:table-cell">
                        <div className="w-full bg-sage-200 dark:bg-sage-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${candidate.votePercent}%`,
                              backgroundColor: candidate.partyColor,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Centre-by-Centre Breakdown */}
      {seatCentres && seatCentres.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold text-olive-900 dark:text-sage-100 mb-4">
            Centre-by-Centre Breakdown
          </h2>
          <div className="space-y-2">
            {seatCentres.map((centre) => (
              <CentreAccordion
                key={centre.id}
                centre={centre}
                candidates={seatDetail.candidates}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
