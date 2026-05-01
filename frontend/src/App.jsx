import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Studio from './pages/Studio'
import Library from './pages/Library'
import Clients from './pages/Clients'
import Schedule from './pages/Schedule'
import Finance from './pages/Finance'
import NFe from './pages/NFe'
import Reports from './pages/Reports'

function App() {
  const { isAuthenticated, token } = useAuthStore()

  // Se não tem token, mostra login
  if (!token) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/library" element={<Library />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/nfe" element={<NFe />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App