import { useState, useEffect } from 'react'
import { Heart, Send } from 'lucide-react'
import { api } from '../../services/api'
import toast from 'react-hot-toast'

const CelebrationWishes = ({ celebrationId }) => {
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', message: '', amount: '' })

  useEffect(() => {
    fetchWishes()
  }, [celebrationId])

  const fetchWishes = async () => {
    try {
      const response = await api.get(`/wishes/celebration/${celebrationId}`)
      setWishes(response.data.filter(w => w.approved))
    } catch (error) {
      console.error('Error fetching wishes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/wishes', {
        ...formData,
        celebrationId,
        amount: formData.amount ? parseFloat(formData.amount) : null,
      })
      toast.success('Your wish has been submitted!')
      setFormData({ name: '', message: '', amount: '' })
      fetchWishes()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit wish')
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <Heart className="w-10 h-10 text-primary fill-primary" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-gray-800">
          Send Your Wishes
        </h2>
        
        <form onSubmit={handleSubmit} className="card mb-12">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Your Message"
              className="input-field min-h-[120px] resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Contribution Amount (Optional)"
              className="input-field"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="0"
              step="0.01"
            />
            <button
              type="submit"
              className="btn-primary bg-primary text-white w-full flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Wish
            </button>
          </div>
        </form>
        
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading wishes...</p>
          ) : wishes.length === 0 ? (
            <p className="text-center text-gray-500">No wishes yet. Be the first to send one!</p>
          ) : (
            wishes.map((wish) => (
              <div key={wish.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{wish.name}</h4>
                    <p className="text-gray-600 mb-2">{wish.message}</p>
                    {wish.amount && (
                      <p className="text-sm text-primary font-medium">
                        Contributed: ₹{wish.amount.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(wish.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default CelebrationWishes


