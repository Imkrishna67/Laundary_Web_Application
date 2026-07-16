import { useUser } from '@clerk/clerk-react'
import '../panel.css'

function ProfilePage() {
  const { user } = useUser()

  const name = user?.fullName || user?.username || 'Shopkeeper'
  const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '—'

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p>Your shopkeeper account details.</p>
        </div>
      </div>

      <div className="panel-grid">
        <div className="card">
          <div className="card-head">
            <h2>Account Details</h2>
            <button type="button" className="secondary-button">Edit</button>
          </div>

          <div className="form-row">
            <label htmlFor="name">Full Name</label>
            <input id="name" value={name} readOnly />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" value={email} readOnly />
          </div>
          <div className="form-row">
            <label htmlFor="store">Store Name</label>
            <input id="store" value="Hexa Laundary · MG Road" readOnly />
          </div>
          <div className="form-row">
            <label htmlFor="role">Role</label>
            <input id="role" value="Store Partner" readOnly />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>This Month</h2>
          </div>
          <div className="activity-list">
            <div className="toggle-row">
              <div className="label-block">
                <strong>Orders Handled</strong>
                <span>312 this month</span>
              </div>
            </div>
            <div className="toggle-row">
              <div className="label-block">
                <strong>Revenue Generated</strong>
                <span>₹84,560</span>
              </div>
            </div>
            <div className="toggle-row">
              <div className="label-block">
                <strong>Avg. Rating</strong>
                <span>4.8 / 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
