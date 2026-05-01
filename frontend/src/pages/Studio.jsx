import { useState } from 'react'
import { Mic, Upload, Copy, Music, Play, Save, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Tabs from '../components/ui/Tabs'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input, { Textarea, Select } from '../components/ui/Input'
import AudioPlayer from '../components/shared/AudioPlayer'
import VoiceCard from '../components/shared/VoiceCard'
import { useAudioStore } from '../store/useAudioStore'
import { useAppStore } from '../store/useAppStore'
import { useAudioVoices } from '../hooks/useAudio'

const VOICES = [
  { id: 'marcos', name: 'Marcos', gender: 'M', description: 'Grave e profissional' },
  { id: 'carlos', name: 'Carlos', gender: 'M', description: 'Energética e dinâmica' },
  { id: 'pedro', name: 'Pedro', gender: 'M', description: 'Amigável e calorosa' },
  { id: 'ana', name: 'Ana', gender: 'F', description: 'Suave e elegante' },
  { id: 'julia', name: 'Julia', gender: 'F', description: 'Jovem e vibrante' },
  { id: 'mariana', name: 'Mariana', gender: 'F', description: 'Madura e confiável' },
]

const MUSIC_STYLES = [
  { value: 'upbeat', label: 'Animada' },
  { value: 'calm', label: 'Calma' },
  { value: 'rock', label: 'Rock' },
  { value: 'pop', label: 'Pop' },
  { value: 'electronic', label: 'Eletrônica' },
  { value: 'classical', label: 'Clássica' },
]

export default function Studio() {
  const [selectedVoice, setSelectedVoice] = useState('marcos')
  const [ttsData, setTtsData] = useState({
    text: '',
    speed: 1,
    pitch: 1,
    voiceVol: 0.8,
    musicVol: 0.3,
    fadeIn: 0.5,
    fadeOut: 0.5,
    musicStyle: 'upbeat',
  })
  const [generatedAudio, setGeneratedAudio] = useState(null)

  const { generateTTS, generatingTTS } = useAudioStore()
  const { clients } = useAppStore()
  const { voices } = useAudioVoices()

  const handleGenerateTTS = async () => {
    if (!ttsData.text) {
      toast.error('Digite o texto da locução')
      return
    }

    const result = await generateTTS({
      text: ttsData.text,
      voice: selectedVoice,
      speed: ttsData.speed,
      pitch: ttsData.pitch,
      musicStyle: ttsData.musicStyle,
      voiceVol: ttsData.voiceVol,
      musicVol: ttsData.musicVol,
      fadeIn: ttsData.fadeIn,
      fadeOut: ttsData.fadeOut,
    })

    if (result.success) {
      setGeneratedAudio(result.filename)
      toast.success('Locução gerada com sucesso!')
    } else {
      toast.error(result.error)
    }
  }

  const tabs = [
    {
      id: 'tts',
      label: 'Texto → Fala',
      icon: Mic,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Text and Settings */}
            <div className="space-y-4">
              <Textarea
                label="Texto da Locução"
                placeholder="Digite o texto que será convertido em áudio..."
                rows={6}
                value={ttsData.text}
                onChange={(e) => setTtsData({ ...ttsData, text: e.target.value })}
              />
              <p className="text-sm text-gray-400">
                {ttsData.text.length} caracteres • ~{Math.ceil(ttsData.text.length / 15)}s estimados
              </p>

              <Select
                label="Cliente (opcional)"
                options={clients.map((c) => ({ value: c.id, label: c.name }))}
              />

              <Input label="Título da Locução" placeholder="Ex: Promoção da Semana" />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Velocidade"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="2"
                  value={ttsData.speed}
                  onChange={(e) => setTtsData({ ...ttsData, speed: parseFloat(e.target.value) })}
                />
                <Input
                  label="Pitch"
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="2"
                  value={ttsData.pitch}
                  onChange={(e) => setTtsData({ ...ttsData, pitch: parseFloat(e.target.value) })}
                />
              </div>

              <Select
                label="Estilo Musical"
                options={MUSIC_STYLES}
                value={ttsData.musicStyle}
                onChange={(e) => setTtsData({ ...ttsData, musicStyle: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Volume Voz"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ttsData.voiceVol}
                  onChange={(e) => setTtsData({ ...ttsData, voiceVol: parseFloat(e.target.value) })}
                />
                <Input
                  label="Volume Música"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ttsData.musicVol}
                  onChange={(e) => setTtsData({ ...ttsData, musicVol: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            {/* Right: Voice Selection */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-lg">Selecionar Voz</h4>
              <div className="grid grid-cols-1 gap-3">
                {VOICES.map((voice) => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    isSelected={selectedVoice === voice.id}
                    onSelect={(v) => setSelectedVoice(v.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleGenerateTTS} loading={generatingTTS} className="flex-1">
              <Mic className="w-5 h-5 mr-2" />
              Gerar Locução
            </Button>
          </div>

          {generatedAudio && (
            <div className="space-y-4">
              <AudioPlayer filename={generatedAudio} />
              <div className="flex gap-4">
                <Button variant="secondary">
                  <Save className="w-5 h-5 mr-2" />
                  Salvar na Biblioteca
                </Button>
                <Button variant="outline">
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'upload',
      label: 'Upload & Editar',
      icon: Upload,
      content: <UploadTab />,
    },
    {
      id: 'clone',
      label: 'Clone de Voz',
      icon: Copy,
      content: <CloneTab />,
    },
    {
      id: 'mixer',
      label: 'Mixer',
      icon: Music,
      content: <MixerTab />,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <Tabs tabs={tabs} />
      </Card>
    </div>
  )
}

function UploadTab() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type.startsWith('audio/')) {
      setFile(droppedFile)
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-surface-200 rounded-xl p-12 text-center hover:border-accent transition-colors"
      >
        <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
        <p className="text-lg font-medium text-white mb-2">Arraste seu arquivo de áudio</p>
        <p className="text-sm text-gray-400 mb-4">MP3, WAV, M4A até 50MB</p>
        <Button variant="secondary" onClick={() => document.getElementById('file-input').click()}>
          Selecionar Arquivo
        </Button>
        <input id="file-input" type="file" accept="audio/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      {file && (
        <>
          <Textarea
            label="Prompt de Modificação (IA)"
            placeholder="Descreva como quer modificar o áudio..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button className="w-full">
            <Play className="w-5 h-5 mr-2" />
            Processar Áudio
          </Button>
        </>
      )}
    </div>
  )
}

function CloneTab() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [cloning, setCloning] = useState(false)

  return (
    <div className="space-y-6">
      <Input
        label="URL do YouTube"
        placeholder="https://youtube.com/watch?v=..."
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />
      <Button loading={cloning} className="w-full">
        <Copy className="w-5 h-5 mr-2" />
        Extrair e Clonar Voz
      </Button>
    </div>
  )
}

function MixerTab() {
  const [mixData, setMixData] = useState({
    voiceVol: 0.8,
    musicVol: 0.3,
    fadeIn: 0.5,
    fadeOut: 0.5,
    duration: 30,
  })
  const [mixing, setMixing] = useState(false)

  return (
    <div className="space-y-6">
      <Select label="Locução" options={[]} placeholder="Selecione da biblioteca" />
      <Input label="Música de Fundo" placeholder="URL YouTube ou upload" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Volume Locução" type="range" min="0" max="1" step="0.1" value={mixData.voiceVol} onChange={(e) => setMixData({ ...mixData, voiceVol: e.target.value })} />
        <Input label="Volume Música" type="range" min="0" max="1" step="0.1" value={mixData.musicVol} onChange={(e) => setMixData({ ...mixData, musicVol: e.target.value })} />
      </div>
      <Button loading={mixing} className="w-full">
        <Music className="w-5 h-5 mr-2" />
        Gerar Mix
      </Button>
    </div>
  )
}