import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input, { Select, Textarea } from '../components/ui/Input'
import { useSchedule } from '../hooks/useSchedule'
import { useAppStore } from '../store/useAppStore'
import { formatDate, formatCurrency, getStatusColor } from '../utils/helpers'

const statusOptions = [
  { value: 'agendado', label: 'Agendado' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' },
]

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    clientId: '',
    date: '',
    time: '',
    duration: '',
    local: '',
    value: '',
    status: 'agendado',
    notes: '',
  })

  const { schedules, refetch } = useSchedule({
    month: currentDate.toISOString().slice(0, 7),
  })
  const { clients } = useAppStore()

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const schedulesByDate = schedules.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = []
    acc[s.date].push(s)
    return acc
  }, {})

  const selectedDateStr = selectedDate.toISOString().split('T')[0]
  const selectedSchedules = schedulesByDate[selectedDateStr] || []

  const monthStats = {
    total: schedules.length,
    concluidos: schedules.filter((s) => s.status === 'concluido').length,
    emAndamento: schedules.filter((s) => s.status === 'em_andamento').length,
    faturamento: schedules.reduce((acc, s) => acc + s.value, 0),
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/schedules', {
        ...formData,
        value: parseFloat(formData.value) || 0,
      })
      toast.success('Agendamento criado com sucesso')
      setIsModalOpen(false)
      refetch()
    } catch {
      toast.error('Erro ao criar agendamento')
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-display font-bold text-accent">{monthStats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-400">Concluídos</p>
          <p className="text-2xl font-display font-bold text-green-400">{monthStats.concluidos}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-400">Em Andamento</p>
          <p className="text-2xl font-display font-bold text-yellow-400">{monthStats.emAndamento}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-400">Faturamento</p>
          <p className="text-2xl font-display font-bold text-accent">{formatCurrency(monthStats.faturamento)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={prevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day) => (
              <div key={day} className="text-center text-sm text-gray-400 py-2">
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              const dateStr = date.toISOString().split('T')[0]
              const hasSchedules = schedulesByDate[dateStr]?.length > 0
              const isToday = new Date().toDateString() === date.toDateString()
              const isSelected = selectedDate.toDateString() === date.toDateString()

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    aspect-square relative p-2 rounded-lg transition-all
                    ${isSelected ? 'bg-accent text-background' : 'hover:bg-surface-100'}
                    ${isToday && !isSelected ? 'border border-accent' : ''}
                  `}
                >
                  <span className="text-sm">{day}</span>
                  {hasSchedules && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {schedulesByDate[dateStr].slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${isSelected ? 'bg-background' : 'bg-accent'}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </Card>

        {/* Schedule List */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">
              {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {selectedSchedules.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhum agendamento</p>
            ) : (
              selectedSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-4 bg-surface-100 rounded-lg border border-surface-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-white">{schedule.client.name}</p>
                    <Badge className={getStatusColor(schedule.status)}>
                      {schedule.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {schedule.time} • {schedule.duration}
                    </div>
                    {schedule.local && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {schedule.local}
                      </div>
                    )}
                    <p className="text-accent font-semibold">{formatCurrency(schedule.value)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Agendamento" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Cliente"
            options={clients.map((c) => ({ value: c.id, label: c.name }))}
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Horário"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duração"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="Ex: 30 minutos"
            />
            <Input
              label="Valor"
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
          </div>
          <Input
            label="Local"
            value={formData.local}
            onChange={(e) => setFormData({ ...formData, local: e.target.value })}
            placeholder="Ex: Centro e Vila Nova"
          />
          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
          <Textarea
            label="Observações"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Agendar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}