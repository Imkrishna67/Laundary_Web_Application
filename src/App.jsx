import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import AddressPage from './pages/AddressPage.jsx'
import CartPage from './pages/CartPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx'
import OrderHistoryPage from './pages/OrderHistoryPage.jsx'
import OrderTrackingPage from './pages/OrderTrackingPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import ServiceSelectionPage from './pages/ServiceSelectionPage.jsx'
import VerifyEmailPage from './pages/VerifyEmailPage.jsx'
import SSOCallback from './pages/SSOCallback.jsx'
import BottomNav from './components/BottomNav.jsx'
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
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const location = useLocation()
  const hideNavPaths = ['/', '/register', '/verify-email', '/sso-callback']
  const shouldShowNav = !hideNavPaths.includes(location.pathname)

  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/sso-callback" element={<SSOCallback />} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute><ServiceSelectionPage /></ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute><CartPage /></ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute><SchedulePage /></ProtectedRoute>
        } />
        <Route path="/address" element={
          <ProtectedRoute><AddressPage /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/order-confirmation" element={
          <ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>
        } />
        <Route path="/track-order" element={
          <ProtectedRoute><OrderTrackingPage /></ProtectedRoute>
        } />
        <Route path="/order-history/:id" element={
          <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
        } />
        <Route path="/order-history" element={
          <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {shouldShowNav && <BottomNav />}
    </ThemeProvider>
  )
}

export default App