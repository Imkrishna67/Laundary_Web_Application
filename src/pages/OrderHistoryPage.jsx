import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { orderService } from '../services/api'
import '../order-history.css'

const TABS = [
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

const STATUS_BADGE_MAP = {
  ongoing: { text: 'Ongoing', className: 'badge-ongoing' },
  completed: { text: 'Completed', className: 'badge-completed' },
  cancelled: { text: 'Cancelled', className: 'badge-cancelled' },
}

function OrderHistoryPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('ongoing')

  const orders = useMemo(() => orderService.getOrders(), [])

  if (id) {
    return <OrderHistoryDetailView orderId={id} onBack={() => navigate('/order-history')} />
  }

  const filteredOrders = orders.filter((order) => order.status === activeTab)

  return (
    <main className="history-page">
      <header className="history-header">
        <h1>My Orders</h1>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>No {activeTab} orders yet.</p>
            <button className="back-button" type="button" onClick={() => navigate('/services')}>
              Book a Service
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const badge = STATUS_BADGE_MAP[order.status] || STATUS_BADGE_MAP.ongoing
            const serviceSummary = order.services
              .map((s) => `${s.name} ×${s.quantity}`)
              .join(', ')

            return (
              <div
                key={order.id}
                className="order-card"
                onClick={() => navigate(`/order-history/${order.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/order-history/${order.id}`)
                  }
                }}
              >
                <div className="order-card-top">
                  <span className="order-id">{order.id}</span>
                  <span className={`status-badge ${badge.className}`}>{badge.text}</span>
                </div>

                <p className="order-date">{order.date}</p>
                <p className="order-services">{serviceSummary}</p>

                <div className="order-card-bottom">
                  <span className="order-amount">₹{order.total}</span>
                  {order.status === 'completed' && (
                    <button
                      className="reorder-button"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        orderService.reorder(order.id)
                        navigate('/cart')
                      }}
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}

function OrderHistoryDetailView({ orderId, onBack }) {
  const order = orderService.getOrderById(orderId)
  const navigate = useNavigate()
  const [helpCopied, setHelpCopied] = useState(false)

  if (!order) {
    return (
      <main className="history-page">
        <header className="history-header">
          <h1>Order Not Found</h1>
        </header>
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to Orders
        </button>
      </main>
    )
  }

  function handleHelp() {
    navigator.clipboard.writeText('Support: +91 1800-123-4567 | support@quickwash.in')
    setHelpCopied(true)
    setTimeout(() => setHelpCopied(false), 2000)
  }

  return (
    <main className="history-page">
      <header className="history-header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>Order Details</h1>
      </header>

      <div className="detail-card">
        <div className="detail-top-row">
          <span className="detail-order-id">{order.id}</span>
          {(() => {
            const badge = STATUS_BADGE_MAP[order.status] || STATUS_BADGE_MAP.ongoing
            return <span className={`status-badge ${badge.className}`}>{badge.text}</span>
          })()}
        </div>

        <p className="detail-date">{order.date}</p>

        <div className="detail-section">
          <h3>Services</h3>
          {order.services.map((service) => (
            <div className="detail-row" key={service.id}>
              <span>
                <strong>{service.name}</strong> × {service.quantity}
              </span>
              <span>₹{service.lineTotal}</span>
            </div>
          ))}
        </div>

        <div className="detail-section">
          <h3>Pickup</h3>
          <div className="detail-row">
            <span>Date</span>
            <strong>{formatDate(order.pickupDate)}</strong>
          </div>
          <div className="detail-row">
            <span>Slot</span>
            <strong>{order.pickupSlot}</strong>
          </div>
        </div>

        <div className="detail-section">
          <h3>Delivery</h3>
          <div className="detail-row">
            <span>Date</span>
            <strong>{formatDate(order.deliveryDate)}</strong>
          </div>
          <div className="detail-row">
            <span>Slot</span>
            <strong>{order.deliverySlot}</strong>
          </div>
        </div>

        {order.pickupAddress && order.deliveryAddress && (
          <div className="detail-addresses">
            <div className="detail-section">
              <h3>Pickup Address</h3>
              <p className="detail-address">
                {order.pickupAddress.houseNo}, {order.pickupAddress.street}, {order.pickupAddress.city} - {order.pickupAddress.pincode}
                {order.pickupAddress.landmark ? ` · ${order.pickupAddress.landmark}` : ''}
              </p>
            </div>

            <div className="detail-section">
              <h3>Delivery Address</h3>
              <p className="detail-address">
                {order.deliveryAddress.houseNo}, {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                {order.deliveryAddress.landmark ? ` · ${order.deliveryAddress.landmark}` : ''}
              </p>
            </div>
          </div>
        )}

        <div className="detail-section">
          <h3>Price Breakdown</h3>
          <div className="detail-row">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="detail-row">
              <span>Discount</span>
              <span className="discount-value">- ₹{order.discount}</span>
            </div>
          )}
          <div className="detail-row">
            <span>Delivery Fee</span>
            <span>₹{order.deliveryCharge}</span>
          </div>
          <div className="detail-total-row">
            <span>Total</span>
            <strong>₹{order.total}</strong>
          </div>
        </div>

        <div className="detail-section">
          <h3>Payment</h3>
          <div className="detail-row">
            <span>Method</span>
            <strong>{order.paymentMethod || 'N/A'}</strong>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        {order.status === 'ongoing' && (
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/track-order')}
          >
            Track Order
          </button>
        )}
        {order.status === 'completed' && (
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              orderService.reorder(order.id)
              navigate('/cart')
            }}
          >
            Reorder
          </button>
        )}
         <button type="button" className="help-button" onClick={handleHelp}>
           {helpCopied ? 'Copied!' : 'Need Help?'}
         </button>
        <button type="button" className="secondary-button" onClick={onBack}>
          Back to Orders
        </button>
      </div>
    </main>
  )
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

export default OrderHistoryPage
