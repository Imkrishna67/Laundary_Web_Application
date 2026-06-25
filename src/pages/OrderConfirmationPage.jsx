import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../order-confirmation.css'

function OrderConfirmationPage() {
  const navigate = useNavigate()
  const order = useMemo(() => readOrderConfirmation(), [])

  return (
    <main className="confirmation-page">
      <section className="confirmation-card" aria-labelledby="confirmation-title">
        <div className="success-check" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" />
            <path className="check" d="M18 33.5 27 42.5 47 22" />
          </svg>
        </div>

        <h1 id="confirmation-title">Order Placed Successfully!</h1>
        <p>Your laundry request has been confirmed. We will pick up your order at the scheduled time.</p>

        <div className="order-id-chip">Order ID: {order.orderId}</div>

        <div className="summary-card">
          <h2>Order Summary</h2>

          <div className="summary-section">
            <h3>Services</h3>
            {order.services.map((service) => (
              <div className="service-summary-item" key={service.id}>
                <span>
                  <strong>{service.name}</strong> × {service.quantity}
                </span>
                <span>₹{service.lineTotal}</span>
              </div>
            ))}
          </div>

          <div className="summary-section">
            <h3>Pickup & Delivery</h3>
            <div className="schedule-summary-row">
              <span>Pickup</span>
              <strong>{formatDate(order.schedule.pickupDate)}, {order.schedule.pickupSlot}</strong>
            </div>
            <div className="schedule-summary-row">
              <span>Delivery</span>
              <strong>{formatDate(order.schedule.deliveryDate)}, {order.schedule.deliverySlot}</strong>
            </div>
          </div>

          <div className="summary-section">
            <h3>Delivery Address</h3>
            {order.address ? (
              <p className="address-summary">
                {order.address.houseNo}, {order.address.street}, {order.address.city} - {order.address.pincode}
                {order.address.landmark ? ` · ${order.address.landmark}` : ''}
              </p>
            ) : (
              <p className="address-summary">No address selected.</p>
            )}
          </div>

          <div className="total-summary">
            <span>Total Amount</span>
            <strong>₹{order.totals.total}</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="track-button" type="button" onClick={() => navigate('/track-order')}>
            Track Order
          </button>
          <button className="home-button" type="button" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>
      </section>
    </main>
  )
}

function readOrderConfirmation() {
  try {
    const storedOrder = localStorage.getItem('quickwashLastOrder')
    if (storedOrder) {
      const order = JSON.parse(storedOrder)
      return {
        orderId: order.id,
        services: order.services,
        schedule: order.schedule,
        address: order.address,
        totals: {
          subtotal: order.subtotal,
          deliveryCharge: order.deliveryCharge,
          discount: order.discount,
          total: order.total,
        },
      }
    }
  } catch {
    // fall through to demo data
  }

  return {
    orderId: 'QW-2048',
    services: [
      { id: 'demo-regular-wash', name: 'Regular Wash', quantity: 2, lineTotal: 160 },
    ],
    schedule: {
      pickupDate: getTodayInputValue(),
      pickupSlot: 'Morning · 6:00 AM - 10:00 AM',
      deliveryDate: addDaysToInputValue(getTodayInputValue(), 1),
      deliverySlot: 'Evening · 6:00 PM - 10:00 PM',
    },
    address: null,
    totals: {
      subtotal: 160,
      deliveryCharge: 40,
      discount: 0,
      total: 200,
    },
  }
}

function getTodayInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addDaysToInputValue(dateValue, daysToAdd) {
  const date = new Date(`${dateValue}T00:00:00`)
  date.setDate(date.getDate() + daysToAdd)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
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

export default OrderConfirmationPage
