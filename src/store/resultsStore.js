import { create } from 'zustand'
import {
  getOverview,
  getSeats,
  getSeatDetail,
  getSeatCentres,
  getParties,
  getMapData,
  getAdminDashboard,
} from '@data/mockData'

function randomDelay() {
  const ms = 300 + Math.floor(Math.random() * 200)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const useResultsStore = create((set) => ({
  overview: null,
  adminDashboard: null,
  seats: [],
  seatsPagination: { page: 1, totalPages: 1, total: 0 },
  seatDetail: null,
  seatCentres: null,
  parties: [],
  mapData: [],
  lastUpdated: null,
  isLoading: false,
  error: null,

  setOverview: (overview) => set({ overview }),
  setSeats: (seats) => set({ seats }),
  setSeatsPagination: (seatsPagination) => set({ seatsPagination }),
  setSeatDetail: (seatDetail) => set({ seatDetail }),
  setSeatCentres: (seatCentres) => set({ seatCentres }),
  setParties: (parties) => set({ parties }),
  setMapData: (mapData) => set({ mapData }),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchOverview: async () => {
    set({ isLoading: true, error: null })
    try {
      await randomDelay()
      const overview = getOverview()
      set({ overview, lastUpdated: new Date(), isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchSeats: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      await randomDelay()
      const result = getSeats(filters)
      set({
        seats: result.seats,
        seatsPagination: {
          page: result.page,
          totalPages: result.totalPages,
          total: result.total,
        },
        lastUpdated: new Date(),
        isLoading: false,
      })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchSeatDetail: async (seatId) => {
    set({ isLoading: true, error: null })
    try {
      await randomDelay()
      const seatDetail = getSeatDetail(seatId)
      set({ seatDetail, lastUpdated: new Date(), isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchSeatCentres: async (seatId) => {
    set({ isLoading: true, error: null })
    try {
      await randomDelay()
      const seatCentres = getSeatCentres(seatId)
      set({ seatCentres, lastUpdated: new Date(), isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchParties: async () => {
    set({ isLoading: true, error: null })
    try {
      await randomDelay()
      const parties = getParties()
      set({ parties, lastUpdated: new Date(), isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchMapData: async () => {
    set({ isLoading: true, error: null })
    try {
      await randomDelay()
      const mapData = getMapData()
      set({ mapData, lastUpdated: new Date(), isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchAdminDashboard: async () => {
    set({ isLoading: true, error: null })
    try {
      await randomDelay()
      const adminDashboard = getAdminDashboard()
      set({ adminDashboard, lastUpdated: new Date(), isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))
