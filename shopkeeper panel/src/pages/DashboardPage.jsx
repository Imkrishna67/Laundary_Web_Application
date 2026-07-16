import { useNavigate } from 'react-router-dom'
import '../panel.css'

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function RupeeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 5h8M7 5l8 9M11 14H7m4 0v5m6-12 1 1m-1-7 1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 6a3 3 0 0 1 0 6m5 8a5 5 0 0 0-4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.8" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="18" r="1.8" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

const STATS = [
  { label: "Today's Orders", value: '48', trend: '+12%', dir: 'up', Icon: BagIcon },
  { label: 'Revenue', value: '₹12,840', trend: '+8%', dir: 'up', Icon: RupeeIcon },
  { label: 'Active Customers', value: '126', trend: '+5%', dir: 'up', Icon: UsersIcon },
  { label: 'Pending Pickups', value: '9', trend: '-3%', dir: 'down', Icon: TruckIcon },
]

const RECENT = [
  { id: '#HL-7841', customer: 'Aarav Sharma', amount: '₹420', status: 'pending' },
  { id: '#HL-7840', customer: 'Priya Nair', amount: '₹1,180', status: 'progress' },
  { id: '#HL-7839', customer: 'Rohan Verma', amount: '₹640', status: 'completed' },
  { id: '#HL-7838', customer: 'Sneha Iyer', amount: '₹320', status: 'completed' },
  { id: '#HL-7837', customer: 'Kabir Singh', amount: '₹980', status: 'cancelled' },
]

const ACTIVITY = [
  { dot: 'var(--success)', title: 'Order #HL-7840 marked completed', time: '2 min ago' },
  { dot: 'var(--primary)', title: 'New pickup scheduled for Aarav', time: '14 min ago' },
  { dot: 'var(--warning)', title: 'Payment received ₹1,180', time: '38 min ago' },
  { dot: 'var(--danger)', title: 'Order #HL-7837 cancelled', time: '1 hr ago' },
]

const STATUS_LABEL = {
  pending: 'Pending',
  progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, here's how your store is doing today.</p>
        </div>
        <button type="button" className="primary-button" onClick={() => navigate('/orders')}>
          View Orders
        </button>
      </div>

      <div className="stat-grid">
        {STATS.map(({ label, value, trend, dir, Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-top">
              <div className="stat-icon"><Icon /></div>
              <span className={`stat-trend ${dir}`}>{trend}</span>
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-grid">
        <div className="table-card">
          <div className="table-toolbar">
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Recent Orders</h2>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">{order.customer[0]}</div>
                        {order.customer}
                      </div>
                    </td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`status-pill status-${order.status}`}>
                        {STATUS_LABEL[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Activity</h2>
          </div>
          <div className="activity-list">
            {ACTIVITY.map((item, index) => (
              <div className="activity-item" key={index}>
                <span className="activity-dot" style={{ background: item.dot }} />
                <div className="activity-body">
                  <strong>{item.title}</strong>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
