// ---------------------------------------------------------------------------
// Seat definitions, dominance map, and completion tiers for 151 constituencies
// ---------------------------------------------------------------------------
// Compact format: [districtId, seatBaseName, divisionId, ...dominantPartyPerSeat]
// Each party entry becomes one seat; the party is who dominates that seat.
// ---------------------------------------------------------------------------

const BNP = 'party-2'
const JI  = 'party-4'
const NCP = 'party-1'
const JP  = 'party-3'
const JSD = 'party-5'
const WP  = 'party-6'
const BTF = 'party-7'
const GF  = 'party-8'

// prettier-ignore
const DISTRICT_SEAT_DATA = [
  // ── Dhaka Division (38 seats) ──────────────────────────────────────────
  ['dist-1',  'Dhaka',        'div-1', NCP, NCP, NCP, NCP, NCP, BNP, BNP, JI],   // 8 → NCP
  ['dist-2',  'Gazipur',      'div-1', BNP, BNP, BNP, JI],                       // 4 → BNP
  ['dist-3',  'Narayanganj',  'div-1', BNP, BNP, JI],                            // 3 → BNP
  ['dist-4',  'Tangail',      'div-1', BNP, BNP, JP],                            // 3 → BNP
  ['dist-5',  'Kishoreganj',  'div-1', JI, JI, BNP],                             // 3 → JI
  ['dist-6',  'Manikganj',    'div-1', NCP, NCP],                                // 2 → NCP
  ['dist-7',  'Munshiganj',   'div-1', BNP, BNP],                                // 2 → BNP
  ['dist-8',  'Narsingdi',    'div-1', NCP, NCP],                                // 2 → NCP
  ['dist-9',  'Faridpur',     'div-1', JP, JP, BNP],                             // 3 → JP
  ['dist-10', 'Gopalganj',    'div-1', NCP, NCP],                                // 2 → NCP
  ['dist-11', 'Madaripur',    'div-1', JP, JP],                                  // 2 → JP
  ['dist-12', 'Rajbari',      'div-1', BNP, BNP],                                // 2 → BNP
  ['dist-13', 'Shariatpur',   'div-1', JI, JI],                                  // 2 → JI

  // ── Chittagong Division (28 seats) ─────────────────────────────────────
  ['dist-14', 'Chittagong',   'div-2', BNP, BNP, BNP, BNP, JI, WP],             // 6 → BNP
  ['dist-15', 'Comilla',      'div-2', BNP, BNP, BNP, JI],                       // 4 → BNP
  ['dist-16', "Cox's Bazar",  'div-2', JI, JI],                                  // 2 → JI
  ['dist-17', 'Feni',         'div-2', JI, JI],                                  // 2 → JI
  ['dist-18', 'Noakhali',     'div-2', JI, JI, BNP],                             // 3 → JI
  ['dist-19', 'Lakshmipur',   'div-2', BNP, BNP],                                // 2 → BNP
  ['dist-20', 'Brahamanbaria','div-2', JI, JI, BNP],                             // 3 → JI
  ['dist-21', 'Chandpur',     'div-2', BNP, BNP, JI],                            // 3 → BNP
  ['dist-22', 'Khagrachhari', 'div-2', BNP],                                     // 1 → BNP
  ['dist-23', 'Rangamati',    'div-2', JP],                                       // 1 → JP
  ['dist-24', 'Bandarban',    'div-2', BTF],                                      // 1 → BTF

  // ── Rajshahi Division (20 seats) ───────────────────────────────────────
  ['dist-25', 'Rajshahi',     'div-3', BNP, BNP, NCP],                           // 3 → BNP
  ['dist-26', 'Bogra',        'div-3', BNP, BNP, JI],                            // 3 → BNP
  ['dist-27', 'Pabna',        'div-3', BNP, BNP, NCP],                           // 3 → BNP
  ['dist-28', 'Natore',       'div-3', JP, JP],                                  // 2 → JP
  ['dist-29', 'Nawabganj',    'div-3', JI, JI],                                  // 2 → JI
  ['dist-30', 'Naogaon',      'div-3', BNP, BNP, WP],                            // 3 → BNP
  ['dist-31', 'Joypurhat',    'div-3', JSD],                                     // 1 → JSD
  ['dist-32', 'Sirajganj',    'div-3', BNP, BNP, JI],                            // 3 → BNP

  // ── Khulna Division (19 seats) ─────────────────────────────────────────
  ['dist-33', 'Khulna',       'div-4', BNP, BNP, JI],                            // 3 → BNP
  ['dist-34', 'Jessore',      'div-4', BNP, BNP, NCP],                           // 3 → BNP
  ['dist-35', 'Satkhira',     'div-4', JI, JI],                                  // 2 → JI
  ['dist-36', 'Narail',       'div-4', NCP],                                     // 1 → NCP
  ['dist-37', 'Kushtia',      'div-4', BNP, BNP, JI],                            // 3 → BNP
  ['dist-38', 'Meherpur',     'div-4', NCP],                                     // 1 → NCP
  ['dist-39', 'Chuadanga',    'div-4', BNP],                                     // 1 → BNP
  ['dist-40', 'Jhenaidah',    'div-4', JP, JP],                                  // 2 → JP
  ['dist-41', 'Magura',       'div-4', JP],                                      // 1 → JP
  ['dist-42', 'Bagerhat',     'div-4', GF, GF],                                  // 2 → GF

  // ── Barisal Division (10 seats) ────────────────────────────────────────
  ['dist-43', 'Barisal',      'div-5', JP, JP, BNP],                             // 3 → JP
  ['dist-44', 'Patuakhali',   'div-5', BNP, BNP],                                // 2 → BNP
  ['dist-45', 'Bhola',        'div-5', JI, JI],                                  // 2 → JI
  ['dist-46', 'Pirojpur',     'div-5', BNP],                                     // 1 → BNP
  ['dist-47', 'Jhalokati',    'div-5', JP],                                      // 1 → JP
  ['dist-48', 'Barguna',      'div-5', WP],                                      // 1 → WP

  // ── Sylhet Division (9 seats) ──────────────────────────────────────────
  ['dist-49', 'Sylhet',       'div-6', JI, JI, BNP],                             // 3 → JI
  ['dist-50', 'Maulvibazar',  'div-6', JI, JI],                                  // 2 → JI
  ['dist-51', 'Habiganj',     'div-6', JI, JI],                                  // 2 → JI
  ['dist-52', 'Sunamganj',    'div-6', BNP, BNP],                                // 2 → BNP

  // ── Rangpur Division (16 seats) ────────────────────────────────────────
  ['dist-53', 'Rangpur',      'div-7', BNP, BNP, NCP],                           // 3 → BNP
  ['dist-54', 'Dinajpur',     'div-7', BNP, BNP, JI],                            // 3 → BNP
  ['dist-55', 'Gaibandha',    'div-7', NCP, NCP],                                // 2 → NCP
  ['dist-56', 'Kurigram',     'div-7', NCP, NCP],                                // 2 → NCP
  ['dist-57', 'Lalmonirhat',  'div-7', BNP, BNP],                                // 2 → BNP
  ['dist-58', 'Nilphamari',   'div-7', NCP, NCP],                                // 2 → NCP
  ['dist-59', 'Thakurgaon',   'div-7', GF],                                      // 1 → GF
  ['dist-60', 'Panchagarh',   'div-7', WP],                                      // 1 → WP

  // ── Mymensingh Division (11 seats) ─────────────────────────────────────
  ['dist-61', 'Mymensingh',   'div-8', BNP, BNP, JI, WP],                        // 4 → BNP
  ['dist-62', 'Jamalpur',     'div-8', BNP, BNP, JP],                            // 3 → BNP
  ['dist-63', 'Netrakona',    'div-8', NCP, NCP],                                // 2 → NCP
  ['dist-64', 'Sherpur',      'div-8', BNP, BNP],                                // 2 → BNP
]

// ---- Expand compact data into SEAT_DEFS and SEAT_DOMINANCE ----------------

export const SEAT_DEFS = []
export const SEAT_DOMINANCE = []

for (const row of DISTRICT_SEAT_DATA) {
  const [districtId, baseName, divisionId, ...partyIds] = row
  for (let i = 0; i < partyIds.length; i++) {
    SEAT_DEFS.push({
      name: `${baseName}-${i + 1}`,
      seatNumber: i + 1,
      divisionId,
      districtId,
    })
    SEAT_DOMINANCE.push(partyIds[i])
  }
}

// ---- Rival party mapping --------------------------------------------------

export function getRivalParty(dominantPartyId) {
  switch (dominantPartyId) {
    case BNP: return JI   // BNP  → rival JI
    case JI:  return BNP  // JI   → rival BNP
    case NCP: return BNP  // NCP  → rival BNP
    case JP:  return BNP  // JP   → rival BNP
    default:  return BNP  // everyone else → rival BNP
  }
}

// ---- Completion tiers (determines initial reporting progress) --------------
// ~30% completed, ~20% high-partial, ~10% medium-partial, ~40% not started
// Shuffled deterministically in buildAllData().

export const COMPLETION_TIERS = (() => {
  const tiers = []
  for (let i = 0; i < 45; i++) tiers.push(1.0)   // completed
  for (let i = 0; i < 15; i++) tiers.push(0.8)    // high partial
  for (let i = 0; i < 15; i++) tiers.push(0.7)
  for (let i = 0; i < 8; i++)  tiers.push(0.6)    // medium partial
  for (let i = 0; i < 7; i++)  tiers.push(0.4)
  const remaining = SEAT_DEFS.length - tiers.length
  for (let i = 0; i < remaining; i++) tiers.push(0.0) // not started
  return tiers
})()
