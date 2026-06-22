import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../home.css'

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
    return storedSchedule ? JSON.parse(storedSchedule) : null
  } catch {
    return null
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

function readSelectedAddressId() {
  return localStorage.getItem('quickwashSelectedAddressId') || ''
}

function readOrderTotals() {
  try {
    const storedTotals = localStorage.getItem('quickwashOrderTotals')
    return storedTotals ? JSON.parse(storedTotals) : { subtotal: 0, deliveryCharge: 0, discount: 0, total: 0 }
  } catch {
    return { subtotal: 0, deliveryCharge: 0, discount: 0, total: 0 }
  }
}

function OrdersPage() {
  const navigate = useNavigate()
  const cartItems = readCartItems()
  const schedule = readSchedule()
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const selectedServices = useMemo(
    () =>
      serviceCatalog
        .filter((service) => (cartItems[service.id] || 0) > 0)
        .map((service) => ({
          ...service,
          quantity: cartItems[service.id],
          lineTotal: service.price * cartItems[service.id],
        })),
    [cartItems],
  )

  const totals = readOrderTotals()
  const addresses = readAddresses()
  const selectedAddressId = readSelectedAddressId()
  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)

  const formattedPickupDate = schedule?.pickupDate ? formatDate(schedule.pickupDate) : ''
  const formattedDeliveryDate = schedule?.deliveryDate ? formatDate(schedule.deliveryDate) : ''

  function formatDate(dateValue) {
    if (!dateValue) return ''
    const date = new Date(`${dateValue}T00:00:00`)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function handlePlaceOrder() {
    if (selectedServices.length === 0 || !selectedAddress || !schedule) {
      return
    }
    const orderCount = localStorage.getItem('quickwashOrderCount') || '0'
    const nextOrderCount = parseInt(orderCount, 10) + 1
    localStorage.setItem('quickwashOrderCount', String(nextOrderCount))
    const order = {
      id: `QW-${String(1000 + nextOrderCount).slice(1)}`,
      services: selectedServices,
      schedule,
      address: selectedAddress,
      paymentMethod,
      subtotal: totals.subtotal,
      deliveryCharge: totals.deliveryCharge,
      discount: totals.discount,
      total: totals.total,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('quickwashLastOrder', JSON.stringify(order))
    localStorage.setItem('quickwashCart', '{}')
    localStorage.setItem('quickwashPickupChecked', 'true')
    navigate('/order-confirmation')
  }

  return (
    <main className="order-review-page">
      <header className="order-header">
        <button className="back-button" type="button" onClick={() => navigate('/address')} aria-label="Go back">
          ←
        </button>
        <h1>Order Review</h1>
      </header>

      <section className="review-card">
        <h2>Services</h2>
        <div className="review-services-list">
          {selectedServices.map((service) => (
            <div key={service.id} className="review-service-item">
              <span className="review-service-name">{service.name}</span>
              <span className="review-service-qty">×{service.quantity}</span>
              <span className="review-service-price">₹{service.lineTotal}</span>
            </div>
          ))}
        </div>
        <button className="edit-link" type="button" onClick={() => navigate('/cart')}>
          Edit
        </button>
      </section>

      <section className="review-card">
        <h2>Scheduling</h2>
        <div className="review-schedule-info">
          <p>
            <strong>Pickup:</strong>{' '}
            {formattedPickupDate} · {schedule?.pickupSlot?.split(' · ')[0] || 'Select slot'}
          </p>
          <p>
            <strong>Delivery:</strong>{' '}
            {formattedDeliveryDate} · {schedule?.deliverySlot?.split(' · ')[0] || 'Select slot'}
          </p>
        </div>
        <button className="edit-link" type="button" onClick={() => navigate('/schedule')}>
          Edit
        </button>
      </section>

      <section className="review-card">
        <h2>Address</h2>
        {selectedAddress ? (
          <div className="review-address-info">
            <p>
              <strong>
                {selectedAddress.houseNo}, {selectedAddress.street}
              </strong>
            </p>
            <p>
              {selectedAddress.city} - {selectedAddress.pincode}
              {selectedAddress.landmark && ` · ${selectedAddress.landmark}`}
            </p>
          </div>
        ) : (
          <p className="review-no-address">No address selected</p>
        )}
        <button className="edit-link" type="button" onClick={() => navigate('/address')}>
          Edit
        </button>
      </section>

      <section className="review-card">
        <h2>Pricing</h2>
        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal</span>
            <strong>₹{totals.subtotal}</strong>
          </div>
          <div className="price-row">
            <span>Delivery</span>
            <strong>{totals.deliveryCharge === 0 ? 'Free' : `₹${totals.deliveryCharge}`}</strong>
          </div>
          {totals.discount > 0 && (
            <div className="price-row discount">
              <span>Discount</span>
              <strong>-₹{totals.discount}</strong>
            </div>
          )}
          <div className="price-row total">
            <span>Total</span>
            <strong>₹{totals.total}</strong>
          </div>
        </div>
      </section>

      <section className="review-card">
        <h2>Payment</h2>
        <div className="payment-options">
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            <span className="payment-text">Cash on Delivery</span>
          </label>
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={() => setPaymentMethod('online')}
            />
            <span className="payment-text">Online Payment</span>
          </label>
        </div>
      </section>

      {schedule?.instructions && (
        <section className="review-card">
          <h2>Notes</h2>
          <p className="review-instructions">{schedule.instructions}</p>
        </section>
      )}

      <button
        className="place-order-button"
        type="button"
        onClick={handlePlaceOrder}
        disabled={selectedServices.length === 0 || !selectedAddress || !schedule}
      >
        Place Order
      </button>
    </main>
  )
}

export default OrdersPage