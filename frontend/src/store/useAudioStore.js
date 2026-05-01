import { create } from 'zustand'
import audioApi from '../services/audioApi'

export const useAudioStore = create((set, get) => ({
  // TTS
  generatingTTS: false,
  ttsResult: null,

  generateTTS: async (data) => {
    set({ generatingTTS: true })
    try {
      const { data: response } = await audioApi.post('/audio/tts/generate', data)
      set({ ttsResult: response.data, generatingTTS: false })
      return { success: true, filename: response.filename }
    } catch (error) {
      set({ generatingTTS: false })
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao gerar TTS',
      }
    }
  },

  // Upload processing
  processingUpload: false,
  uploadResult: null,

  processUpload: async (file, options) => {
    set({ processingUpload: true })
    try {
      const formData = new FormData()
      formData.append('file', file)
      Object.entries(options || {}).forEach(([key, value]) => {
        formData.append(key, value)
      })
      const { data } = await audioApi.post('/audio/upload/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      set({ uploadResult: data.data, processingUpload: false })
      return { success: true, filename: data.filename }
    } catch (error) {
      set({ processingUpload: false })
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao processar áudio',
      }
    }
  },

  // Voice clone
  cloningVoice: false,
  cloneResult: null,
  clonedVoices: [],

  extractYouTube: async (youtubeUrl) => {
    set({ cloningVoice: true })
    try {
      const { data } = await audioApi.post('/audio/clone/extract-yt', { youtubeUrl })
      set({ cloneResult: data.data, cloningVoice: false })
      return { success: true, filename: data.filename }
    } catch (error) {
      set({ cloningVoice: false })
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao extrair áudio',
      }
    }
  },

  generateClone: async (text, cloneId, similarity = 0.8) => {
    set({ cloningVoice: true })
    try {
      const { data } = await audioApi.post('/audio/clone/generate', {
        text,
        cloneId,
        similarity,
      })
      set({ cloneResult: data.data, cloningVoice: false })
      return { success: true, filename: data.filename }
    } catch (error) {
      set({ cloningVoice: false })
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao gerar clone',
      }
    }
  },

  // Mixer
  mixingAudio: false,
  mixResult: null,

  generateMix: async (data) => {
    set({ mixingAudio: true })
    try {
      const { data: response } = await audioApi.post('/audio/mix/generate', data)
      set({ mixResult: response.data, mixingAudio: false })
      return { success: true, filename: response.filename }
    } catch (error) {
      set({ mixingAudio: false })
      return {
        success: false,
        error: error.response?.data?.detail || 'Erro ao mixar áudio',
      }
    }
  },

  // Available voices
  availableVoices: [],

  fetchAvailableVoices: async () => {
    try {
      const { data } = await audioApi.get('/audio/tts/voices')
      set({ availableVoices: data.data?.voices || [] })
    } catch (error) {
      console.error('Erro ao buscar vozes:', error)
    }
  },

  // Current playing
  currentAudio: null,
  isPlaying: false,

  setCurrentAudio: (audio) => set({ currentAudio: audio, isPlaying: false }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}))