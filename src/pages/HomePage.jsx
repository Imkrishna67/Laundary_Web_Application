import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContextValues.jsx'
import '../home.css'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button className="icon-button theme-toggle" type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={toggle}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

const promoSlides = [
  {
    badge: 'New User Offer',
    title: 'Get 20% OFF on your first wash',
    description: 'Fresh clothes, doorstep pickup, and fast delivery.',
  },
  {
    badge: 'Weekend Deal',
    title: 'Free pickup on orders above ₹799',
    description: 'Book today and enjoy contactless laundry service.',
  },
  {
    badge: 'Premium Care',
    title: 'Dry clean 3 shirts at ₹299',
    description: 'Premium fabric care for office and party wear.',
  },
]

const services = [
  {
    name: 'Wash',
    description: 'Everyday clothes',
    icon: WashIcon,
  },
  {
    name: 'Dry Clean',
    description: 'Suits & formal wear',
    icon: DryIcon,
  },
  {
    name: 'Iron',
    description: 'Steam & press',
    icon: IronIcon,
  },
  {
    name: 'Shoe Clean',
    description: 'Sneakers & sports shoes',
    icon: ShoeIcon,
  },
  {
    name: 'Bedding',
    description: 'Bedsheets & blankets',
    icon: BeddingIcon,
  },
  {
    name: 'Fold & Pack',
    description: 'Neat finishing',
    icon: FoldIcon,
  },
]

function getUserName() {
  try {
    const storedUser = localStorage.getItem('quickwashUser')
    if (!storedUser) return 'there'

    const user = JSON.parse(storedUser)
    const identifier = user.identifier || ''

    if (!identifier) return 'there'
    if (identifier.includes('@')) return identifier.split('@')[0]
    return identifier.slice(0, 4)
  } catch {
    return 'there'
  }
}

function readLastOrder() {
  try {
    const stored = localStorage.getItem('quickwashLastOrder')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function formatOrderDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getOrderItemCount(order) {
  if (!order?.services) return 0
  return order.services.reduce((count, service) => count + (service.quantity || 0), 0)
}

function HomePage() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const [pickupScheduled, setPickupScheduled] = useState(() => {
    try {
      return localStorage.getItem('quickwashPickupChecked') === 'true'
    } catch {
      return false
    }
  })
  const lastOrder = readLastOrder()
  const orderItemCount = getOrderItemCount(lastOrder)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentIndex) => (currentIndex + 1) % promoSlides.length)
    }, 4000)

    return () => window.clearInterval(timer)
  }, [])

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const searchableText = `${service.name} ${service.description}`.toLowerCase()
        return searchableText.includes(searchText.toLowerCase())
      }),
    [searchText],
  )

  return (
    <main className="home-page">
      <header className="home-header">
        <div>
          <p className="eyebrow">QuickWash</p>
          <h1>Hi, {getUserName()}</h1>
        </div>
        <div className="header-actions" aria-label="Account actions">
          <ThemeToggle />
          <button className="icon-button" type="button" aria-label="Cart" onClick={() => navigate('/cart')}>
            <CartIcon />
          </button>
          <button className="icon-button" type="button" aria-label="Profile" onClick={() => navigate('/profile')}>
            <ProfileIcon />
          </button>
        </div>
      </header>

      <div className="search-wrapper" aria-label="Search services">
        <span className="search-icon-wrap">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search for wash, iron..."
        />
      </div>

      <section className="promo-banner" aria-label="Promotional offers">
        <div className="promo-content">
          <span className="promo-badge">{promoSlides[activeSlide].badge}</span>
          <h2>{promoSlides[activeSlide].title}</h2>
          <p>{promoSlides[activeSlide].description}</p>
        </div>
        <div className="carousel-dots" aria-label="Offer carousel">
          {promoSlides.map((_, index) => (
            <button
              key={promoSlides[index].badge}
              className={`carousel-dot ${index === activeSlide ? 'active' : ''}`}
              type="button"
              aria-label={`Show offer ${index + 1}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="services-title">
        <div className="section-header">
          <h2 id="services-title">Services</h2>
          <button className="see-all" type="button" onClick={() => navigate('/services')}>
            See all
          </button>
        </div>

        <div className="service-grid">
          {filteredServices.map((service) => {
            const ServiceIcon = service.icon
            return (
              <button
                className="service-card"
                key={service.name}
                type="button"
                onClick={() => navigate('/services')}
              >
                <span className="service-icon">
                  <ServiceIcon />
                </span>
                <span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </span>
              </button>
            )
          })}
        </div>

        {filteredServices.length === 0 ? (
          <p className="no-results">No services found for your search.</p>
        ) : null}
      </section>

      {lastOrder && (
        <section className="active-order-card" aria-labelledby="active-order-title">
          <div className="order-top">
            <div>
              <h2 id="active-order-title">Active Order</h2>
              <p className="order-meta">
                Order #{lastOrder.id} · {orderItemCount} item{orderItemCount !== 1 ? 's' : ''}
              </p>
            </div>
            <span className="status-pill">In Progress</span>
          </div>

          <div className="order-timeline">
            <label className="timeline-item active">
              <input
                className="timeline-checkbox"
                type="checkbox"
                checked={pickupScheduled}
                disabled={pickupScheduled}
                readOnly
              />
              <div>
                <h3>Pickup scheduled</h3>
                <p>
                  {lastOrder.schedule?.pickupDate
                    ? `${formatOrderDate(lastOrder.schedule.pickupDate)} · ${lastOrder.schedule.pickupSlot?.split(' · ')[0] || 'Slot pending'}`
                    : 'Pickup pending'}
                </p>
              </div>
            </label>
            <label className="timeline-item in-progress">
              <input className="timeline-checkbox" type="checkbox" readOnly />
              <div>
                <h3>Washing in progress</h3>
                <p>
                  {lastOrder.schedule?.deliveryDate
                    ? `Expected by ${formatOrderDate(lastOrder.schedule.deliveryDate)}`
                    : 'Expected soon'}
                </p>
              </div>
            </label>
          </div>

          <button className="view-order-button" type="button" onClick={() => navigate('/track-order')}>
            View Active Order
          </button>
        </section>
      )}

      <button className="pickup-button" type="button" onClick={() => navigate('/services')}>
        Book a Pickup
      </button>

      <nav className="bottom-nav" aria-label="Bottom navigation">
        <button className="active" type="button" aria-label="Home" aria-current="page">
          <HomeIcon />
          Home
        </button>
        <button type="button" aria-label="Orders" onClick={() => navigate('/orders')}>
          <OrdersIcon />
          Orders
        </button>
        <button type="button" aria-label="Schedule" onClick={() => navigate('/schedule')}>
          <ScheduleIcon />
          Schedule
        </button>
        <button type="button" aria-label="Profile" onClick={() => navigate('/profile')}>
          <ProfileSmallIcon />
          Profile
        </button>
      </nav>
    </main>
  )
}



function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function WashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function DryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4h8l2 16H6L8 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10 14.5 3H18l3 3v5l-3 3H9l-4 4v-4l2-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ShoeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 15c3-1 5-1 7 0l7 3h4v-4l-5-5-7 1-6 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 15c1 2 3 3 6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BeddingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h13a3 3 0 0 1 3 3v8H5a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FoldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h7v7H4V6ZM13 11h7v7h-7v-7ZM4 15h7v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3ZM15 4h3a2 2 0 0 1 2 2v5h-5V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

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

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6h15l-2 9H8L6 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6 5 3H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
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

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

export default HomePage
