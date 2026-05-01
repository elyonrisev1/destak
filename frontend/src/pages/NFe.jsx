import { useState } from 'react'
import { Plus, Trash2, FileText, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input, { Textarea, Select } from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import { useClients } from '../hooks/useClients'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function NFe() {
  const { clients } = useClients()
  const [nfes, setNfes] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    numero: '',
    clientId: '',
    emitente: '',
    cnpj: '',
    destinatario: '',
    items: [{ descricao: '', qtd: 1, valor: 0 }],
    subtotal: 0,
    iss: 0,
    total: 0,
    formaPgto: '',
    natureza: '',
    chaveAcesso: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    obs: '',
  })

  const selectedClient = clients.find((c) => c.id === formData.clientId)

  useState(() => {
    if (selectedClient) {
      setFormData((prev) => ({
        ...prev,
        destinatario: selectedClient.name,
      }))
    }
  })

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { descricao: '', qtd: 1, valor: 0 }],
    }))
  }

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index, field, value) => {
    setFormData((prev) => {
      const newItems = prev.items.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: field === 'qtd' || field === 'valor' ? parseFloat(value) || 0 : value }
        }
        return item
      })
      const subtotal = newItems.reduce((acc, item) => acc + item.qtd * item.valor, 0)
      const iss = subtotal * 0.05
      return {
        ...prev,
        items: newItems,
        subtotal,
        iss,
        total: subtotal + iss,
      }
    })
  }

  const generateChaveAcesso = () => {
    const random = Math.random().toString(36).substring(2, 15)
    return `${formData.dataEmissao.replace(/-/g, '')}${random.padEnd(44, '0').slice(0, 44)}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const chaveAcesso = generateChaveAcesso()
      const nfeData = {
        ...formData,
        chaveAcesso,
        items: JSON.stringify(formData.items),
      }
      const { data } = await api.post('/nfe/emit', nfeData)
      setNfes([data.data, ...nfes])
      toast.success('NF-e emitida com sucesso')
      setShowPreview(true)
    } catch {
      toast.error('Erro ao emitir NF-e')
    }
  }

  const downloadPDF = async (id) => {
    try {
      const response = await api.get(`/nfe/${id}/pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `NFe_${formData.numero}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('PDF baixado com sucesso')
    } catch {
      toast.error('Erro ao baixar PDF')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <h3 className="text-lg font-display font-semibold mb-4">Emitir NF-e</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Número"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                required
              />
              <Input
                label="Data de Emissão"
                type="date"
                value={formData.dataEmissao}
                onChange={(e) => setFormData({ ...formData, dataEmissao: e.target.value })}
                required
              />
            </div>

            <h4 className="font-medium text-accent mt-6">Emitente</h4>
            <Input
              label="Razão Social"
              value={formData.emitente}
              onChange={(e) => setFormData({ ...formData, emitente: e.target.value })}
              required
            />
            <Input
              label="CNPJ"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            />

            <h4 className="font-medium text-accent mt-6">Destinatário</h4>
            <Select
              label="Cliente"
              options={clients.map((c) => ({ value: c.id, label: c.name }))}
              value={formData.clientId}
              onChange={(e) => {
                const client = clients.find((c) => c.id === e.target.value)
                setFormData({ ...formData, clientId: e.target.value, destinatario: client?.name || '' })
              }}
            />
            <Input
              label="Destinatário"
              value={formData.destinatario}
              onChange={(e) => setFormData({ ...formData, destinatario: e.target.value })}
              required
            />

            <h4 className="font-medium text-accent mt-6">Itens</h4>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label={index === 0 ? 'Descrição' : ''}
                    value={item.descricao}
                    onChange={(e) => updateItem(index, 'descricao', e.target.value)}
                    placeholder="Descrição do serviço"
                  />
                </div>
                <div className="w-20">
                  <Input
                    label={index === 0 ? 'Qtd' : ''}
                    type="number"
                    value={item.qtd}
                    onChange={(e) => updateItem(index, 'qtd', e.target.value)}
                  />
                </div>
                <div className="w-28">
                  <Input
                    label={index === 0 ? 'Valor' : ''}
                    type="number"
                    step="0.01"
                    value={item.valor}
                    onChange={(e) => updateItem(index, 'valor', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>

            <h4 className="font-medium text-accent mt-6">Totais</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Subtotal</p>
                <p className="text-lg font-semibold text-white">{formatCurrency(formData.subtotal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">ISS (5%)</p>
                <p className="text-lg font-semibold text-white">{formatCurrency(formData.iss)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total</p>
                <p className="text-lg font-semibold text-accent">{formatCurrency(formData.total)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Natureza da Operação"
                value={formData.natureza}
                onChange={(e) => setFormData({ ...formData, natureza: e.target.value })}
                placeholder="Prestação de Serviços"
              />
              <Input
                label="Forma de Pagamento"
                value={formData.formaPgto}
                onChange={(e) => setFormData({ ...formData, formaPgto: e.target.value })}
                required
              />
            </div>

            <Textarea
              label="Observações"
              value={formData.obs}
              onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
              rows={2}
            />

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="secondary" onClick={() => setShowPreview(true)} className="flex-1">
                <FileText className="w-5 h-5 mr-2" />
                Preview
              </Button>
              <Button type="submit" className="flex-1">
                Emitir NF-e
              </Button>
            </div>
          </form>
        </Card>

        {/* History */}
        <Card>
          <h3 className="text-lg font-display font-semibold mb-4">Histórico de NF-e</h3>
          <div className="space-y-3">
            {nfes.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhuma NF-e emitida</p>
            ) : (
              nfes.map((nfe) => (
                <div
                  key={nfe.id}
                  className="p-4 bg-surface-100 rounded-lg border border-surface-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-white">NF-e {nfe.numero}</p>
                    <p className="text-sm text-gray-400">{nfe.destinatario}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(nfe.dataEmissao)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-accent font-semibold">{formatCurrency(nfe.total)}</p>
                    <Button size="sm" variant="secondary" onClick={() => downloadPDF(nfe.id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-50 border border-surface-200 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold">Preview da NF-e</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="text-center pb-4 border-b border-surface-200">
                <p className="text-lg font-bold">NOTA FISCAL DE SERVIÇOS - MEI</p>
                <p className="text-gray-400">Nº {formData.numero}</p>
              </div>
              <div>
                <p className="font-semibold text-accent">Emitente:</p>
                <p>{formData.emitente}</p>
                <p>CNPJ: {formData.cnpj}</p>
              </div>
              <div>
                <p className="font-semibold text-accent">Destinatário:</p>
                <p>{formData.destinatario}</p>
              </div>
              <div>
                <p className="font-semibold text-accent">Itens:</p>
                {formData.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.descricao} ({item.qtd}x)</span>
                    <span>{formatCurrency(item.qtd * item.valor)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-surface-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(formData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ISS:</span>
                  <span>{formatCurrency(formData.iss)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-accent">
                  <span>Total:</span>
                  <span>{formatCurrency(formData.total)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button variant="secondary" onClick={() => setShowPreview(false)} className="flex-1">Fechar</Button>
              <Button onClick={() => downloadPDF('preview')} className="flex-1">
                <Download className="w-5 h-5 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}