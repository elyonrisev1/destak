import { useEffect, useState } from 'react'
import api from '../services/api'

export function useClients(filters = {}) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchClients = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await api.get(`/clients?${params}`)
      setClients(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [JSON.stringify(filters)])

  return { clients, loading, error, refetch: fetchClients }
}

export function useClient(id) {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchClient = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get(`/clients/${id}`)
        setClient(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [id])

  return { client, loading, error }
}