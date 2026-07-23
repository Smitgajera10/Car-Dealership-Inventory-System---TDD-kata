import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LandingPage from './pages/LandingPage'
import CatalogPage from './pages/CatalogPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CatalogPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
