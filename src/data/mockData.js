// ---------------------------------------------------------------------------
// Bangladesh Election Results — Central Mock Data Module
// ---------------------------------------------------------------------------
// This file IS the backend for the demo frontend. All data arrays are mutable
// (declared with `let`) so the simulation engine can update them in place.
// Every public symbol is a named export — no default export.
// ---------------------------------------------------------------------------

import { divisions as _divisions, districts as _districts } from './geodata'
import {
  SEAT_DEFS,
  SEAT_DOMINANCE,
  COMPLETION_TIERS,
  getRivalParty,
} from './seatConfig'

// ---- Deterministic seeded random (keeps results stable across page reloads
//      until simulateTick mutates state) ------------------------------------

let _seed = 42

function seededRandom() {
  _seed = (_seed * 16807 + 0) % 2147483647
  return (_seed - 1) / 2147483646
}

function randomInt(min, max) {
  return Math.floor(seededRandom() * (max - min + 1)) + min
}

function pickRandom(arr) {
  return arr[Math.floor(seededRandom() * arr.length)]
}

// ---- Divisions & Districts (re-export from geodata) -----------------------

export let divisions = [..._divisions]
export let districts = [..._districts]

// ---- Parties --------------------------------------------------------------

export let parties = [
  { id: 'party-1', name: 'National Citizen Party', abbreviation: 'NCP', color: '#006A4E' },
  { id: 'party-2', name: 'Bangladesh Nationalist Party', abbreviation: 'BNP', color: '#E8112D' },
  { id: 'party-3', name: 'Jatiya Party', abbreviation: 'JP', color: '#FFD700' },
  { id: 'party-4', name: 'Jamaat-e-Islami', abbreviation: 'JI', color: '#008000' },
  { id: 'party-5', name: 'Jatiya Samajtantrik Dal', abbreviation: 'JSD', color: '#FF6347' },
  { id: 'party-6', name: 'Workers Party', abbreviation: 'WP', color: '#CC0000' },
  { id: 'party-7', name: 'Bangladesh Tarikat Federation', abbreviation: 'BTF', color: '#4169E1' },
  { id: 'party-8', name: 'Gono Forum', abbreviation: 'GF', color: '#800080' },
  { id: 'party-9', name: 'Nagorik Oikya', abbreviation: 'NO', color: '#2F4F4F' },
  { id: 'party-10', name: 'Independent', abbreviation: 'IND', color: '#808080' },
]

// ---- Helper: party lookup map ---------------------------------------------

function buildPartyMap() {
  const map = {}
  for (const p of parties) {
    map[p.id] = p
  }
  return map
}

let partyMap = buildPartyMap()

// ---- Candidate name pools -------------------------------------------------

const FIRST_NAMES = [
  'Abdul', 'Mohammad', 'Md.', 'Shah', 'Kazi', 'Syed', 'Anwar',
  'Rafiq', 'Kamal', 'Fazlul', 'Nurul', 'Mizanur', 'Shamsul',
  'Jahangir', 'Tariqul', 'Hasanul', 'Obaidul', 'Salahuddin',
  'Amirul', 'Habibur', 'Matiur', 'Lutfur', 'Shahjahan', 'Iqbal',
  'Ataur', 'Mosharraf', 'Delwar', 'Ziaur', 'Selim', 'Faruk',
]

const LAST_NAMES = [
  'Rahman', 'Ahmed', 'Islam', 'Hossain', 'Khan', 'Chowdhury',
  'Alam', 'Uddin', 'Miah', 'Bhuiyan', 'Sarkar', 'Siddique',
  'Talukder', 'Kabir', 'Haque', 'Karim', 'Mallik', 'Mondal',
  'Biswas', 'Akter', 'Begum', 'Khatun', 'Sultana', 'Jahan',
]

const FEMALE_FIRST = [
  'Hasina', 'Khaleda', 'Rawshan', 'Sayeda', 'Fatema', 'Nasrin',
  'Tahmina', 'Shamima', 'Kohinoor', 'Jahanara', 'Salma', 'Rehana',
  'Anjuman', 'Parveen', 'Kamrun', 'Farida', 'Bilkis', 'Shahida',
]

const FEMALE_LAST = [
  'Begum', 'Khatun', 'Sultana', 'Jahan', 'Akter', 'Chowdhury',
  'Ahmed', 'Islam', 'Rahman', 'Hossain',
]

// Named / notable candidates for prominent seats
const NOTABLE_CANDIDATES = [
  { name: 'Nahid Islam', partyId: 'party-1', seatHint: 'seat-1' },
  { name: 'Khaleda Zia', partyId: 'party-2', seatHint: 'seat-2' },
  { name: 'Dr. Kamal Hossain', partyId: 'party-8', seatHint: 'seat-3' },
  { name: 'Hasnat Abdullah', partyId: 'party-1', seatHint: 'seat-4' },
  { name: 'Mirza Fakhrul Islam Alamgir', partyId: 'party-2', seatHint: 'seat-6' },
  { name: 'GM Quader', partyId: 'party-3', seatHint: 'seat-10' },
  { name: 'Motiur Rahman Chowdhury', partyId: 'party-3', seatHint: 'seat-14' },
  { name: 'Hasanul Haq Inu', partyId: 'party-5', seatHint: 'seat-5' },
  { name: 'Rashed Khan Menon', partyId: 'party-6', seatHint: 'seat-9' },
  { name: 'Sarjis Alam', partyId: 'party-1', seatHint: 'seat-11' },
]

let _candidateId = 0
let _usedNames = new Set()

function generateCandidateName() {
  let attempts = 0
  while (attempts < 100) {
    const isFemale = seededRandom() < 0.2
    let name
    if (isFemale) {
      name = pickRandom(FEMALE_FIRST) + ' ' + pickRandom(FEMALE_LAST)
    } else {
      name = pickRandom(FIRST_NAMES) + ' ' + pickRandom(LAST_NAMES)
    }
    if (!_usedNames.has(name)) {
      _usedNames.add(name)
      return name
    }
    attempts++
  }
  // Fallback: append a suffix to guarantee uniqueness
  const base = pickRandom(FIRST_NAMES) + ' ' + pickRandom(LAST_NAMES)
  const unique = base + ' ' + (++_candidateId)
  _usedNames.add(unique)
  return unique
}

// ---- Centre name pools ----------------------------------------------------

const CENTRE_PREFIXES = [
  'Govt.', 'Model', 'Ideal', 'Central', 'City', 'National',
  'Jubilee', 'Peoples', 'Community', 'Municipal',
]

const CENTRE_TYPES = [
  'High School', 'Primary School', 'College', 'Madrasa',
  'Academy', 'Degree College', 'Girls School', 'School & College',
  'Collegiate School', 'Preparatory School',
]

let _centreId = 0

function generateCentreName(seatName, index) {
  const prefix = CENTRE_PREFIXES[index % CENTRE_PREFIXES.length]
  const type = CENTRE_TYPES[index % CENTRE_TYPES.length]
  return `${seatName} ${prefix} ${type}`
}

// ---- Build seats, candidates, centres -------------------------------------

export let seats = []
export let candidates = []
export let centres = []

function buildAllData() {
  _seed = 42
  _candidateId = 0
  _usedNames = new Set()

  seats = []
  candidates = []
  centres = []

  // Shuffle completion tiers deterministically
  const tiers = [...COMPLETION_TIERS]
  for (let i = tiers.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    const tmp = tiers[i]
    tiers[i] = tiers[j]
    tiers[j] = tmp
  }

  for (let si = 0; si < SEAT_DEFS.length; si++) {
    const def = SEAT_DEFS[si]
    const seatId = `seat-${si + 1}`
    const totalCentres = randomInt(4, 7)
    const completionFraction = tiers[si]
    const reportedCentreCount = Math.round(totalCentres * completionFraction)

    let status = 'not_started'
    if (reportedCentreCount === totalCentres) {
      status = 'completed'
    } else if (reportedCentreCount > 0) {
      status = 'in_progress'
    }

    const seat = {
      id: seatId,
      name: def.name,
      seatNumber: def.seatNumber,
      divisionId: def.divisionId,
      districtId: def.districtId,
      totalCentres,
      reportedCentreCount,
      status,
    }
    seats.push(seat)

    // ---- Candidates for this seat ----
    const candidateCount = randomInt(3, 6)

    // Use seat dominance to determine party ordering
    const dominantPartyId = SEAT_DOMINANCE[si] || 'party-2'
    const rivalPartyId = getRivalParty(dominantPartyId)

    // Dominant party at index 0, rival at index 1
    const seatPartyIds = [dominantPartyId, rivalPartyId]
    const remainingParties = parties
      .filter((p) => p.id !== dominantPartyId && p.id !== rivalPartyId)
      .map((p) => p.id)

    // Shuffle remaining parties
    for (let i = remainingParties.length - 1; i > 0; i--) {
      const j = randomInt(0, i)
      const tmp = remainingParties[i]
      remainingParties[i] = remainingParties[j]
      remainingParties[j] = tmp
    }

    for (let k = 0; k < candidateCount - 2 && k < remainingParties.length; k++) {
      seatPartyIds.push(remainingParties[k])
    }

    const seatCandidates = []
    for (let ci = 0; ci < candidateCount; ci++) {
      const cId = `cand-${si + 1}-${ci + 1}`
      const partyId = seatPartyIds[ci] || 'party-10'

      // Check for notable candidate
      const notable = NOTABLE_CANDIDATES.find(
        (n) => n.seatHint === seatId && n.partyId === partyId
      )
      const candidateName = notable ? notable.name : generateCandidateName()

      const candidate = {
        id: cId,
        name: candidateName,
        partyId,
        seatId,
        totalVotes: 0,
      }
      seatCandidates.push(candidate)
      candidates.push(candidate)
    }

    // ---- Centres for this seat ----
    for (let ci = 0; ci < totalCentres; ci++) {
      const centreId = `centre-${++_centreId}`
      const registeredVoters = randomInt(500, 3000)
      const isReported = ci < reportedCentreCount

      const centreResults = []
      if (isReported) {
        // Generate realistic vote distribution
        const turnout = randomInt(55, 80) / 100
        const totalVotesInCentre = Math.round(registeredVoters * turnout)
        let remaining = totalVotesInCentre

        for (let k = 0; k < seatCandidates.length; k++) {
          let votes
          if (k === 0) {
            // Leading candidate: 40-55%
            votes = Math.round(totalVotesInCentre * (randomInt(40, 55) / 100))
          } else if (k === 1) {
            // Second place: 25-35% of total
            votes = Math.round(totalVotesInCentre * (randomInt(25, 35) / 100))
          } else if (k === seatCandidates.length - 1) {
            // Last candidate gets whatever remains
            votes = Math.max(0, remaining)
          } else {
            // Minor candidates split the rest
            const minorShare = remaining / (seatCandidates.length - k)
            votes = Math.round(minorShare * (randomInt(30, 100) / 100))
          }
          votes = Math.min(votes, remaining)
          votes = Math.max(votes, 0)
          remaining -= votes

          centreResults.push({
            candidateId: seatCandidates[k].id,
            votes,
          })

          // Accumulate onto candidate total
          seatCandidates[k].totalVotes += votes
        }
      }

      const centre = {
        id: centreId,
        name: generateCentreName(def.name, ci),
        seatId,
        registeredVoters,
        isReported,
        results: centreResults,
      }
      centres.push(centre)
    }
  }
}

// Run initial build
buildAllData()

// ---- Mock admin users -----------------------------------------------------

export let mockAdmins = [
  {
    id: 'admin-1',
    email: 'admin@demo.com',
    name: 'Demo Admin',
    role: 'admin',
    passwordHash: 'demo123',
  },
  {
    id: 'admin-2',
    email: 'superadmin@demo.com',
    name: 'Super Admin',
    role: 'superadmin',
    passwordHash: 'super123',
  },
]

// ---- Audit log entries ----------------------------------------------------

const AUDIT_ACTIONS = [
  'CENTRE_RESULT_SUBMITTED',
  'CENTRE_RESULT_UPDATED',
  'SEAT_STATUS_CHANGED',
  'USER_LOGIN',
  'USER_LOGOUT',
  'DATA_EXPORT',
  'RESULT_VERIFIED',
  'RESULT_CORRECTION',
]

function generateAuditTimestamp(index) {
  // Spread entries over the last 8 hours
  const base = new Date('2026-02-04T08:00:00Z')
  const offsetMinutes = Math.floor((index / 50) * 480)
  return new Date(base.getTime() + offsetMinutes * 60000).toISOString()
}

export let auditLogs = []

function buildAuditLogs() {
  auditLogs = []
  const seatNames = SEAT_DEFS.map((d) => d.name)
  const totalSeats = SEAT_DEFS.length

  for (let i = 0; i < 50; i++) {
    const action = AUDIT_ACTIONS[i % AUDIT_ACTIONS.length]
    const admin = mockAdmins[i % 2]
    const seatName = seatNames[i % seatNames.length]
    let detail = ''

    if (action === 'CENTRE_RESULT_SUBMITTED') {
      detail = `Submitted results for centre ${i + 1} in ${seatName}`
    } else if (action === 'CENTRE_RESULT_UPDATED') {
      detail = `Updated vote counts for centre ${i + 1} in ${seatName}`
    } else if (action === 'SEAT_STATUS_CHANGED') {
      detail = `${seatName} status changed to in_progress`
    } else if (action === 'USER_LOGIN') {
      detail = `${admin.email} logged in`
    } else if (action === 'USER_LOGOUT') {
      detail = `${admin.email} logged out`
    } else if (action === 'DATA_EXPORT') {
      detail = `Exported results for ${seatName}`
    } else if (action === 'RESULT_VERIFIED') {
      detail = `Verified results for centre ${i + 1} in ${seatName}`
    } else if (action === 'RESULT_CORRECTION') {
      detail = `Corrected vote tally for centre ${i + 1} in ${seatName}`
    }

    auditLogs.push({
      id: `log-${i + 1}`,
      timestamp: generateAuditTimestamp(i),
      action,
      adminId: admin.id,
      adminEmail: admin.email,
      seatId: `seat-${(i % totalSeats) + 1}`,
      detail,
    })
  }
}

buildAuditLogs()

// ===========================================================================
//  Derived data functions (public API)
// ===========================================================================

// ---- getOverview ----------------------------------------------------------

export function getOverview() {
  let totalVotesCast = 0
  let seatsDeclared = 0
  let seatsReporting = 0
  const partyVotes = {}
  const partySeatsWon = {}
  const partySeatsLeading = {}

  for (const p of parties) {
    partyVotes[p.id] = 0
    partySeatsWon[p.id] = 0
    partySeatsLeading[p.id] = 0
  }

  for (const seat of seats) {
    if (seat.status === 'completed') {
      seatsDeclared++
    }
    if (seat.status !== 'not_started') {
      seatsReporting++
    }

    // Find candidates for this seat and their vote totals
    const seatCandidates = candidates
      .filter((c) => c.seatId === seat.id)
      .sort((a, b) => b.totalVotes - a.totalVotes)

    for (const c of seatCandidates) {
      totalVotesCast += c.totalVotes
      partyVotes[c.partyId] = (partyVotes[c.partyId] || 0) + c.totalVotes
    }

    if (seatCandidates.length > 0 && seatCandidates[0].totalVotes > 0) {
      const leadingPartyId = seatCandidates[0].partyId
      if (seat.status === 'completed') {
        partySeatsWon[leadingPartyId] = (partySeatsWon[leadingPartyId] || 0) + 1
      } else {
        partySeatsLeading[leadingPartyId] = (partySeatsLeading[leadingPartyId] || 0) + 1
      }
    }
  }

  // Estimate total registered voters across all centres
  let totalRegistered = 0
  for (const centre of centres) {
    totalRegistered += centre.registeredVoters
  }

  const turnoutPercent = totalRegistered > 0
    ? Math.round((totalVotesCast / totalRegistered) * 10000) / 100
    : 0

  const partyStandings = parties.map((p) => {
    const voteSharePercent = totalVotesCast > 0
      ? Math.round((partyVotes[p.id] / totalVotesCast) * 10000) / 100
      : 0

    return {
      partyId: p.id,
      name: p.name,
      abbreviation: p.abbreviation,
      color: p.color,
      totalVotes: partyVotes[p.id],
      seatsWon: partySeatsWon[p.id] || 0,
      seatsLeading: partySeatsLeading[p.id] || 0,
      voteSharePercent,
    }
  })

  partyStandings.sort((a, b) => b.totalVotes - a.totalVotes)

  return {
    totalVotesCast,
    seatsDeclared,
    seatsReporting,
    turnoutPercent,
    partyStandings,
  }
}

// ---- getSeats -------------------------------------------------------------

export function getSeats(filters = {}) {
  const {
    divisionId = null,
    districtId = null,
    status = null,
    searchQuery = '',
    page = 1,
    limit = 10,
  } = filters

  let filtered = [...seats]

  if (divisionId) {
    filtered = filtered.filter((s) => s.divisionId === divisionId)
  }
  if (districtId) {
    filtered = filtered.filter((s) => s.districtId === districtId)
  }
  if (status) {
    filtered = filtered.filter((s) => s.status === status)
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(q))
  }

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.max(1, Math.min(page, totalPages))
  const start = (safePage - 1) * limit
  const paged = filtered.slice(start, start + limit)

  // Enrich each seat with leading candidate info
  const enriched = paged.map((seat) => {
    const seatCandidates = candidates
      .filter((c) => c.seatId === seat.id)
      .sort((a, b) => b.totalVotes - a.totalVotes)

    const leader = seatCandidates[0] || null
    const leaderParty = leader ? partyMap[leader.partyId] : null

    return {
      ...seat,
      leadingCandidate: leader
        ? {
            name: leader.name,
            partyId: leader.partyId,
            partyName: leaderParty?.name || '',
            partyAbbreviation: leaderParty?.abbreviation || '',
            partyColor: leaderParty?.color || '#808080',
            totalVotes: leader.totalVotes,
          }
        : null,
      totalVotes: seatCandidates.reduce((sum, c) => sum + c.totalVotes, 0),
    }
  })

  return {
    seats: enriched,
    total,
    page: safePage,
    totalPages,
  }
}

// ---- getSeatDetail --------------------------------------------------------

export function getSeatDetail(seatId) {
  const seat = seats.find((s) => s.id === seatId)
  if (!seat) {
    return null
  }

  const seatCandidates = candidates
    .filter((c) => c.seatId === seatId)
    .sort((a, b) => b.totalVotes - a.totalVotes)

  const totalVotes = seatCandidates.reduce((sum, c) => sum + c.totalVotes, 0)

  const enrichedCandidates = seatCandidates.map((c) => {
    const party = partyMap[c.partyId]
    return {
      id: c.id,
      name: c.name,
      partyId: c.partyId,
      partyName: party?.name || 'Unknown',
      partyColor: party?.color || '#808080',
      partyAbbreviation: party?.abbreviation || '?',
      totalVotes: c.totalVotes,
      votePercent: totalVotes > 0
        ? Math.round((c.totalVotes / totalVotes) * 10000) / 100
        : 0,
    }
  })

  const division = divisions.find((d) => d.id === seat.divisionId)
  const district = districts.find((d) => d.id === seat.districtId)

  return {
    ...seat,
    divisionName: division?.name || '',
    districtName: district?.name || '',
    totalVotes,
    candidates: enrichedCandidates,
  }
}

// ---- getSeatCentres -------------------------------------------------------

export function getSeatCentres(seatId) {
  const seatCentres = centres.filter((c) => c.seatId === seatId)

  return seatCentres.map((centre) => {
    const enrichedResults = centre.results.map((r) => {
      const candidate = candidates.find((c) => c.id === r.candidateId)
      const party = candidate ? partyMap[candidate.partyId] : null

      return {
        candidateId: r.candidateId,
        candidateName: candidate?.name || 'Unknown',
        partyId: candidate?.partyId || '',
        partyAbbreviation: party?.abbreviation || '?',
        partyColor: party?.color || '#808080',
        votes: r.votes,
      }
    })

    return {
      id: centre.id,
      name: centre.name,
      registeredVoters: centre.registeredVoters,
      isReported: centre.isReported,
      results: enrichedResults,
    }
  })
}

// ---- getParties -----------------------------------------------------------

export function getParties() {
  const overview = getOverview()
  return overview.partyStandings
}

// ---- getMapData -----------------------------------------------------------

export function getMapData() {
  return seats.map((seat) => {
    const seatCandidates = candidates
      .filter((c) => c.seatId === seat.id)
      .sort((a, b) => b.totalVotes - a.totalVotes)

    const leader = seatCandidates[0] || null
    const leaderParty = leader ? partyMap[leader.partyId] : null
    const totalVotes = seatCandidates.reduce((sum, c) => sum + c.totalVotes, 0)

    const completionPercent = seat.totalCentres > 0
      ? Math.round((seat.reportedCentreCount / seat.totalCentres) * 100)
      : 0

    return {
      seatId: seat.id,
      name: seat.name,
      seatNumber: seat.seatNumber,
      divisionId: seat.divisionId,
      districtId: seat.districtId,
      leadingPartyId: leader?.partyId || null,
      leadingPartyColor: leaderParty?.color || '#CCCCCC',
      leadingPartyName: leaderParty?.name || 'None',
      completionPercent,
      totalVotes,
    }
  })
}

// ---- getDivisions ---------------------------------------------------------

export function getDivisions() {
  return [...divisions]
}

// ---- getDistricts ---------------------------------------------------------

export function getDistricts(divisionId) {
  if (!divisionId) {
    return [...districts]
  }
  return districts.filter((d) => d.divisionId === divisionId)
}

// ---- getAdminDashboard ----------------------------------------------------

export function getAdminDashboard() {
  const totalSeats = seats.length
  const seatsWithResults = seats.filter((s) => s.status !== 'not_started').length
  const totalCentres = centres.length
  const centresReported = centres.filter((c) => c.isReported).length

  const overallPercent = totalCentres > 0
    ? Math.round((centresReported / totalCentres) * 100)
    : 0

  // Division-level progress
  const divisionProgress = divisions.map((div) => {
    const divSeats = seats.filter((s) => s.divisionId === div.id)
    const divCentres = centres.filter((c) => {
      const seat = seats.find((s) => s.id === c.seatId)
      return seat && seat.divisionId === div.id
    })
    const divReported = divCentres.filter((c) => c.isReported).length

    return {
      divisionId: div.id,
      name: div.name,
      total: divCentres.length,
      reported: divReported,
      percent: divCentres.length > 0
        ? Math.round((divReported / divCentres.length) * 100)
        : 0,
    }
  })

  // Recent activity: last 10 audit log entries
  const recentActivity = auditLogs
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10)

  return {
    totalSeats,
    seatsWithResults,
    totalCentres,
    centresReported,
    overallPercent,
    divisionProgress,
    recentActivity,
  }
}

// ---- getAuditLogs ---------------------------------------------------------

export function getAuditLogs(filters = {}, page = 1, limit = 10) {
  const { action = null, adminId = null, seatId = null, searchQuery = '' } = filters

  let filtered = [...auditLogs]

  if (action) {
    filtered = filtered.filter((log) => log.action === action)
  }
  if (adminId) {
    filtered = filtered.filter((log) => log.adminId === adminId)
  }
  if (seatId) {
    filtered = filtered.filter((log) => log.seatId === seatId)
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (log) =>
        log.detail.toLowerCase().includes(q) ||
        log.adminEmail.toLowerCase().includes(q)
    )
  }

  // Sort newest first
  filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.max(1, Math.min(page, totalPages))
  const start = (safePage - 1) * limit
  const paged = filtered.slice(start, start + limit)

  return {
    logs: paged,
    total,
    page: safePage,
    totalPages,
  }
}

// ===========================================================================
//  Simulation engine
// ===========================================================================

export function simulateTick() {
  // Find all unreported centres
  const unreported = centres.filter((c) => !c.isReported)
  if (unreported.length === 0) {
    return []
  }

  // Pick 1-3 random unreported centres
  const pickCount = Math.min(
    unreported.length,
    Math.floor(Math.random() * 3) + 1
  )

  // Shuffle unreported using Math.random (live randomness for simulation)
  for (let i = unreported.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = unreported[i]
    unreported[i] = unreported[j]
    unreported[j] = tmp
  }

  const picked = unreported.slice(0, pickCount)
  const updates = []

  for (const centre of picked) {
    const seatCandidates = candidates.filter((c) => c.seatId === centre.seatId)
    const turnout = (Math.random() * 0.25 + 0.55) // 55-80%
    const totalVotesInCentre = Math.round(centre.registeredVoters * turnout)
    let remaining = totalVotesInCentre

    // Look up seat index to find dominant party
    const seatIdx = seats.findIndex((s) => s.id === centre.seatId)
    const dominantId = SEAT_DOMINANCE[seatIdx] || 'party-2'
    const rivalId = getRivalParty(dominantId)

    // Order candidates: dominant first, rival second, rest after
    const dominantCandidate = seatCandidates.find((c) => c.partyId === dominantId)
    const rivalCandidate = seatCandidates.find((c) => c.partyId === rivalId)
    const others = seatCandidates.filter((c) => c.partyId !== dominantId && c.partyId !== rivalId)
    const sortedCandidates = [
      dominantCandidate,
      rivalCandidate,
      ...others,
    ].filter(Boolean) // filter out undefined if party not present

    const centreResults = []

    for (let k = 0; k < sortedCandidates.length; k++) {
      let votes
      if (k === 0) {
        votes = Math.round(totalVotesInCentre * (Math.random() * 0.15 + 0.40))
      } else if (k === 1) {
        votes = Math.round(totalVotesInCentre * (Math.random() * 0.10 + 0.25))
      } else if (k === sortedCandidates.length - 1) {
        votes = Math.max(0, remaining)
      } else {
        const minorShare = remaining / (sortedCandidates.length - k)
        votes = Math.round(minorShare * (Math.random() * 0.7 + 0.3))
      }
      votes = Math.min(votes, remaining)
      votes = Math.max(votes, 0)
      remaining -= votes

      centreResults.push({
        candidateId: sortedCandidates[k].id,
        votes,
      })

      // Update the actual candidate object's totalVotes
      sortedCandidates[k].totalVotes += votes
    }

    // Mark centre as reported
    centre.isReported = true
    centre.results = centreResults

    // Update seat's reported count and status
    const seat = seats.find((s) => s.id === centre.seatId)
    if (seat) {
      seat.reportedCentreCount++
      if (seat.reportedCentreCount >= seat.totalCentres) {
        seat.status = 'completed'
      } else {
        seat.status = 'in_progress'
      }
    }

    // Add audit log entry
    const newLog = {
      id: `log-sim-${Date.now()}-${centre.id}`,
      timestamp: new Date().toISOString(),
      action: 'CENTRE_RESULT_SUBMITTED',
      adminId: 'admin-1',
      adminEmail: 'admin@demo.com',
      seatId: centre.seatId,
      detail: `Simulated results for ${centre.name} in ${seat?.name || centre.seatId}`,
    }
    auditLogs.push(newLog)

    updates.push({
      centreId: centre.id,
      centreName: centre.name,
      seatId: centre.seatId,
      seatName: seat?.name || '',
      totalVotesAdded: totalVotesInCentre,
      results: centreResults,
    })
  }

  return updates
}
