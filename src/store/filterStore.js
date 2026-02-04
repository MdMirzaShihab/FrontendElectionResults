import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_FILTERS = {
  divisionId: null,
  districtId: null,
  seatStatus: null,
  searchQuery: '',
  page: 1,
  sortBy: 'seatNumber',
  sortOrder: 'asc',
}

export const useFilterStore = create(
  persist(
    (set) => ({
      ...DEFAULT_FILTERS,

      setDivision: (divisionId) =>
        set({ divisionId, districtId: null, page: 1 }),

      setDistrict: (districtId) =>
        set({ districtId, page: 1 }),

      setSeatStatus: (seatStatus) =>
        set({ seatStatus, page: 1 }),

      setSearchQuery: (searchQuery) =>
        set({ searchQuery, page: 1 }),

      setPage: (page) =>
        set({ page }),

      resetFilters: () =>
        set({ ...DEFAULT_FILTERS }),
    }),
    {
      name: 'election-filters',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) =>
          sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) =>
          sessionStorage.removeItem(name),
      },
    }
  )
)
