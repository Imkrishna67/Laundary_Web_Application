import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../order-confirmation.css'

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
            <p className="address-summary">
              {order.address.houseNo}, {order.address.street}, {order.address.city} - {order.address.pincode}
              {order.address.landmark ? ` · ${order.address.landmark}` : ''}
            </p>
          </div>

          <div className="total-summary">
            <span>Total Amount</span>
            <strong>₹{order.totals.total}</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="track-button" type="button" onClick={() => navigate('/orders')}>
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
  const cart = readCartItems()
  const services = serviceCatalog
    .filter((service) => (cart[service.id] || 0) > 0)
    .map((service) => ({
      ...service,
      quantity: cart[service.id],
      lineTotal: service.price * cart[service.id],
    }))

  const hasRealOrder = services.length > 0
  const orderServices = hasRealOrder
    ? services
    : [
        {
          id: 'demo-regular-wash',
          name: 'Regular Wash',
          quantity: 2,
          lineTotal: 160,
        },
      ]

  const schedule = readSchedule()
  const addresses = readAddresses()
  const selectedAddressId = localStorage.getItem('quickwashSelectedAddressId') || ''
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId)

  const totals = readOrderTotals()
  const fallbackTotals = {
    subtotal: 160,
    deliveryCharge: 40,
    discount: 0,
    total: 200,
  }

  let orderId = localStorage.getItem('quickwashOrderId')

  if (!orderId) {
    orderId = `QW-${Date.now().toString().slice(-8)}`
    localStorage.setItem('quickwashOrderId', orderId)
  }

  return {
    orderId,
    services: orderServices,
    schedule: hasRealOrder
      ? schedule
      : {
          pickupDate: getTodayInputValue(),
          pickupSlot: 'Morning · 6:00 AM - 10:00 AM',
          deliveryDate: addDaysToInputValue(getTodayInputValue(), 1),
          deliverySlot: 'Evening · 6:00 PM - 10:00 PM',
        },
    address: selectedAddress || {
      id: 'demo-address',
      houseNo: 'A-102',
      street: 'Green Park',
      city: 'New Delhi',
      pincode: '110016',
      landmark: 'Near Metro Station',
    },
    totals: hasRealOrder ? totals : fallbackTotals,
  }
}

function readCartItems() {
  try {
    const storedCart = localStorage.getItem('quickwashCart')
    return storedCart ? JSON.parse(storedCart) : {}
  } catch {
    return {}
  }
}

function readSchedule() {
  try {
    const storedSchedule = localStorage.getItem('quickwashSchedule')
    return storedSchedule
      ? JSON.parse(storedSchedule)
      : {
          pickupDate: getTodayInputValue(),
          pickupSlot: 'Morning · 6:00 AM - 10:00 AM',
          deliveryDate: addDaysToInputValue(getTodayInputValue(), 1),
          deliverySlot: 'Evening · 6:00 PM - 10:00 PM',
        }
  } catch {
    return {
      pickupDate: getTodayInputValue(),
      pickupSlot: 'Morning · 6:00 AM - 10:00 AM',
      deliveryDate: addDaysToInputValue(getTodayInputValue(), 1),
      deliverySlot: 'Evening · 6:00 PM - 10:00 PM',
    }
  }
}

function readAddresses() {
  try {
    const storedAddresses = localStorage.getItem('quickwashAddresses')
    return storedAddresses ? JSON.parse(storedAddresses) : []
  } catch {
    return []
  }
}

function readOrderTotals() {
  try {
    const storedTotals = localStorage.getItem('quickwashOrderTotals')
    return storedTotals
      ? JSON.parse(storedTotals)
      : {
          subtotal: 0,
          deliveryCharge: 0,
          discount: 0,
          total: 0,
        }
  } catch {
    return {
      subtotal: 0,
      deliveryCharge: 0,
      discount: 0,
      total: 0,
    }
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
