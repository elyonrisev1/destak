import axios from 'axios'

const AUDIO_API_URL = import.meta.env.VITE_AUDIO_API_URL || 'http://localhost:8000'

const audioApi = axios.create({
  baseURL: AUDIO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para multipart/form-data
audioApi.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  return config
})

export default audioApi