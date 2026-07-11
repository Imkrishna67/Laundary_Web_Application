import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
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
  const { signOut } = useClerk()
  const { user } = useUser()
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('English')
  const [toast, setToast] = useState({ show: false, text: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editMobile, setEditMobile] = useState('')
  const [editEmail, setEditEmail] = useState('')

  function getStoredUser() {
    try {
      const stored = localStorage.getItem('hexalaundaryUser')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  const storedUser = getStoredUser()

  // Clerk se real data lo, fallback localStorage se
  const fullName = user?.fullName || storedUser.fullName || 'User'
  const mobile = storedUser.mobile || ''
  const email = user?.primaryEmailAddress?.emailAddress || storedUser.email || storedUser.identifier || ''

  function getInitials(name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  function showToast(text) {
    setToast({ show: true, text })
    setTimeout(() => setToast({ show: false, text: '' }), 3000)
  }

  function startEdit() {
    setEditName(fullName === 'User' ? '' : fullName)
    setEditMobile(mobile)
    setEditEmail(email === storedUser.identifier ? '' : email)
    setIsEditing(true)
  }

  function saveProfile() {
    const trimmedName = editName.trim()
    const trimmedMobile = editMobile.replace(/\D/g, '')
    const trimmedEmail = editEmail.trim().toLowerCase()

    if (!trimmedName) {
      showToast('Please enter your name.')
      return
    }

    if (trimmedMobile && !/^[6-9]\d{9}$/.test(trimmedMobile)) {
      showToast('Enter a valid 10-digit mobile number.')
      return
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      showToast('Enter a valid email address.')
      return
    }

    const updatedUser = {
      ...storedUser,
      fullName: trimmedName,
      mobile: trimmedMobile,
      email: trimmedEmail || storedUser.identifier || '',
    }

    localStorage.setItem('hexalaundaryUser', JSON.stringify(updatedUser))
    setIsEditing(false)
    showToast('Profile updated successfully.')
    setTimeout(() => window.location.reload(), 500)
  }

  function handlePaymentMethods() {
    showToast('Payment methods will be available soon.')
  }

  function handleHelpSupport() {
    showToast('Support: +91 1800-123-4567 | support@hexalaundary.in')
  }

  function handleLogout() {
    localStorage.removeItem('hexalaundaryUser')
    localStorage.removeItem('hexalaundaryLastOrder')
    localStorage.removeItem('hexalaundaryTheme')
    showToast('Logged out successfully.')
    setTimeout(() => {
      signOut(() => navigate('/'))
    }, 1000)
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
        <div className="profile-avatar">{getInitials(fullName)}</div>
        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                className="edit-input"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Full Name"
              />
              <input
                className="edit-input"
                type="tel"
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Mobile Number"
                maxLength={10}
              />
              <input
                className="edit-input"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email"
              />
            </>
          ) : (
            <>
              <h2>{fullName}</h2>
              {mobile ? <p>+91 {mobile}</p> : null}
              <p>{email}</p>
            </>
          )}
        </div>
        {isEditing ? (
          <div className="edit-actions">
            <button type="button" className="edit-profile-button save" onClick={saveProfile}>Save</button>
            <button type="button" className="edit-profile-button cancel" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <button type="button" className="edit-profile-button" onClick={startEdit}>
            Edit Profile
          </button>
        )}
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