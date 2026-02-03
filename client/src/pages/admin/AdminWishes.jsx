import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Heart, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminWishes = () => {
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, approved, pending

  useEffect(() => {
    fetchWishes()
  }, [])

  const fetchWishes = async () => {
    try {
      const response = await api.get('/wishes')
      setWishes(response.data)
    } catch (error) {
      toast.error('Failed to fetch wishes')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await api.patch(`/wishes/${id}/approve`)
      toast.success('Wish approved')
      fetchWishes()
    } catch (error) {
      toast.error('Failed to approve wish')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this wish?')) return
    
    try {
      await api.delete(`/wishes/${id}`)
      toast.success('Wish deleted')
      fetchWishes()
    } catch (error) {
      toast.error('Failed to delete wish')
    }
  }

  const filteredWishes = wishes.filter(wish => {
    if (filter === 'approved') return wish.approved
    if (filter === 'pending') return !wish.approved
    return true
  })

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">Wishes</h1>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base flex-1 sm:flex-none touch-manipulation ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base flex-1 sm:flex-none touch-manipulation ${filter === 'approved' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base flex-1 sm:flex-none touch-manipulation ${filter === 'pending' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
        </div>
      </div>
      
      {filteredWishes.length === 0 ? (
        <div className="card text-center py-8 sm:py-12">
          <p className="text-gray-600 text-sm sm:text-base">No wishes found</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredWishes.map((wish) => (
            <div key={wish.id} className={`card ${!wish.approved ? 'border-l-4 border-yellow-400' : ''}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{wish.name}</h4>
                    {!wish.approved && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base break-words">{wish.message}</p>
                  {wish.amount && Number(wish.amount) > 0 && (
                    <p className="text-xs sm:text-sm text-primary font-medium mb-2">
                      Contributed: ₹{Number(wish.amount).toFixed(2)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(wish.createdAt).toLocaleString()}
                  </p>
                  {wish.celebration && (
                    <p className="text-xs text-gray-500 break-words">
                      For: {wish.celebration.title}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!wish.approved && (
                    <button
                      onClick={() => handleApprove(wish.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                      title="Approve"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(wish.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                    title="Delete"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminWishes



