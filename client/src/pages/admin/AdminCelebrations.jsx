import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminCelebrations = () => {
  const [celebrations, setCelebrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCelebrations()
  }, [])

  const fetchCelebrations = async () => {
    try {
      console.log('🔍 Fetching celebrations...')
      const response = await api.get('/celebrations')
      console.log('✅ Celebrations received:', response.data)
      
      // Normalize celebration data
      const normalized = response.data.map(celebration => ({
        ...celebration,
        // Ensure slug is just the slug, not a full URL
        slug: celebration.slug?.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '') || celebration.slug,
        // Normalize field names from database
        coverImage: celebration.cover_image || celebration.coverImage,
        eventType: celebration.event_type || celebration.eventType,
        eventDate: celebration.event_date || celebration.eventDate,
        moneyCollectionEnabled: celebration.money_collection_enabled ?? celebration.moneyCollectionEnabled,
        qrImage: celebration.qr_image || celebration.qrImage,
        images: celebration.images || [],
        videos: celebration.videos || [],
      }))
      
      console.log('✅ Normalized celebrations:', normalized)
      setCelebrations(normalized)
    } catch (error) {
      console.error('❌ Failed to fetch celebrations:', error)
      toast.error('Failed to fetch celebrations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this celebration?')) return
    
    try {
      await api.delete(`/celebrations/${id}`)
      toast.success('Celebration deleted')
      fetchCelebrations()
    } catch (error) {
      toast.error('Failed to delete celebration')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">Celebrations</h1>
        <Link
          to="/admin/celebrations/new"
          className="btn-primary bg-primary text-white flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          New Celebration
        </Link>
      </div>
      
      {celebrations.length === 0 ? (
        <div className="card text-center py-8 sm:py-12">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">No celebrations yet</p>
          <Link
            to="/admin/celebrations/new"
            className="btn-primary bg-primary text-white inline-flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Your First Celebration
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {celebrations.map((celebration) => (
            <div key={celebration.id} className="card">
              {celebration.coverImage && (
                <img
                  src={celebration.coverImage}
                  alt={celebration.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-xl mb-3 sm:mb-4"
                />
              )}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                {celebration.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
                {celebration.subtitle}
              </p>
              <div className="flex gap-2 flex-wrap">
                {celebration.slug ? (
                  <Link
                    to={`/${celebration.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary border-primary text-primary flex-1 min-w-[80px] flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 touch-manipulation"
                    onClick={(e) => {
                      const slug = celebration.slug?.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '')
                      if (slug && slug !== celebration.slug) {
                        e.preventDefault()
                        window.open(`/${slug}`, '_blank')
                      }
                      console.log('🔗 Opening celebration:', slug || celebration.slug)
                    }}
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">View</span>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="btn-secondary border-gray-300 text-gray-400 flex-1 min-w-[80px] flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 cursor-not-allowed"
                    title="No slug set for this celebration"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                )}
                <Link
                  to={`/admin/celebrations/${celebration.id}`}
                  className="btn-secondary border-primary text-primary flex-1 min-w-[80px] flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 touch-manipulation"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                <button
                  onClick={() => handleDelete(celebration.id)}
                  className="btn-secondary border-red-500 text-red-500 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 text-xs sm:text-sm py-2 touch-manipulation"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminCelebrations


