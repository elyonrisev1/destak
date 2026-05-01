import { useState } from 'react'
import { Search, Plus, Edit, Trash2, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Table from '../components/ui/Table'
import { useClients } from '../hooks/useClients'
import { formatCurrency } from '../utils/helpers'

export default function Clients() {
  const [search, setSearch] = useState('')
  const [segment, setSegment] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cpfCnpj: '',
    segment: '',
    address: '',
    notes: '',
    active: true,
  })

  const { clients, loading, refetch } = useClients({ search, segment })

  const segments = [...new Set(clients.map((c) => c.segment))]

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <User className="w-4 h-4 text-accent" />
          </div>
          <span className="font-medium text-white">{row.name}</span>
        </div>
      ),
    },
    { key: 'phone', header: 'Telefone' },
    { key: 'segment', header: 'Segmento' },
    {
      key: 'schedules',
      header: 'Campanhas',
      render: (schedules) => schedules?.length || 0,
    },
    {
      key: 'payments',
      header: 'Valor Total',
      render: (payments) =>
        formatCurrency(payments?.reduce((acc, p) => acc + p.value, 0) || 0),
    },
    {
      key: 'active',
      header: 'Status',
      render: (active) => (
        <Badge variant={active ? 'success' : 'default'}>
          {active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-gray-400 hover:text-accent transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      cpfCnpj: client.cpfCnpj || '',
      segment: client.segment,
      address: client.address || '',
      notes: client.notes || '',
      active: client.active,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja remover este cliente?')) return
    try {
      await api.delete(`/clients/${id}`)
      toast.success('Cliente removido com sucesso')
      refetch()
    } catch {
      toast.error('Erro ao remover cliente')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, formData)
        toast.success('Cliente atualizado com sucesso')
      } else {
        await api.post('/clients', formData)
        toast.success('Cliente cadastrado com sucesso')
      }
      setIsModalOpen(false)
      setEditingClient(null)
      setFormData({
        name: '',
        phone: '',
        email: '',
        cpfCnpj: '',
        segment: '',
        address: '',
        notes: '',
        active: true,
      })
      refetch()
    } catch {
      toast.error('Erro ao salvar cliente')
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
            <div className="flex-1">
              <Input
                placeholder="Buscar clientes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="px-4 py-3 bg-surface-100 border border-surface-200 rounded-lg text-white focus:outline-none focus:border-accent min-w-[200px]"
            >
              <option value="">Todos segmentos</option>
              {segments.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={columns} data={clients} loading={loading} />
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingClient(null)
        }}
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="CPF/CNPJ"
              value={formData.cpfCnpj}
              onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
            />
            <Input
              label="Segmento"
              value={formData.segment}
              onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
              required
            />
          </div>
          <Input
            label="Endereço"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <Input
            label="Observações"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingClient ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}