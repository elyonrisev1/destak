export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR')
}

export function formatTime(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(dateString) {
  return `${formatDate(dateString)} ${formatTime(dateString)}`
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function getStatusColor(status) {
  const colors = {
    agendado: 'text-blue-400 bg-blue-400/10',
    em_andamento: 'text-yellow-400 bg-yellow-400/10',
    concluido: 'text-green-400 bg-green-400/10',
    cancelado: 'text-red-400 bg-red-400/10',
    recebido: 'text-green-400 bg-green-400/10',
    pendente: 'text-yellow-400 bg-yellow-400/10',
    atrasado: 'text-red-400 bg-red-400/10',
  }
  return colors[status] || 'text-gray-400 bg-gray-400/10'
}

export function getMonthName(month) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]
  return months[month] || ''
}