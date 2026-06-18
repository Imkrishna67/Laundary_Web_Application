import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../profile.css'

function ProfilePage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('English')

  return (
    <main className="profile-page">
      <header className="profile-header">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>Profile</h1>
      </header>

      <section className="profile-card">
        <div className="profile-avatar">JD</div>
        <div className="profile-info">
          <h2>John Doe</h2>
          <p>+91 98765 43210</p>
          <p>john.doe@example.com</p>
        </div>
        <button type="button" className="edit-profile-button" onClick={() => alert('Edit Profile feature coming soon')}>
          Edit Profile
        </button>
      </section>

      <section className="menu-section">
        <button type="button" className="menu-item" onClick={() => navigate('/address')}>
          <span className="menu-icon">📍</span>
          <span className="menu-text">Saved Addresses</span>
          <span className="menu-arrow">›</span>
        </button>

        <button type="button" className="menu-item" onClick={() => navigate('/order-history')}>
          <span className="menu-icon">📦</span>
          <span className="menu-text">Order History</span>
          <span className="menu-arrow">›</span>
        </button>

        <button type="button" className="menu-item" onClick={() => alert('Payment Methods feature coming soon')}>
          <span className="menu-icon">💳</span>
          <span className="menu-text">Payment Methods</span>
          <span className="menu-arrow">›</span>
        </button>
      </section>

      <section className="settings-section">
        <h3>Settings</h3>

        <div className="setting-item">
          <div className="setting-left">
            <span className="setting-icon">🔔</span>
            <span className="setting-text">Notifications</span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item" onClick={() => setLanguage(language === 'English' ? 'हिंदी' : 'English')}>
          <div className="setting-left">
            <span className="setting-icon">🌐</span>
            <span className="setting-text">Language</span>
          </div>
          <span className="setting-value">{language}</span>
        </div>
      </section>

      <section className="menu-section">
        <button type="button" className="menu-item" onClick={() => alert('Help & Support: +91 1800-123-4567\nEmail: support@quickwash.in')}>
          <span className="menu-icon">❓</span>
          <span className="menu-text">Help & Support</span>
          <span className="menu-arrow">›</span>
        </button>

        <button type="button" className="menu-item logout" onClick={() => navigate('/')}>
          <span className="menu-icon">🚪</span>
          <span className="menu-text">Logout</span>
        </button>
      </section>
    </main>
  )
}

export default ProfilePage
