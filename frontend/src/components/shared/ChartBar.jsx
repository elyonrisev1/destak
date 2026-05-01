import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ChartBar({ data, height = 300 }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-100 border border-surface-200 rounded-lg p-3 shadow-xl">
          <p className="text-sm text-gray-400">{payload[0].payload.month}</p>
          <p className="text-lg font-semibold text-accent">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#303030" />
        <XAxis
          dataKey="month"
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#303030' }}
        />
        <YAxis
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#303030' }}
          tickFormatter={(value) => `R$ ${value / 1000}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          fill="#d4af77"
          radius={[4, 4, 0, 0]}
          className="hover:opacity-80 transition-opacity"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ChartLine({ data, height = 300 }) {
  const { LineChart, Line } = require('recharts')

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-100 border border-surface-200 rounded-lg p-3 shadow-xl">
          <p className="text-sm text-gray-400">{payload[0].payload.month}</p>
          <p className="text-lg font-semibold text-accent">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#303030" />
        <XAxis
          dataKey="month"
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#303030' }}
        />
        <YAxis
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#303030' }}
          tickFormatter={(value) => `R$ ${value / 1000}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#d4af77"
          strokeWidth={2}
          dot={{ fill: '#d4af77', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}