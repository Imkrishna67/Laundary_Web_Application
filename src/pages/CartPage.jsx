import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../cart.css'

const serviceCatalog = [
  {
    id: 'regular-wash',
    name: 'Regular Wash',
    description: 'Everyday clothes washed with care',
    price: 80,
  },
  {
    id: 'premium-wash',
    name: 'Premium Wash',
    description: 'Gentle wash for delicate fabrics',
    price: 120,
  },
  {
    id: 'blanket-wash',
    name: 'Blanket Wash',
    description: 'Bulky blankets and comforters',
    price: 250,
  },
  {
    id: 'shirt-dry-clean',
    name: 'Shirt Dry Clean',
    description: 'Crisp finish for office shirts',
    price: 80,
  },
  {
    id: 'suit-dry-clean',
    name: 'Suit Dry Clean',
    description: 'Premium care for coats and suits',
    price: 350,
  },
  {
    id: 'dress-dry-clean',
    name: 'Dress Dry Clean',
    description: 'Safe cleaning for party wear',
    price: 250,
  },
  {
    id: 'shirt-iron',
    name: 'Shirt Iron',
    description: 'Steam iron with neat folding',
    price: 40,
  },
  {
    id: 'pant-iron',
    name: 'Pant Iron',
    description: 'Sharp crease and smooth finish',
    price: 50,
  },
  {
    id: 'saree-iron',
    name: 'Saree Iron',
    description: 'Careful pleat and press service',
    price: 120,
  },
  {
    id: 'leather-jacket',
    name: 'Leather Jacket',
    description: 'Special cleaning and conditioning',
    price: 800,
  },
  {
    id: 'comforter-care',
    name: 'Comforter Care',
    description: 'Deep clean for heavy bedding',
    price: 900,
  },
  {
    id: 'sneaker-clean',
    name: 'Sneaker Clean',
    description: 'Deep cleaning for sneakers',
    price: 399,
  },
]

const PROMOS = [
  { code: 'QUICK20', discount: 0.2, label: '20% OFF', description: 'Flat 20% off on all services' },
  { code: 'FIRST50', discount: 50, label: '₹50 OFF', description: '₹50 off on your first order' },
  { code: 'WEEKEND', discount: 0.15, label: '15% OFF', description: '15% off on all services' },
]

function getPromoDiscount(code, subtotal) {
  const promo = PROMOS.find((p) => p.code === code)
  if (!promo) return 0
  if (promo.discount === 'freeship') return 0
  if (typeof promo.discount === 'number' && promo.discount < 1) return Math.round(subtotal * promo.discount)
  return Math.min(promo.discount, subtotal)
}

function isFreeDelivery(code) {
  const promo = PROMOS.find((p) => p.code === code)
  return promo?.discount === 'freeship'
}

function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(readCartItems)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const [copiedCode, setCopiedCode] = useState('')

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

  const subtotal = selectedServices.reduce((total, service) => total + service.lineTotal, 0)
  const discount = appliedPromo ? getPromoDiscount(appliedPromo, subtotal) : 0
  const freeDelivery = appliedPromo ? isFreeDelivery(appliedPromo) : false
  const deliveryCharge = subtotal > 0 && (freeDelivery || subtotal - discount >= 500) ? 0 : 40
  const total = Math.max(0, subtotal + deliveryCharge - discount)

  useEffect(() => {
    localStorage.setItem('quickwashCart', JSON.stringify(cartItems))
    localStorage.setItem(
      'quickwashOrderTotals',
      JSON.stringify({
        subtotal,
        deliveryCharge,
        discount,
        total,
        promoCode: appliedPromo,
      }),
    )
  }, [cartItems, subtotal, deliveryCharge, discount, total, appliedPromo])

  function removeItem(serviceId) {
    setCartItems((currentCart) => {
      const nextCart = { ...currentCart }
      delete nextCart[serviceId]
      return nextCart
    })
  }

  function handleApplyPromo(event) {
    event.preventDefault()
    const normalizedCode = promoCode.trim().toUpperCase()
    if (!normalizedCode) {
      setPromoMessage('Please enter a promo code.')
      setAppliedPromo('')
      return
    }
    if (PROMOS.find((p) => p.code === normalizedCode)) {
      setAppliedPromo(normalizedCode)
      setPromoMessage(`Promo code ${normalizedCode} applied successfully.`)
      setPromoCode('')
      return
    }
    setAppliedPromo('')
    setPromoMessage('Invalid promo code. Try one of the available codes below.')
  }

  function handlePromoClick(code) {
    setAppliedPromo(code)
    setPromoMessage(`Promo code ${code} applied successfully!`)
    setCopiedCode(code)
    navigator.clipboard.writeText(code).catch(() => {})
    setTimeout(() => setCopiedCode(''), 2000)
  }

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <button className="add-more-link" type="button" onClick={() => navigate('/services')}>
          Add More
        </button>
      </header>

      {selectedServices.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-cart-icon" aria-hidden="true">
            <BagIcon />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add laundry services from the service selection page to continue.</p>
          <button className="proceed-button" type="button" onClick={() => navigate('/services')}>
            Browse Services
          </button>
        </section>
      ) : (
        <>
          <section className="cart-list" aria-label="Selected services">
            {selectedServices.map((service) => (
              <article className="cart-item" key={service.id}>
                <div className="cart-item-icon" aria-hidden="true">
                  <BagIcon />
                </div>
                <div>
                  <h2>{service.name}</h2>
                  <p>₹{service.price} × {service.quantity}</p>
                </div>
                <div className="item-meta">
                  <span className="item-price">₹{service.lineTotal}</span>
                  <span className="item-quantity">Qty {service.quantity}</span>
                  <button
                    className="remove-button"
                    type="button"
                    aria-label={`Remove ${service.name}`}
                    onClick={() => removeItem(service.id)}
                  >
                    <RemoveIcon />
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="cart-summary-card" aria-label="Price breakdown">
            <h2>Price Breakdown</h2>
            <div className="price-row">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>
            <div className="price-row">
              <span>Delivery Charge</span>
              <strong>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</strong>
            </div>
            <div className="price-row discount">
              <span>Discount {appliedPromo ? `(${appliedPromo})` : ''}</span>
              <strong>-₹{discount}</strong>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>
          </section>

          <section className="promo-card" aria-label="Promo code">
            <h2>Promo Code</h2>
            <form className="promo-form" onSubmit={handleApplyPromo}>
              <input
                type="text"
                value={promoCode}
                onChange={(event) => {
                  setPromoCode(event.target.value)
                  setPromoMessage('')
                }}
                placeholder="Enter promo code"
                autoComplete="off"
              />
              <button type="submit">Apply</button>
            </form>
            {promoMessage ? (
              <p
                className={`promo-message ${promoMessage.includes('Invalid') || promoMessage.includes('Please') ? 'error' : 'success'}`}
                role="status"
              >
                {promoMessage}
              </p>
            ) : null}
            <div className="promo-chips">
              {PROMOS.map((promo) => {
                const isApplied = appliedPromo === promo.code
                const isCopied = copiedCode === promo.code
                return (
                  <button
                    key={promo.code}
                    type="button"
                    className={`promo-chip ${isApplied ? 'applied' : ''}`}
                    onClick={() => handlePromoClick(promo.code)}
                    disabled={isApplied}
                  >
                    <span className="promo-chip-row">
                      <span className="promo-chip-label">{promo.label}</span>
                    </span>
                    <span className="promo-chip-row promo-chip-body">
                      <span className="promo-chip-code">{promo.code}</span>
                      <span className="promo-chip-desc">{promo.description}</span>
                    </span>
                    {isApplied && (
                      <span className="promo-chip-badge">✓ Applied</span>
                    )}
                    {isCopied && (
                      <span className="promo-chip-copied">Copied!</span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          <button
            className="proceed-button"
            type="button"
            disabled={selectedServices.length === 0}
            onClick={() => navigate('/schedule')}
          >
            Proceed to Schedule
          </button>
        </>
      )}
    </main>
  )
}

function readCartItems() {
  try {
    const storedCart = localStorage.getItem('quickwashCart')
    return storedCart ? JSON.parse(storedCart) : {}
  } catch {
    return {}
  }
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 8h12l1 13H5L6 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export default CartPage
