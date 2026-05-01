import { useState } from 'react'
import { TrendingUp, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ChartBar from '../components/shared/ChartBar'
import { useFinance, useRevenueChart } from '../hooks/useFinance'
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers'

const methodLabels = {
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
  debito: 'Débito',
  boleto: 'Boleto',
}

export default function Finance() {
  const [activeTab, setActiveTab] = useState('fluxo')
  const [statusFilter, setStatusFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')

  const { payments, loading, refetch } = useFinance({ status: statusFilter, method: methodFilter })
  const { data: revenueData } = useRevenueChart()

  const metrics = {
    faturamentoMes: payments
      .filter((p) => p.status === 'recebido')
      .reduce((acc, p) => acc + p.value, 0),
    aReceber: payments
      .filter((p) => p.status === 'pendente')
      .reduce((acc, p) => acc + p.value, 0),
    emAtraso: payments
      .filter((p) => p.status === 'atrasado')
      .reduce((acc, p) => acc + p.value, 0),
    totalAcumulado: payments.reduce((acc, p) => acc + p.value, 0),
  }

  const handleMarkReceived = async (id) => {
    try {
      await api.patch(`/payments/${id}/received`)
      toast.success('Pagamento marcado como recebido')
      refetch()
    } catch {
      toast.error('Erro ao atualizar pagamento')
    }
  }

  const statCards = [
    {
      title: 'Faturamento Mês',
      value: formatCurrency(metrics.faturamentoMes),
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      title: 'A Receber',
      value: formatCurrency(metrics.aReceber),
      icon: DollarSign,
      color: 'text-blue-400',
    },
    {
      title: 'Em Atraso',
      value: formatCurrency(metrics.emAtraso),
      icon: AlertCircle,
      color: 'text-red-400',
    },
    {
      title: 'Total Acumulado',
      value: formatCurrency(metrics.totalAcumulado),
      icon: CheckCircle,
      color: 'text-purple-400',
    },
  ]

  const tabs = [
    { id: 'fluxo', label: 'Fluxo de Caixa' },
    { id: 'receber', label: 'Contas a Receber' },
    { id: 'recebidas', label: 'Recebidas' },
  ]

  const filteredPayments = payments.filter((p) => {
    if (activeTab === 'receber') return p.status !== 'recebido'
    if (activeTab === 'recebidas') return p.status === 'recebido'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <h3 className="text-lg font-display font-semibold mb-4">Faturamento (6 meses)</h3>
        <ChartBar data={revenueData} height={250} />
      </Card>

      {/* Tabs */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex border-b border-surface-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-sm text-white focus:outline-none focus:border-accent"
            >
              <option value="">Todos status</option>
              <option value="recebido">Recebido</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-sm text-white focus:outline-none focus:border-accent"
            >
              <option value="">Todos métodos</option>
              <option value="pix">PIX</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
              <option value="debito">Débito</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Descrição</th>
                <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Cliente</th>
                <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Valor</th>
                <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Vencimento</th>
                <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Método</th>
                <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-400 py-4 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-surface-200/50 hover:bg-surface-100/50">
                  <td className="py-4 px-4 text-sm text-gray-300">{payment.description || '-'}</td>
                  <td className="py-4 px-4 text-sm text-gray-300">{payment.client?.name || '-'}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-accent">{formatCurrency(payment.value)}</td>
                  <td className="py-4 px-4 text-sm text-gray-300">{formatDate(payment.dueDate || payment.date)}</td>
                  <td className="py-4 px-4 text-sm text-gray-300">{methodLabels[payment.method]}</td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    {payment.status !== 'recebido' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleMarkReceived(payment.id)}
                      >
                        Receber
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <p className="text-center text-gray-400 py-8">Nenhum pagamento encontrado</p>
          )}
        </div>
      </Card>
    </div>
  )
}