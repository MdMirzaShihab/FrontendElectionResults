import { useState, useEffect, useMemo } from 'react'
import { ChevronRight, Check, Save, AlertCircle, Building2 } from 'lucide-react'
import { getSeats, getSeatDetail, getSeatCentres } from '@data/mockData'
import { useUIStore } from '@store/uiStore'
import { Button } from '@components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'
import { Select } from '@components/common/Select'
import { Badge } from '@components/common/Badge'
import { ProgressBar } from '@components/common/ProgressBar'
import { ConfirmModal } from '@components/common/Modal'
import { Spinner } from '@components/common/Spinner'
import { formatNumber } from '@utils/formatters'
import { cn } from '@utils/cn'

function StepIndicator({ currentStep }) {
  const steps = [
    { key: 1, label: 'Select Seat' },
    { key: 2, label: 'Select Centre' },
    { key: 3, label: 'Enter Votes' },
  ]

  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, index) => {
        const isActive = s.key === currentStep
        const isCompleted = s.key < currentStep

        return (
          <div key={s.key} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight size={14} className="text-olive-300 dark:text-sage-600" />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                isActive && 'text-green-600 dark:text-green-400',
                isCompleted && 'text-olive-500 dark:text-sage-400',
                !isActive && !isCompleted && 'text-olive-300 dark:text-sage-600'
              )}
            >
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function DataEntryPage() {
  const { showSuccess } = useUIStore()

  const [selectedSeatId, setSelectedSeatId] = useState('')
  const [seatDetail, setSeatDetail] = useState(null)
  const [seatCentres, setSeatCentres] = useState([])
  const [selectedCentre, setSelectedCentre] = useState(null)
  const [votes, setVotes] = useState({})
  const [isLoadingSeat, setIsLoadingSeat] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [reportedCentreIds, setReportedCentreIds] = useState(new Set())

  const allSeats = useMemo(() => {
    return getSeats({ page: 1, limit: 100 }).seats
  }, [])

  const seatOptions = useMemo(() => {
    return allSeats.map((seat) => {
      const completionPercent = seat.totalCentres > 0
        ? Math.round((seat.reportedCentreCount / seat.totalCentres) * 100)
        : 0

      return {
        value: seat.id,
        label: `${seat.seatNumber}. ${seat.name} — ${completionPercent}% reported`,
      }
    })
  }, [allSeats])

  useEffect(() => {
    if (!selectedSeatId) return

    setIsLoadingSeat(true)
    setSeatDetail(null)
    setSeatCentres([])
    setSelectedCentre(null)
    setVotes({})

    const detail = getSeatDetail(selectedSeatId)
    const centres = getSeatCentres(selectedSeatId)

    setSeatDetail(detail)
    setSeatCentres(centres)
    setIsLoadingSeat(false)
  }, [selectedSeatId])

  function handleCentreSelect(centre) {
    setSelectedCentre(centre)

    const initialVotes = {}
    if (seatDetail?.candidates) {
      for (const candidate of seatDetail.candidates) {
        const existingResult = centre.results.find(
          (r) => r.candidateId === candidate.id
        )
        initialVotes[candidate.id] = existingResult ? existingResult.votes : 0
      }
    }
    setVotes(initialVotes)
  }

  function handleVoteChange(candidateId, value) {
    const numValue = Math.max(0, parseInt(value, 10) || 0)
    setVotes((prev) => ({ ...prev, [candidateId]: numValue }))
  }

  const totalVotes = useMemo(() => {
    return Object.values(votes).reduce((sum, v) => sum + v, 0)
  }, [votes])

  const isOverLimit = selectedCentre && totalVotes > selectedCentre.registeredVoters

  function handleSave() {
    setShowConfirm(true)
  }

  function handleConfirmSave() {
    setShowConfirm(false)
    setReportedCentreIds((prev) => new Set([...prev, selectedCentre.id]))
    showSuccess(`Results saved successfully for ${selectedCentre.name}`)
    setSelectedCentre(null)
    setVotes({})
  }

  function getCurrentStep() {
    if (selectedCentre) return 3
    if (selectedSeatId && seatDetail) return 2
    return 1
  }

  const currentStep = getCurrentStep()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-olive-900 dark:text-sage-100">
          Data Entry
        </h1>
      </div>

      <StepIndicator currentStep={currentStep} />

      {/* Step 1: Seat selection */}
      <Card variant="default" padding="md">
        <CardHeader>
          <CardTitle className="text-base">Select Constituency</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            placeholder="Choose a seat..."
            options={seatOptions}
            value={selectedSeatId}
            onChange={(e) => setSelectedSeatId(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Loading indicator */}
      {isLoadingSeat && (
        <div className="flex items-center justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}

      {/* Step 2: Centre selection */}
      {currentStep >= 2 && seatDetail && !selectedCentre && (
        <Card variant="default" padding="none">
          <CardHeader className="px-5 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{seatDetail.name}</CardTitle>
                <p className="text-sm text-olive-500 dark:text-sage-400 mt-0.5">
                  Seat #{seatDetail.seatNumber} &middot; {seatDetail.divisionName}
                </p>
              </div>
              <Badge
                variant={seatDetail.status === 'completed' ? 'success' : 'default'}
                size="sm"
              >
                {seatDetail.reportedCentreCount}/{seatDetail.totalCentres} centres
              </Badge>
            </div>
            <ProgressBar
              value={seatDetail.reportedCentreCount}
              max={seatDetail.totalCentres}
              size="sm"
              className="mt-3"
            />
          </CardHeader>

          <CardContent>
            <div className="divide-y divide-sage-100 dark:divide-sage-800">
              {seatCentres.map((centre) => {
                const isReported = centre.isReported || reportedCentreIds.has(centre.id)

                return (
                  <button
                    key={centre.id}
                    onClick={() => !isReported && handleCentreSelect(centre)}
                    disabled={isReported}
                    className={cn(
                      'w-full flex items-center justify-between px-5 py-3 text-left transition-colors',
                      isReported
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:bg-sage-50 dark:hover:bg-sage-900 cursor-pointer'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          isReported
                            ? 'bg-green-50 dark:bg-green-950'
                            : 'bg-sage-100 dark:bg-sage-800'
                        )}
                      >
                        {isReported ? (
                          <Check size={14} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <Building2 size={14} className="text-olive-400 dark:text-sage-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-olive-800 dark:text-sage-200">
                          {centre.name}
                        </p>
                        <p className="text-xs text-olive-400 dark:text-sage-500">
                          {formatNumber(centre.registeredVoters)} registered voters
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={isReported ? 'success' : 'default'}
                      size="sm"
                      dot
                    >
                      {isReported ? 'Reported' : 'Pending'}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Vote entry */}
      {currentStep === 3 && selectedCentre && seatDetail && (
        <Card variant="default" padding="none">
          <CardHeader className="px-5 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Enter Results</CardTitle>
                <p className="text-sm text-olive-500 dark:text-sage-400 mt-0.5">
                  {selectedCentre.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCentre(null)
                  setVotes({})
                }}
              >
                Back
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              {seatDetail.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center gap-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-olive-800 dark:text-sage-200 truncate">
                      {candidate.name}
                    </p>
                    <Badge
                      size="sm"
                      color={candidate.partyColor}
                      className="mt-0.5"
                    >
                      {candidate.partyAbbreviation}
                    </Badge>
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={votes[candidate.id] || 0}
                    onChange={(e) => handleVoteChange(candidate.id, e.target.value)}
                    className={cn(
                      'w-28 px-3 py-2 text-sm text-right rounded-xl',
                      'bg-sage-50 border border-sage-200 text-olive-800',
                      'focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500',
                      'dark:bg-sage-900 dark:border-sage-700 dark:text-sage-100',
                      'dark:focus:border-green-400 dark:focus:ring-green-400/50'
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Total and validation */}
            <div
              className={cn(
                'mt-4 pt-4 border-t border-sage-200 dark:border-sage-800',
                'flex items-center justify-between'
              )}
            >
              <div>
                <span className="text-sm font-medium text-olive-700 dark:text-sage-300">
                  Total Votes: {formatNumber(totalVotes)}
                </span>
                <span className="text-xs text-olive-400 dark:text-sage-500 ml-2">
                  / {formatNumber(selectedCentre.registeredVoters)} registered
                </span>
              </div>

              {isOverLimit && (
                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle size={12} />
                  <span>Exceeds registered voters</span>
                </div>
              )}
            </div>

            <Button
              fullWidth
              className="mt-4"
              leftIcon={Save}
              onClick={handleSave}
              disabled={totalVotes === 0 || isOverLimit}
            >
              Save Results
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Submission"
        message={`Confirm submission of results for ${selectedCentre?.name}? Total votes: ${formatNumber(totalVotes)}.`}
        confirmText="Submit Results"
        cancelText="Cancel"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}
