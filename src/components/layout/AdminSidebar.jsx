import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PenLine, FileSearch, X, Vote } from 'lucide-react'
import { cn } from '@utils/cn'
import { useUIStore } from '@store/uiStore'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/data-entry', label: 'Data Entry', icon: PenLine },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileSearch },
]

export default function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-green-50 text-green-700 border-l-3 border-green-500 dark:bg-green-950 dark:text-green-300'
        : 'text-olive-600 hover:text-olive-900 hover:bg-sage-100 dark:text-olive-400 dark:hover:text-sage-100 dark:hover:bg-sage-900'
    )

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sage-200 dark:border-sage-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <Vote size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-olive-900 dark:text-sage-100">Admin</span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto lg:hidden p-1 rounded text-olive-400 hover:text-olive-600 dark:hover:text-sage-300"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-sage-950 border-r border-sage-200 dark:border-sage-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
