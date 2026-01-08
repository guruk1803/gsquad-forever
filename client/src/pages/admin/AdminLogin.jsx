import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Heart, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      toast.success('Login successful!')
      navigate('/admin/dashboard')
    } else {
      toast.error(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-primary fill-primary mx-auto mb-4 animate-float" />
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">Gsquad Forever Control Panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                className="input-field pl-10"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                className="input-field pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary bg-primary text-white w-full hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin


