import { useEffect, useState } from 'react'
import audioApi from '../services/audioApi'

export function useAudioVoices() {
  const [voices, setVoices] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchVoices = async () => {
    setLoading(true)
    try {
      const { data } = await audioApi.get('/audio/tts/voices')
      setVoices(data.data?.voices || [])
    } catch (err) {
      console.error('Erro ao buscar vozes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVoices()
  }, [])

  return { voices, loading, refetch: fetchVoices }
}

export function useAudioFile(filename) {
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!filename) return

    setLoading(true)
    const url = `${import.meta.env.VITE_AUDIO_API_URL || 'http://localhost:8000'}/audio/files/${filename}`
    setUrl(url)
    setLoading(false)
  }, [filename])

  return { url, loading }
}