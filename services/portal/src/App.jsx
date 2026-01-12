import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Docs from './pages/Docs'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import DashboardOverview from './pages/dashboard/Overview'
import ApiKeys from './pages/dashboard/ApiKeys'
import Blacklist from './pages/dashboard/Blacklist'
import Usage from './pages/dashboard/Usage'
import Settings from './pages/dashboard/Settings'
import GettingStarted from './pages/GettingStarted'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminKeys from './pages/admin/AdminKeys'
import AdminBlacklist from './pages/admin/AdminBlacklist'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminAuditLogs from './pages/admin/AdminAuditLogs'

// Layout untuk halaman publik (dengan Navbar dan Footer)
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// Layout untuk halaman autentikasi (tanpa Navbar dan Footer)
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  )
}

function App() {
  const location = useLocation()
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname)
  const isDashboard = location.pathname.startsWith('/dashboard')
  const isAdmin = location.pathname.startsWith('/admin')

  // Halaman Admin menggunakan layout Dashboard
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="keys" element={<AdminKeys />} />
          <Route path="blacklist" element={<AdminBlacklist />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>
      </Routes>
    )
  }

  // Halaman Dashboard memiliki layout sendiri
  if (isDashboard) {
    return (
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="blacklist" element={<Blacklist />} />
          <Route path="usage" element={<Usage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    )
  }

  // Halaman Login/Register tanpa Navbar dan Footer
  if (isAuthPage) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AuthLayout>
    )
  }

  // Halaman publik dengan Navbar dan Footer
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/getting-started" element={<GettingStarted />} />
      </Routes>
    </PublicLayout>
  )
}

export default App
