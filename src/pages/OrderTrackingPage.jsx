import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../order-tracking.css'

const apiBaseUrl = 'https://quickwash-backend.onrender.com'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const STATUS_STEPS = [
  { id: 'Order Placed', label: 'Order Placed', icon: '📝' },
  { id: 'Picked Up', label: 'Picked Up', icon: '🚚' },
  { id: 'Washing', label: 'Washing', icon: '🧺' },
  { id: 'Ready', label: 'Ready', icon: '✅' },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: '📦' },
  { id: 'Delivered', label: 'Delivered', icon: '🏠' },
]

function OrderTrackingPage() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const lastOrder = JSON.parse(localStorage.getItem('quickwashLastOrder') || '{}')
        const mongoId = lastOrder.mongoId

        if (mongoId) {
          const response = await fetch(`${apiBaseUrl}/api/orders/detail/${mongoId}`)
          const data = await response.json()
          setOrder(data)
        } else {
          // Fallback to localStorage data
          setOrder(lastOrder)
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
        const lastOrder = JSON.parse(localStorage.getItem('quickwashLastOrder') || '{}')
        setOrder(lastOrder)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [])

  if (isLoading) {
    return (
      <main className="tracking-page">
        <header className="tracking-header"><h1>Track Order</h1></header>
        <div className="empty-state"><p>Loading...</p></div>
      </main>
    )
  }

  if (!order || !order._id) {
    return (
      <main className="tracking-page">
        <header className="tracking-header">
          <button className="back-button" type="button" onClick={() => navigate('/home')} aria-label="Go back">
            <BackIcon />
          </button>
          <h1>Track Order</h1>
        </header>
        <div className="empty-state">
          <p>No active order to track.</p>
          <button className="back-button" type="button" onClick={() => navigate('/services')}>
            Book a Service
          </button>
        </div>
      </main>
    )
  }

  const currentStatusIndex = STATUS_STEPS.findIndex((step) => step.id === order.status)
  const currentStep = STATUS_STEPS[currentStatusIndex] || STATUS_STEPS[0]

  return (
    <main className="tracking-page">
      <header className="tracking-header">
        <button className="back-button" type="button" onClick={() => navigate('/home')} aria-label="Go back">
          <BackIcon />
        </button>
        <h1>Track Order</h1>
        <div className="order-id-badge">#{order._id.slice(-8).toUpperCase()}</div>
      </header>

      <section className="status-card" aria-labelledby="current-status-label">
        <div className="current-status-icon">{currentStep.icon}</div>
        <h2 id="current-status-label">{currentStep.label}</h2>
        <p className="estimated-delivery">
          {order.status === 'Delivered' ? 'Delivered on: ' : 'Estimated Delivery: '}
          <strong>{formatDate(order.deliveryDate)}</strong>
        </p>
      </section>

      <section className="timeline-card" aria-label="Order progress">
        <div className="timeline-track">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStatusIndex
            const isCurrent = index === currentStatusIndex

            return (
              <div
                className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                key={step.id}
              >
                <div
                  className={[
                    'timeline-dot',
                    isCompleted ? 'completed' : '',
                    isCurrent ? 'current' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {isCompleted && !isCurrent ? (
                    <span className="check-icon">✓</span>
                  ) : (
                    <span className="step-icon">{step.icon}</span>
                  )}
                </div>
                <span className="timeline-label">{step.label}</span>
                {index < STATUS_STEPS.length - 1 && (
                  <div className={`timeline-line ${index < currentStatusIndex ? 'filled' : ''}`} />
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="details-card">
        <button
          type="button"
          className="collapsible-trigger"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <span>Order Details</span>
          <svg
            className={`chevron ${expanded ? 'open' : ''}`}
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {expanded && (
          <div className="collapsible-content">
            {order.services && order.services.length > 0 && (
              <div className="details-section">
                <h4>Services</h4>
                {order.services.map((service, index) => (
                  <div className="detail-row" key={index}>
                    <span><strong>{service.name}</strong> × {service.quantity}</span>
                    <span>₹{service.price * service.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="details-section">
              <h4>Pickup</h4>
              <div className="detail-row">
                <span>Date</span>
                <strong>{formatDate(order.pickupDate)}</strong>
              </div>
              <div className="detail-row">
                <span>Slot</span>
                <strong>{order.pickupTime}</strong>
              </div>
            </div>

            <div className="details-section">
              <h4>Delivery</h4>
              <div className="detail-row">
                <span>Date</span>
                <strong>{formatDate(order.deliveryDate)}</strong>
              </div>
              <div className="detail-row">
                <span>Slot</span>
                <strong>{order.deliveryTime}</strong>
              </div>
            </div>

            {order.address && (
              <div className="details-section">
                <h4>Address</h4>
                <p>{order.address}</p>
              </div>
            )}

            <div className="details-total">
              <span>Total Amount</span>
              <strong>₹{order.total}</strong>
            </div>
          </div>
        )}
      </section>

      <div className="tracking-actions">
        <button type="button" className="home-button" onClick={() => navigate('/home')}>
          Home
        </button>
      </div>
    </main>
  )
}

function formatDate(dateValue) {
  if (!dateValue) return ''
  const date = new Date(dateValue)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default OrderTrackingPage