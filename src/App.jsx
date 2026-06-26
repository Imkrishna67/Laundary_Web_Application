import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import BottomNav from './components/BottomNav.jsx'
import './index.css'

function App() {
  const location = useLocation()
  const hideNavPaths = ['/', '/register']
  const shouldShowNav = !hideNavPaths.includes(location.pathname)

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/services" element={<ServiceSelectionPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/order-history/:id" element={<OrderHistoryPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {shouldShowNav && <BottomNav />}
    </ThemeProvider>
  )
}

export default App
