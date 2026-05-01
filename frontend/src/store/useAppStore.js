import { create } from 'zustand'
import api from '../services/api'

export const useAppStore = create((set, get) => ({
  // Clients
  clients: [],
  selectedClient: null,
  loadingClients: false,

  fetchClients: async (filters = {}) => {
    set({ loadingClients: true })
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await api.get(`/clients?${params}`)
      set({ clients: data.data, loadingClients: false })
    } catch (error) {
      set({ loadingClients: false })
      console.error('Erro ao buscar clientes:', error)
    }
  },

  setSelectedClient: (client) => set({ selectedClient: client }),

  // Schedules
  schedules: [],
  loadingSchedules: false,

  fetchSchedules: async (filters = {}) => {
    set({ loadingSchedules: true })
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await api.get(`/schedules?${params}`)
      set({ schedules: data.data, loadingSchedules: false })
    } catch (error) {
      set({ loadingSchedules: false })
      console.error('Erro ao buscar agendamentos:', error)
    }
  },

  // Payments
  payments: [],
  loadingPayments: false,

  fetchPayments: async (filters = {}) => {
    set({ loadingPayments: true })
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await api.get(`/payments?${params}`)
      set({ payments: data.data, loadingPayments: false })
    } catch (error) {
      set({ loadingPayments: false })
      console.error('Erro ao buscar pagamentos:', error)
    }
  },

  // Locutions
  locutions: [],
  loadingLocutions: false,

  fetchLocutions: async (filters = {}) => {
    set({ loadingLocutions: true })
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await api.get(`/locutions?${params}`)
      set({ locutions: data.data, loadingLocutions: false })
    } catch (error) {
      set({ loadingLocutions: false })
      console.error('Erro ao buscar locuções:', error)
    }
  },

  // Dashboard metrics
  dashboardMetrics: null,

  fetchDashboardMetrics: async () => {
    try {
      const { data } = await api.get('/dashboard/metrics')
      set({ dashboardMetrics: data.data })
    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
    }
  },
}))