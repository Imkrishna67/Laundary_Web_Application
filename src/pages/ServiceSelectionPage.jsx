import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../service-selection.css'

const categories = ['Wash', 'Dry Clean', 'Iron', 'Premium Care']

const services = [
  {
    id: 'regular-wash',
    category: 'Wash',
    name: 'Regular Wash',
    description: 'Everyday clothes washed with care',
    price: 80,
    unit: 'per kg',
    icon: WashIcon,
  },
  {
    id: 'premium-wash',
    category: 'Wash',
    name: 'Premium Wash',
    description: 'Gentle wash for delicate fabrics',
    price: 120,
    unit: 'per kg',
    icon: SparkleIcon,
  },
  {
    id: 'blanket-wash',
    category: 'Wash',
    name: 'Blanket Wash',
    description: 'Bulky blankets and comforters',
    price: 250,
    unit: 'per piece',
    icon: BeddingIcon,
  },
  {
    id: 'shirt-dry-clean',
    category: 'Dry Clean',
    name: 'Shirt Dry Clean',
    description: 'Crisp finish for office shirts',
    price: 80,
    unit: 'per piece',
    icon: ShirtIcon,
  },
  {
    id: 'suit-dry-clean',
    category: 'Dry Clean',
    name: 'Suit Dry Clean',
    description: 'Premium care for coats and suits',
    price: 350,
    unit: 'per piece',
    icon: SuitIcon,
  },
  {
    id: 'dress-dry-clean',
    category: 'Dry Clean',
    name: 'Dress Dry Clean',
    description: 'Safe cleaning for party wear',
    price: 250,
    unit: 'per piece',
    icon: DressIcon,
  },
  {
    id: 'shirt-iron',
    category: 'Iron',
    name: 'Shirt Iron',
    description: 'Steam iron with neat folding',
    price: 40,
    unit: 'per piece',
    icon: IronIcon,
  },
  {
    id: 'pant-iron',
    category: 'Iron',
    name: 'Pant Iron',
    description: 'Sharp crease and smooth finish',
    price: 50,
    unit: 'per piece',
    icon: PantsIcon,
  },
  {
    id: 'saree-iron',
    category: 'Iron',
    name: 'Saree Iron',
    description: 'Careful pleat and press service',
    price: 120,
    unit: 'per piece',
    icon: FoldIcon,
  },
  {
    id: 'leather-jacket',
    category: 'Premium Care',
    name: 'Leather Jacket',
    description: 'Special cleaning and conditioning',
    price: 800,
    unit: 'per piece',
    icon: JacketIcon,
  },
  {
    id: 'comforter-care',
    category: 'Premium Care',
    name: 'Comforter Care',
    description: 'Deep clean for heavy bedding',
    price: 900,
    unit: 'per piece',
    icon: BeddingIcon,
  },
  {
    id: 'sneaker-clean',
    category: 'Premium Care',
    name: 'Sneaker Clean',
    description: 'Deep cleaning for sneakers',
    price: 399,
    unit: 'per pair',
    icon: ShoeIcon,
  },
]

function ServiceSelectionPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [cartItems, setCartItems] = useState(() => readCartItems())

  useEffect(() => {
    localStorage.setItem('quickwashCart', JSON.stringify(cartItems))
  }, [cartItems])

  const filteredServices = useMemo(
    () => services.filter((service) => service.category === activeCategory),
    [activeCategory],
  )

  const totalItems = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0)
  const totalAmount = services.reduce((total, service) => {
    return total + service.price * (cartItems[service.id] || 0)
  }, 0)

  function updateQuantity(serviceId, nextQuantity) {
    setCartItems((currentCart) => {
      const nextCart = { ...currentCart }

      if (nextQuantity <= 0) {
        delete nextCart[serviceId]
      } else {
        nextCart[serviceId] = nextQuantity
      }

      return nextCart
    })
  }

  return (
    <main className="service-page">
      <header className="service-header">
        <button className="back-button" type="button" aria-label="Go back" onClick={() => navigate('/home')}>
          <BackIcon />
        </button>
        <h1>Select Services</h1>
      </header>

      <nav className="category-tabs" aria-label="Service categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      <section className="service-list" aria-label={`${activeCategory} services`}>
        {filteredServices.map((service) => {
          const quantity = cartItems[service.id] || 0
          const ServiceIcon = service.icon

          return (
            <article className="service-list-card" key={service.id}>
              <div className="service-visual" aria-hidden="true">
                <ServiceIcon />
              </div>

              <div className="service-info">
                <h2>{service.name}</h2>
                <p>{service.description}</p>
                <div className="service-price">
                  ₹{service.price} <span>/{service.unit}</span>
                </div>
              </div>

              {quantity > 0 ? (
                <div className="quantity-control" aria-label={`${service.name} quantity`}>
                  <button
                    className="quantity-button"
                    type="button"
                    aria-label={`Decrease ${service.name} quantity`}
                    onClick={() => updateQuantity(service.id, quantity - 1)}
                  >
                    −
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-button"
                    type="button"
                    aria-label={`Increase ${service.name} quantity`}
                    onClick={() => updateQuantity(service.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="add-button"
                  type="button"
                  aria-label={`Add ${service.name}`}
                  onClick={() => updateQuantity(service.id, 1)}
                >
                  + Add
                </button>
              )}
            </article>
          )
        })}
      </section>

      <footer className="service-bottom-bar" aria-label="Cart summary">
        <div className="cart-summary">
          <span>Total Items</span>
          <strong>{totalItems}</strong>
        </div>
        <div className="cart-summary">
          <span>Total</span>
          <strong>₹{totalAmount}</strong>
        </div>
        <button
          className="view-cart-button"
          type="button"
          disabled={totalItems === 0}
          onClick={() => navigate('/cart')}
        >
          View Cart
        </button>
      </footer>
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

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 14l.8 1.8 1.8.8-1.8.8L19 19l-.8-1.8-1.8-.8 1.8-.8L19 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
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

function ShirtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4 5 6l2 5H5v9h14v-9h-2l2-5-3-2-4 3-4-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 7v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SuitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3 6 6l3 4H8v11h8V10h-1l3-4-3-3-3 3-3-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 7v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function DressIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4h8l2 5-2 3v8H8v-8L6 9l2-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 9h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function PantsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3h8l1 7-2 11h-4l-2-11h-3l2-5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 10v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function JacketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3 6 6l2 5H6v10h12V11h-2l2-5-3-3-3 3-3-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 6v15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

export default ServiceSelectionPage
