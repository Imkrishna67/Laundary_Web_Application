import { Link } from 'react-router-dom'
import '../App.css'

function OrdersPage() {
  return (
    <main className="placeholder-page">
      <section className="placeholder-card" aria-labelledby="orders-title">
        <Link to="/address" className="back-link">
          ← Back to Address
        </Link>
        <h1 id="orders-title">Order Review</h1>
        <p>Order review page will be added next in the QuickWash flow.</p>
      </section>
    </main>
  )
}

export default OrdersPage
