import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { Heart, Plus, MessageSquare, Calendar } from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCelebrations: 0,
    totalWishes: 0,
    pendingWishes: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [celebrationsRes, wishesRes] = await Promise.all([
        api.get('/celebrations'),
        api.get('/wishes'),
      ])
      
      const wishes = wishesRes.data
      setStats({
        totalCelebrations: celebrationsRes.data.length,
        totalWishes: wishes.length,
        pendingWishes: wishes.filter(w => !w.approved).length,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">Dashboard</h1>
        <Link
          to="/admin/celebrations/new"
          className="btn-primary bg-primary text-white flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          New Celebration
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Total Celebrations</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalCelebrations}</p>
            </div>
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-primary/20 flex-shrink-0" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Total Wishes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalWishes}</p>
            </div>
            <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-primary/20 flex-shrink-0" />
          </div>
        </div>
        
        <div className="card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Pending Wishes</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.pendingWishes}</p>
            </div>
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-primary/20 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard



