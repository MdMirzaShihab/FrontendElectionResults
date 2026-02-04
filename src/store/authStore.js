import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      admin: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, _password) => {
        set({ isLoading: true, error: null })

        await new Promise((resolve) => setTimeout(resolve, 500))

        set({ isLoading: false, error: null })

        return { otpRequired: true, email }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null })

        if (String(otp).length !== 6) {
          set({ isLoading: false, error: 'OTP must be 6 digits' })
          return false
        }

        await new Promise((resolve) => setTimeout(resolve, 500))

        const role = email === 'superadmin@demo.com' ? 'super_admin' : 'admin'
        const name = email === 'superadmin@demo.com' ? 'Super Admin' : 'Admin User'

        set({
          isAuthenticated: true,
          admin: { name, email, role },
          token: `demo-token-${Date.now()}`,
          isLoading: false,
          error: null,
        })

        return true
      },

      logout: () => {
        set({
          isAuthenticated: false,
          admin: null,
          token: null,
          isLoading: false,
          error: null,
        })
      },

      isSuperAdmin: () => get().admin?.role === 'super_admin',

      clearError: () => set({ error: null }),
    }),
    {
      name: 'election-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
        token: state.token,
      }),
    }
  )
)
