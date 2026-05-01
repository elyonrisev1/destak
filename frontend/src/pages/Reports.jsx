import { useState } from 'react'
import { Download, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ChartBar from '../components/shared/ChartBar'
import { useClients } from '../hooks/useClients'
import { formatCurrency, formatDate } from '../utils/helpers'

const periodOptions = [
  { value: 'month', label: 'Este Mês' },
  { value: '3months', label: 'Últimos 3 Meses' },
  { value: '6months', label: 'Últimos 6 Meses' },
  { value: 'year', label: 'Este Ano' },
]

export default function Reports() {
  const { clients } = useClients()
  const [period, setPeriod] = useState('month')
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)

  const loadReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ period, ...(clientId && { clientId }) }).toString()
      const { data } = await api.get(`/reports/summary?${params}`)
      setReport(data.data)
      toast.success('Relatório carregado')
    } catch {
      toast.error('Erro ao carregar relatório')
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = async () => {
    try {
      const params = new URLSearchParams({ period, ...(clientId && { clientId }) }).toString()
      const response = await api.get(`/reports/pdf?${params}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Relatorio_Destak_${period}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('PDF exportado com sucesso')
    } catch {
      toast.error('Erro ao exportar PDF')
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-3 bg-surface-100 border border-surface-200 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              {periodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="px-4 py-3 bg-surface-100 border border-surface-200 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="">Todos clientes</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Button onClick={loadReport} loading={loading}>
              <BarChart3 className="w-5 h-5 mr-2" />
              Gerar Relatório
            </Button>
          </div>
          <Button variant="secondary" onClick={exportPDF}>
            <Download className="w-5 h-5 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </Card>

      {report && (
        <>
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <p className="text-sm text-gray-400">Total Recebido</p>
              <p className="text-2xl font-display font-bold text-green-400 mt-1">
                {formatCurrency(report.financeiro.totalRecebido)}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-400">Total Pendente</p>
              <p className="text-2xl font-display font-bold text-blue-400 mt-1">
                {formatCurrency(report.financeiro.totalPendente)}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-400">Total Atrasado</p>
              <p className="text-2xl font-display font-bold text-red-400 mt-1">
                {formatCurrency(report.financeiro.totalAtrasado)}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-400">Total Geral</p>
              <p className="text-2xl font-display font-bold text-accent mt-1">
                {formatCurrency(report.financeiro.total)}
              </p>
            </Card>
          </div>

          {/* Schedule Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-display font-semibold mb-4">Agendamentos</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-100 rounded-lg">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-white">{report.agendamentos.total}</p>
                </div>
                <div className="p-4 bg-surface-100 rounded-lg">
                  <p className="text-sm text-gray-400">Concluídos</p>
                  <p className="text-2xl font-bold text-green-400">{report.agendamentos.concluidos}</p>
                </div>
                <div className="p-4 bg-surface-100 rounded-lg">
                  <p className="text-sm text-gray-400">Em Andamento</p>
                  <p className="text-2xl font-bold text-yellow-400">{report.agendamentos.emAndamento}</p>
                </div>
                <div className="p-4 bg-surface-100 rounded-lg">
                  <p className="text-sm text-gray-400">Agendados</p>
                  <p className="text-2xl font-bold text-blue-400">{report.agendamentos.agendados}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-display font-semibold mb-4">Por Segmento</h3>
              <div className="space-y-3">
                {Object.entries(report.porSegmento || {}).map(([segment, data]) => (
                  <div key={segment} className="flex items-center justify-between p-3 bg-surface-100 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{segment}</p>
                      <p className="text-sm text-gray-400">{data.count} campanhas</p>
                    </div>
                    <p className="text-accent font-semibold">{formatCurrency(data.value)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Campaigns Table */}
          <Card>
            <h3 className="text-lg font-display font-semibold mb-4">Campanhas</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Cliente</th>
                    <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Data</th>
                    <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Local</th>
                    <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Valor</th>
                    <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.schedules?.map((schedule) => (
                    <tr key={schedule.id} className="border-b border-surface-200/50">
                      <td className="py-4 px-4 text-sm text-white">{schedule.client?.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-300">{formatDate(schedule.date)}</td>
                      <td className="py-4 px-4 text-sm text-gray-300">{schedule.local || '-'}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-accent">{formatCurrency(schedule.value)}</td>
                      <td className="py-4 px-4">
                        <Badge className={
                          schedule.status === 'concluido' ? 'bg-green-500/20 text-green-400' :
                          schedule.status === 'em_andamento' ? 'bg-yellow-500/20 text-yellow-400' :
                          schedule.status === 'cancelado' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }>
                          {schedule.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {!report && !loading && (
        <Card className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Selecione os filtros e gere um relatório</p>
        </Card>
      )}
    </div>
  )
}