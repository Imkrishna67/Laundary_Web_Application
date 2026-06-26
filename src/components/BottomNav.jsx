import { useLocation, useNavigate } from 'react-router-dom'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11 12 3l9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function ScheduleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ProfileSmallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveClass = (path) => {
    if (path === '/home' && location.pathname === '/home') return 'active'
    if (path === '/orders' && location.pathname === '/orders') return 'active'
    if (path === '/schedule' && location.pathname === '/schedule') return 'active'
    if (path === '/profile' && location.pathname === '/profile') return 'active'
    return ''
  }

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <button className={getActiveClass('/home')} type="button" aria-label="Home" aria-current={getActiveClass('/home') ? 'page' : undefined} onClick={() => navigate('/home')}>
        <HomeIcon />
        Home
      </button>
      <button className={getActiveClass('/orders')} type="button" aria-label="Orders" onClick={() => navigate('/orders')}>
        <OrdersIcon />
        Orders
      </button>
      <button className={getActiveClass('/schedule')} type="button" aria-label="Schedule" onClick={() => navigate('/schedule')}>
        <ScheduleIcon />
        Schedule
      </button>
      <button className={getActiveClass('/profile')} type="button" aria-label="Profile" onClick={() => navigate('/profile')}>
        <ProfileSmallIcon />
        Profile
      </button>
    </nav>
  )
}

export default BottomNav
