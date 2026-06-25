import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../profile.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfilePage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('English')
  const [toast, setToast] = useState({ show: false, text: '' })

  function showToast(text) {
    setToast({ show: true, text })
    setTimeout(() => setToast({ show: false, text: '' }), 3000)
  }

  function handleEditProfile() {
    showToast('Profile editing coming in next update.')
  }

  function handlePaymentMethods() {
    showToast('Payment methods will be available soon.')
  }

  function handleHelpSupport() {
    showToast('Support: +91 1800-123-4567 | support@quickwash.in')
  }

  function handleLogout() {
    localStorage.removeItem('quickwashUser')
    showToast('Logged out successfully.')
    setTimeout(() => navigate('/'), 1000)
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <button type="button" className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
          <BackIcon />
        </button>
        <h1>Profile</h1>
      </header>

      {toast.show && (
        <div className="profile-toast" role="status">{toast.text}</div>
      )}

      <section className="profile-card">
        <div className="profile-avatar">JD</div>
        <div className="profile-info">
          <h2>John Doe</h2>
          <p>+91 98765 43210</p>
          <p>john.doe@example.com</p>
        </div>
        <button type="button" className="edit-profile-button" onClick={handleEditProfile}>
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

        <button type="button" className="menu-item" onClick={handlePaymentMethods}>
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
        <button type="button" className="menu-item" onClick={handleHelpSupport}>
          <span className="menu-icon">❓</span>
          <span className="menu-text">Help & Support</span>
          <span className="menu-arrow">›</span>
        </button>

        <button type="button" className="menu-item logout" onClick={handleLogout}>
          <span className="menu-icon">🚪</span>
          <span className="menu-text">Logout</span>
        </button>
      </section>
    </main>
  )
}

export default ProfilePage
