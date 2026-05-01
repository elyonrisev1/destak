import { useState } from 'react'
import { Search, Filter, Play, Trash2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import AudioPlayer from '../components/shared/AudioPlayer'
import { useAppStore } from '../store/useAppStore'
import { formatDate } from '../utils/helpers'

export default function Library() {
  const { locutions, loadingLocutions, fetchLocutions } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [selectedLocution, setSelectedLocution] = useState(null)

  const filteredLocutions = locutions.filter((loc) => {
    const matchesSearch = loc.title.toLowerCase().includes(search.toLowerCase())
    const matchesType = !filterType || loc.type === filterType
    return matchesSearch && matchesType
  })

  const typeLabels = {
    tts: 'TTS',
    upload: 'Upload',
    clone: 'Clone',
    mix: 'Mix',
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar locuções..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-surface-100 border border-surface-200 rounded-lg text-white focus:outline-none focus:border-accent"
          >
            <option value="">Todos os tipos</option>
            <option value="tts">TTS</option>
            <option value="upload">Upload</option>
            <option value="clone">Clone</option>
            <option value="mix">Mix</option>
          </select>
        </div>
      </Card>

      {/* Library Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLocutions.map((locution) => (
          <Card key={locution.id} className="hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-display font-semibold text-lg text-white">
                  {locution.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {locution.client?.name || 'Sem cliente'}
                </p>
              </div>
              <Badge variant="accent">{typeLabels[locution.type]}</Badge>
            </div>

            {locution.text && (
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{locution.text}</p>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Badge>{locution.duration}s</Badge>
              {locution.musicStyle && (
                <Badge variant="info">{locution.musicStyle}</Badge>
              )}
              <Badge variant="gray">{formatDate(locution.createdAt)}</Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedLocution(locution)}
              >
                <Play className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  toast.success('Locução removida')
                  fetchLocutions()
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredLocutions.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-400">Nenhuma locução encontrada</p>
        </Card>
      )}

      {/* Player Modal */}
      {selectedLocution && (
        <Card className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold">{selectedLocution.title}</h4>
            <button onClick={() => setSelectedLocution(null)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          <AudioPlayer filename={selectedLocution.fileUrl} />
        </Card>
      )}
    </div>
  )
}