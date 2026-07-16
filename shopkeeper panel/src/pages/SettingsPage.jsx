import { useState } from 'react'
import '../panel.css'

function SettingsPage() {
  const [storeName, setStoreName] = useState('Hexa Laundary · MG Road')
  const [phone, setPhone] = useState('+91 98765 00000')
  const [autoAssign, setAutoAssign] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Configure your store and notification preferences.</p>
        </div>
        <button type="button" className="primary-button">Save Changes</button>
      </div>

      <div className="panel-grid">
        <div className="card">
          <div className="card-head">
            <h2>Store Information</h2>
          </div>
          <div className="form-row">
            <label htmlFor="store-name">Store Name</label>
            <input id="store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="store-phone">Contact Number</label>
            <input id="store-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="store-address">Address</label>
            <input id="store-address" defaultValue="12 MG Road, Bengaluru, Karnataka 560001" />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Preferences</h2>
          </div>
          <div className="toggle-row">
            <div className="label-block">
              <strong>Auto-assign pickups</strong>
              <span>Automatically assign new orders to riders</span>
            </div>
            <button
              type="button"
              className={`switch ${autoAssign ? 'on' : ''}`}
              aria-pressed={autoAssign}
              aria-label="Auto-assign pickups"
              onClick={() => setAutoAssign((v) => !v)}
            />
          </div>
          <div className="toggle-row">
            <div className="label-block">
              <strong>SMS Alerts</strong>
              <span>Get notified for new orders via SMS</span>
            </div>
            <button
              type="button"
              className={`switch ${smsAlerts ? 'on' : ''}`}
              aria-pressed={smsAlerts}
              aria-label="SMS alerts"
              onClick={() => setSmsAlerts((v) => !v)}
            />
          </div>
          <div className="toggle-row">
            <div className="label-block">
              <strong>Default Dark Mode</strong>
              <span>Open the panel in dark theme</span>
            </div>
            <button
              type="button"
              className={`switch ${darkMode ? 'on' : ''}`}
              aria-pressed={darkMode}
              aria-label="Default dark mode"
              onClick={() => setDarkMode((v) => !v)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
