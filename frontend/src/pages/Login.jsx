import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/useAuthStore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      toast.success('Login realizado com sucesso!')
      navigate('/')
    } else {
      toast.error(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <Mic2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl font-display font-bold text-accent">Destak</h1>
          <p className="text-gray-400 mt-2">Publicidade</p>
        </div>

        {/* Card */}
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-8">
          <h2 className="text-2xl font-display font-semibold text-white mb-6 text-center">
            Acessar Sistema
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button type="submit" loading={loading} className="w-full mt-6">
              Entrar
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-200">
            <p className="text-sm text-gray-400 text-center">
              Demo: admin@destak.com / destak2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}