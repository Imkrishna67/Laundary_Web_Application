import { useState } from 'react'
import '../panel.css'

const ORDERS = [
  { id: '#HL-7841', customer: 'Aarav Sharma', service: 'Wash & Fold', amount: '₹420', date: '14 Jul', status: 'pending' },
  { id: '#HL-7840', customer: 'Priya Nair', service: 'Dry Clean', amount: '₹1,180', date: '14 Jul', status: 'progress' },
  { id: '#HL-7839', customer: 'Rohan Verma', service: 'Ironing', amount: '₹640', date: '13 Jul', status: 'completed' },
  { id: '#HL-7838', customer: 'Sneha Iyer', service: 'Wash & Fold', amount: '₹320', date: '13 Jul', status: 'completed' },
  { id: '#HL-7837', customer: 'Kabir Singh', service: 'Dry Clean', amount: '₹980', date: '13 Jul', status: 'cancelled' },
  { id: '#HL-7836', customer: 'Meera Das', service: 'Premium Wash', amount: '₹560', date: '12 Jul', status: 'progress' },
  { id: '#HL-7835', customer: 'Arjun Rao', service: 'Ironing', amount: '₹280', date: '12 Jul', status: 'completed' },
]

const STATUS_LABEL = {
  pending: 'Pending',
  progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const FILTERS = ['all', 'pending', 'progress', 'completed', 'cancelled']

function OrdersPage() {
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all' ? ORDERS : ORDERS.filter((o) => o.status === filter)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders, pickups and deliveries.</p>
        </div>
        <button type="button" className="primary-button">+ New Order</button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <select
            className="filter-select"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter by status"
          >
            {FILTERS.map((f) => (
              <option key={f} value={f}>
                {f === 'all' ? 'All Orders' : STATUS_LABEL[f]}
              </option>
            ))}
          </select>
          <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
            {visible.length} order{visible.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">{order.customer[0]}</div>
                      {order.customer}
                    </div>
                  </td>
                  <td>{order.service}</td>
                  <td>{order.amount}</td>
                  <td>{order.date}</td>
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
    </div>
  )
}

export default OrdersPage
