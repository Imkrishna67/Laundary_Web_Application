import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../order-tracking.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const STATUS_STEPS = [
  { id: 'placed', label: 'Order Placed', icon: '📝' },
  { id: 'picked-up', label: 'Picked Up', icon: '🚚' },
  { id: 'washing', label: 'Washing', icon: '🧺' },
  { id: 'ready', label: 'Ready', icon: '✅' },
  { id: 'out-for-delivery', label: 'Out for Delivery', icon: '📦' },
  { id: 'delivered', label: 'Delivered', icon: '🏠' },
]

function OrderTrackingPage() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const order = useMemo(() => readTrackingOrder(), [])

  const currentStatusIndex = STATUS_STEPS.findIndex((step) => step.id === order.status)
  const currentStep = STATUS_STEPS[currentStatusIndex] || STATUS_STEPS[0]

  if (!order) {
    return (
      <main className="tracking-page">
        <header className="tracking-header">
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

  return (
    <main className="tracking-page">
      <header className="tracking-header">
        <button className="back-button" type="button" onClick={() => navigate('/home')} aria-label="Go back">
          <BackIcon />
        </button>
        <h1>Track Order</h1>
        <div className="order-id-badge">Order ID: {order.id}</div>
      </header>

      <section className="status-card" aria-labelledby="current-status-label">
        <div className="current-status-icon">{currentStep.icon}</div>
        <h2 id="current-status-label">{currentStep.label}</h2>
        <p className="estimated-delivery">
          {order.status === 'delivered' ? 'Delivered' : `Estimated Delivery:`}{' '}
          <strong>{order.status === 'delivered' ? formatDate(order.updatedAt) : formatDate(order.schedule?.deliveryDate)}</strong>
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
                  ]
                    .filter(Boolean)
                    .join(' ')}
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

      {order.deliveryPartner && (
        <section className="partner-card">
          <h3>Delivery Partner</h3>
          <div className="partner-info">
            <div className="partner-avatar">
              {order.deliveryPartner.name.charAt(0)}
            </div>
            <div className="partner-details">
              <strong>{order.deliveryPartner.name}</strong>
              <span>{order.deliveryPartner.phone}</span>
            </div>
            <a
              className="call-button"
              href={`tel:${order.deliveryPartner.phone.replace(/\D/g, '')}`}
              aria-label={`Call ${order.deliveryPartner.name}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.363 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.337 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
          </div>
        </section>
      )}

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
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {expanded && (
          <div className="collapsible-content">
            {order.services && order.services.length > 0 ? (
              <div className="details-section">
                <h4>Services</h4>
                {order.services.map((service) => (
                  <div className="detail-row" key={service.id}>
                    <span>
                      <strong>{service.name}</strong> × {service.quantity}
                    </span>
                    <span>₹{service.price * service.quantity}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {order.schedule && (
              <>
                <div className="details-section">
                  <h4>Pickup</h4>
                  <div className="detail-row">
                    <span>Date</span>
                    <strong>{formatDate(order.schedule.pickupDate)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Slot</span>
                    <strong>{order.schedule.pickupSlot}</strong>
                  </div>
                </div>

                <div className="details-section">
                  <h4>Delivery</h4>
                  <div className="detail-row">
                    <span>Date</span>
                    <strong>{formatDate(order.schedule.deliveryDate)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Slot</span>
                    <strong>{order.schedule.deliverySlot}</strong>
                  </div>
                </div>
              </>
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

function readTrackingOrder() {
  try {
    const stored = localStorage.getItem('quickwashLastOrder')
    if (!stored) return null
    const order = JSON.parse(stored)
    const serviceCatalog = [
      { id: 'regular-wash', name: 'Regular Wash', price: 80 },
      { id: 'premium-wash', name: 'Premium Wash', price: 120 },
      { id: 'blanket-wash', name: 'Blanket Wash', price: 250 },
      { id: 'shirt-dry-clean', name: 'Shirt Dry Clean', price: 80 },
      { id: 'suit-dry-clean', name: 'Suit Dry Clean', price: 350 },
      { id: 'dress-dry-clean', name: 'Dress Dry Clean', price: 250 },
      { id: 'shirt-iron', name: 'Shirt Iron', price: 40 },
      { id: 'pant-iron', name: 'Pant Iron', price: 50 },
      { id: 'saree-iron', name: 'Saree Iron', price: 120 },
      { id: 'leather-jacket', name: 'Leather Jacket', price: 800 },
      { id: 'comforter-care', name: 'Comforter Care', price: 900 },
      { id: 'sneaker-clean', name: 'Sneaker Clean', price: 399 },
    ]

    const services = order.services || []
    const mappedServices = services.map((s) => {
      const catalogItem = serviceCatalog.find((c) => c.id === s.id)
      return {
        ...s,
        price: catalogItem?.price || s.price || 0,
        lineTotal: s.lineTotal || (catalogItem?.price || 0) * (s.quantity || 0),
      }
    })

    return {
      ...order,
      services: mappedServices,
    }
  } catch {
    return null
  }
}

function formatDate(dateValue) {
  if (!dateValue) return ''
  const date = new Date(`${dateValue}T00:00:00`)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default OrderTrackingPage
