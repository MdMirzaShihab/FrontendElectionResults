import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Vote } from 'lucide-react'
import { cn } from '@utils/cn'
import { useUIStore } from '@store/uiStore'

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { demoBannerVisible, dismissDemoBanner } = useUIStore()

  const navLinks = [
    { to: '/', label: 'Overview', end: true },
    { to: '/seats', label: 'Seats' },
    { to: '/parties', label: 'Parties' },
    { to: '/map', label: 'Map' },
    { to: '/about', label: 'About' },
  ]

  const linkClass = ({ isActive }) =>
    cn(
      'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
        : 'text-olive-600 hover:text-olive-900 hover:bg-sage-100 dark:text-olive-300 dark:hover:text-sage-100 dark:hover:bg-sage-900'
    )

  return (
    <>
      {demoBannerVisible && (
        <div className="bg-accent-100 dark:bg-accent-950 border-b border-accent-200 dark:border-accent-900 px-4 py-1.5 text-center text-xs font-medium text-accent-800 dark:text-accent-300 relative">
          DEMO — Presentation Mode — Data is simulated
          <button
            onClick={dismissDemoBanner}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-600 hover:text-accent-800 dark:text-accent-400"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <header className="sticky top-0 z-40 glass">
        <div className="h-0.5 bg-gradient-to-r from-green-500 via-accent-500 to-red-500" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <Vote size={18} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-olive-900 dark:text-sage-100 leading-none">
                  Election Results
                </span>
                <span className="block text-[10px] text-olive-500 dark:text-olive-400 leading-none mt-0.5">
                  Bangladesh 2024
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/login"
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium rounded-lg border border-sage-300 dark:border-sage-700 text-olive-600 dark:text-olive-300 hover:bg-sage-100 dark:hover:bg-sage-900 transition-colors"
              >
                Admin
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-olive-600 hover:bg-sage-100 dark:text-olive-300 dark:hover:bg-sage-900 transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-950 animate-slide-down">
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileOpen(false)}
                  className={linkClass}
                >
                  <span className="block py-1">{link.label}</span>
                </NavLink>
              ))}
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-olive-600 dark:text-olive-300 hover:bg-sage-100 dark:hover:bg-sage-900"
              >
                Admin Panel
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
