import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Mic2,
  Library,
  Users,
  Calendar,
  DollarSign,
  FileText,
  BarChart3,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '../../utils/helpers'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Estúdio', to: '/studio', icon: Mic2 },
  { name: 'Biblioteca', to: '/library', icon: Library },
  { name: 'Clientes', to: '/clients', icon: Users },
  { name: 'Agendamentos', to: '/schedule', icon: Calendar },
  { name: 'Financeiro', to: '/finance', icon: DollarSign },
  { name: 'NF-e', to: '/nfe', icon: FileText },
  { name: 'Relatórios', to: '/reports', icon: BarChart3 },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface-100 rounded-lg border border-surface-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-surface-50 border-r border-surface-200 z-40',
          'transform transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-surface-200">
          <h1 className="text-2xl font-display font-bold text-accent">
            Destak
          </h1>
          <p className="text-xs text-gray-400 mt-1">Publicidade</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-accent text-background font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-surface-100'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-semibold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">admin@destak.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}