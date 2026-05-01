import { useEffect, useState } from 'react'
import api from '../services/api'

export function useFinance(filters = {}) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPayments = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await api.get(`/payments?${params}`)
      setPayments(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [JSON.stringify(filters)])

  return { payments, loading, error, refetch: fetchPayments }
}

export function useRevenueChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: response } = await api.get('/dashboard/revenue-chart')
      setData(response.data)
    } catch (err) {
      console.error('Erro ao buscar gráfico:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading }
}