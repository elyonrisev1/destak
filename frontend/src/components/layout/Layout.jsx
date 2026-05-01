import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useAppStore } from '../../store/useAppStore'

const pageTitles = {
  '/': 'Dashboard',
  '/studio': 'Estúdio de Locução',
  '/library': 'Biblioteca de Áudio',
  '/clients': 'Clientes',
  '/schedule': 'Agendamentos',
  '/finance': 'Financeiro',
  '/nfe': 'Nota Fiscal',
  '/reports': 'Relatórios',
}

export default function Layout({ children }) {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const { fetchClients, fetchSchedules, fetchPayments, fetchLocutions, fetchDashboardMetrics } = useAppStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchClients()
      fetchSchedules()
      fetchPayments()
      fetchLocutions()
      fetchDashboardMetrics()
    }
  }, [isAuthenticated])

  const title = pageTitles[location.pathname] || 'Destak Publicidade'

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        <Topbar title={title} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}