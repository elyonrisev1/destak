import { useEffect, useState } from 'react'
import { TrendingUp, Users, Calendar, DollarSign, Clock, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import toast from 'react-hot-toast'
import api from '../services/api'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [upcomingSchedules, setUpcomingSchedules] = useState([])
  const [activities, setActivities] = useState([])
  const [topClients, setTopClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [metricsRes, revenueRes, schedulesRes, activitiesRes, clientsRes] = await Promise.all([
        api.get('/dashboard/metrics'),
        api.get('/dashboard/revenue-chart'),
        api.get('/dashboard/upcoming-schedules'),
        api.get('/dashboard/activity'),
        api.get('/dashboard/top-clients'),
      ])

      setMetrics(metricsRes.data.data)
      setRevenueData(revenueRes.data.data)
      setUpcomingSchedules(schedulesRes.data.data)
      setActivities(activitiesRes.data.data)
      setTopClients(clientsRes.data.data)
    } catch (error) {
      toast.error('Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Faturamento Mês',
      value: formatCurrency(metrics?.faturamentoMes || 0),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'Campanhas Ativas',
      value: metrics?.campanhasAtivas || 0,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'A Receber',
      value: formatCurrency(metrics?.aReceber || 0),
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      title: 'Total Clientes',
      value: metrics?.totalClients || 0,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <h3 className="text-lg font-display font-semibold mb-4">Faturamento (6 meses)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(v) => `R$${v / 1000}k`} />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="bg-surface-100 p-3 rounded border border-surface-200">
                      <p className="text-accent">{formatCurrency(payload[0].value)}</p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="value" fill="#d4af77" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Clients */}
        <Card>
          <h3 className="text-lg font-display font-semibold mb-4">Top 5 Clientes</h3>
          <div className="space-y-4">
            {topClients.map((client, i) => (
              <div key={client.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{client.name}</p>
                    <p className="text-sm text-gray-400">{client.segment}</p>
                  </div>
                </div>
                <p className="text-accent font-semibold">{formatCurrency(client.totalFaturamento)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Schedules & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Schedules */}
        <Card>
          <h3 className="text-lg font-display font-semibold mb-4">Próximos Agendamentos</h3>
          <div className="space-y-3">
            {upcomingSchedules.slice(0, 5).map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 bg-surface-100 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium text-white">{schedule.client.name}</p>
                    <p className="text-sm text-gray-400">
                      {formatDate(schedule.date)} às {schedule.time}
                    </p>
                  </div>
                </div>
                <Badge variant={schedule.status === 'agendado' ? 'info' : 'warning'}>
                  {schedule.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Feed */}
        <Card>
          <h3 className="text-lg font-display font-semibold mb-4">Atividades Recentes</h3>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}