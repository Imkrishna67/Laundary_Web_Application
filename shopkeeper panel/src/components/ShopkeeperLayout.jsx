import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import { useTheme } from '../contexts/ThemeContextValues.jsx'
import '../panel.css'

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        <path
          d="M18 20c0-5.5 4.5-10 10-10h8c5.5 0 10 4.5 10 10v24c0 5.5-4.5 10-10 10h-8c-5.5 0-10-4.5-10-10V20Z"
          fill="#E0F2FE"
        />
        <path
          d="M20 22h24M20 31h24M20 40h16"
          stroke="#18A7FF"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M46 15l2.2-4.2L50.5 15l4.2 2.2-4.2 2.2-2.3 4.3-2.2-4.3-4.2-2.2L46 15Z"
          fill="#FFD166"
        />
      </svg>
    </div>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 6h14M7 12h14M7 18h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function CustomersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 6a3 3 0 0 1 0 6m5 8a5 5 0 0 0-4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v3m0 14v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M2 12h3m14 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { path: '/orders', label: 'Orders', Icon: OrdersIcon },
  { path: '/customers', label: 'Customers', Icon: CustomersIcon },
  { path: '/profile', label: 'Profile', Icon: ProfileIcon },
  { path: '/settings', label: 'Settings', Icon: SettingsIcon },
]

function ShopkeeperLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const { user } = useUser()

  const isActive = (path) => location.pathname === path

  return (
    <div className="panel-shell">
      <aside className="panel-sidebar" aria-label="Shopkeeper navigation">
        <div className="sidebar-brand">
          <BrandMark />
          <div className="sidebar-brand-text">
            <strong>Hexa Laundary</strong>
            <span>Shopkeeper Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ path, label, Icon }) => (
            <button
              key={path}
              type="button"
              className={`nav-item ${isActive(path) ? 'active' : ''}`}
              aria-current={isActive(path) ? 'page' : undefined}
              onClick={() => navigate(path)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar" aria-hidden="true">
              {user?.firstName?.[0] || user?.username?.[0] || 'S'}
            </div>
            <div className="sidebar-user-text">
              <strong>{user?.fullName || user?.username || 'Shopkeeper'}</strong>
              <span>Store Partner</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="panel-main">
        <header className="panel-topbar">
          <div className="panel-search">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input type="search" placeholder="Search orders, customers..." aria-label="Search" />
          </div>

          <div className="panel-topbar-actions">
            <button
              type="button"
              className="icon-button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>

        <main className="panel-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ShopkeeperLayout
