import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import SignInPage from './pages/SignInPage.jsx'
import ShopkeeperLayout from './components/ShopkeeperLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import './index.css'

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--text)',
        fontSize: '16px'
      }}>
        Loading...
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return children
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <ShopkeeperLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
