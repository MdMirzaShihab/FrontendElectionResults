import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      mobileMenuOpen: false,
      activeModal: null,
      modalData: null,
      toasts: [],
      simulationEnabled: true,
      demoBannerVisible: true,

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (sidebarOpen) =>
        set({ sidebarOpen }),

      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

      setMobileMenuOpen: (mobileMenuOpen) =>
        set({ mobileMenuOpen }),

      openModal: (activeModal, modalData = null) =>
        set({ activeModal, modalData }),

      closeModal: () =>
        set({ activeModal: null, modalData: null }),

      addToast: ({ type, message, duration = 5000 }) => {
        const id = Date.now()
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }],
        }))
        setTimeout(() => {
          get().removeToast(id)
        }, duration)
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

      showSuccess: (message) =>
        get().addToast({ type: 'success', message }),

      showError: (message) =>
        get().addToast({ type: 'error', message }),

      showWarning: (message) =>
        get().addToast({ type: 'warning', message }),

      toggleSimulation: () =>
        set((state) => ({
          simulationEnabled: !state.simulationEnabled,
        })),

      dismissDemoBanner: () =>
        set({ demoBannerVisible: false }),
    }),
    {
      name: 'election-ui',
      partialize: (state) => ({
        simulationEnabled: state.simulationEnabled,
      }),
    }
  )
)
