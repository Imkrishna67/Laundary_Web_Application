import '../panel.css'

const CUSTOMERS = [
  { name: 'Aarav Sharma', phone: '+91 98765 43210', orders: 14, spent: '₹6,420', since: 'Mar 2025' },
  { name: 'Priya Nair', phone: '+91 98200 11223', orders: 22, spent: '₹11,980', since: 'Jan 2025' },
  { name: 'Rohan Verma', phone: '+91 99112 33445', orders: 8, spent: '₹3,240', since: 'Apr 2025' },
  { name: 'Sneha Iyer', phone: '+91 98451 66778', orders: 31, spent: '₹15,120', since: 'Dec 2024' },
  { name: 'Kabir Singh', phone: '+91 97654 88990', orders: 3, spent: '₹1,260', since: 'Jun 2025' },
  { name: 'Meera Das', phone: '+91 97001 22334', orders: 11, spent: '₹5,560', since: 'Feb 2025' },
]

function CustomersPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Customers</h1>
          <p>Your store's regulars and their order history.</p>
        </div>
        <button type="button" className="primary-button">+ Add Customer</button>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Customer Since</th>
              </tr>
            </thead>
            <tbody>
              {CUSTOMERS.map((customer) => (
                <tr key={customer.phone}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">{customer.name[0]}</div>
                      <strong>{customer.name}</strong>
                    </div>
                  </td>
                  <td>{customer.phone}</td>
                  <td>{customer.orders}</td>
                  <td>{customer.spent}</td>
                  <td>{customer.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomersPage
