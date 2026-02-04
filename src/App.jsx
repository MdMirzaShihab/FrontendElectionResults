import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PublicLayout from '@components/layout/PublicLayout'
import AdminLayout from '@components/layout/AdminLayout'
import ProtectedRoute from '@/router/ProtectedRoute'
import GuestRoute from '@/router/GuestRoute'
import { Spinner } from '@components/common/Spinner'
import ToastContainer from '@components/common/Toast'

const OverviewPage = lazy(() => import('@pages/public/OverviewPage'))
const SeatBrowserPage = lazy(() => import('@pages/public/SeatBrowserPage'))
const SeatDetailPage = lazy(() => import('@pages/public/SeatDetailPage'))
const PartySummaryPage = lazy(() => import('@pages/public/PartySummaryPage'))
const MapPage = lazy(() => import('@pages/public/MapPage'))
const AboutPage = lazy(() => import('@pages/public/AboutPage'))

const AdminLoginPage = lazy(() => import('@pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@pages/admin/AdminDashboardPage'))
const DataEntryPage = lazy(() => import('@pages/admin/DataEntryPage'))
const AuditLogPage = lazy(() => import('@pages/admin/AuditLogPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="seats" element={<SeatBrowserPage />} />
            <Route path="seats/:seatId" element={<SeatDetailPage />} />
            <Route path="parties" element={<PartySummaryPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          <Route element={<GuestRoute />}>
            <Route path="admin/login" element={<AdminLoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="admin/data-entry" element={<DataEntryPage />} />
              <Route path="admin/audit-logs" element={<AuditLogPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  )
}
