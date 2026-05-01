import { useEffect, useState } from 'react'
import api from '../services/api'

export function useSchedule(filters = {}) {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSchedules = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await api.get(`/schedules?${params}`)
      setSchedules(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [JSON.stringify(filters)])

  return { schedules, loading, error, refetch: fetchSchedules }
}

export function useScheduleMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/dashboard/metrics')
      setMetrics(data.data)
    } catch (err) {
      console.error('Erro ao buscar métricas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  return { metrics, loading, refetch: fetchMetrics }
}