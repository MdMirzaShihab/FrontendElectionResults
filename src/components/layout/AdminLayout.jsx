import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu, LogOut, Home } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { useUIStore } from '@store/uiStore'
import { useAuthStore } from '@store/authStore'

export default function AdminLayout() {
  const { setSidebarOpen } = useUIStore()
  const { admin, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen bg-sage-50 dark:bg-sage-950">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 glass border-b border-sage-200 dark:border-sage-800">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-olive-600 hover:bg-sage-100 dark:text-olive-300 dark:hover:bg-sage-900 transition-colors"
              >
                <Menu size={20} />
              </button>
              <h2 className="font-display font-semibold text-olive-900 dark:text-sage-100 text-sm sm:text-base">
                Admin Panel
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="p-2 rounded-lg text-olive-500 hover:text-olive-700 hover:bg-sage-100 dark:text-olive-400 dark:hover:text-sage-100 dark:hover:bg-sage-900 transition-colors"
                title="View public site"
              >
                <Home size={18} />
              </Link>

              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-olive-600 dark:text-olive-300">{admin?.name || 'Admin'}</span>
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-200 dark:border-green-800">
                  {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-olive-500 hover:text-red-600 hover:bg-red-50 dark:text-olive-400 dark:hover:text-red-400 dark:hover:bg-red-950 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
