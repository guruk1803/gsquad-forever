import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import toast from 'react-hot-toast'

const AdminCelebrationEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  // Explicitly check if this is a new celebration
  const isNew = !id || id === 'new' || id === 'undefined' || id === undefined
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    eventType: 'wedding',
    eventDate: '',
    story: '',
    coverImage: '',
    images: [],
    videos: [],
    qrImage: '',
    spotifyCode: '',
    moneyCollectionEnabled: false,
    theme: {
      primaryColor: '#9B7EDE',
      secondaryColor: '#E8D5FF',
      animationsEnabled: true,
    },
    sections: {
      header: true,
      story: true,
      gallery: true,
      wishes: true,
      contribution: true,
    },
    quotes: [],
  })
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState({ type: null, progress: 0 })

  useEffect(() => {
    // Only fetch if we have a valid numeric ID (not 'new' or undefined)
    if (isNew) {
      // This is a new celebration, no need to fetch
      setLoading(false)
      return
    }
    
    // Check if we have a valid ID
    if (id && id !== 'new' && id !== 'undefined' && !isNaN(parseInt(id))) {
      fetchCelebration()
    } else {
      // Invalid ID - redirect to celebrations list
      console.warn('Invalid ID in edit mode:', id)
      toast.error('Invalid celebration ID')
      navigate('/admin/celebrations')
    }
  }, [id]) // Removed isNew and navigate from dependencies to prevent loops

  const fetchCelebration = async () => {
    if (!id || id === 'new' || id === 'undefined') {
      setLoading(false)
      return
    }
    
    try {
      console.log('🔍 Fetching celebration with ID:', id)
      const response = await api.get(`/celebrations/${id}`)
      console.log('✅ Celebration data received:', response.data)
      
      // Ensure all array fields are initialized
      const data = response.data
      
      // Clean slug - remove any URL parts
      let cleanSlug = data.slug || ''
      if (cleanSlug) {
        cleanSlug = cleanSlug.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '').trim()
      }
      
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        slug: cleanSlug,
        eventType: data.event_type || 'wedding',
        eventDate: data.event_date || '',
        story: data.story || '',
        coverImage: data.cover_image || '',
        images: Array.isArray(data.images) ? data.images : [],
        videos: Array.isArray(data.videos) ? data.videos : [],
        qrImage: data.qr_image || '',
        spotifyCode: data.spotify_code || '',
        moneyCollectionEnabled: data.money_collection_enabled || false,
        theme: data.theme || {
          primaryColor: '#9B7EDE',
          secondaryColor: '#E8D5FF',
          animationsEnabled: true,
        },
        sections: data.sections || {
          header: true,
          story: true,
          gallery: true,
          wishes: true,
          contribution: true,
        },
        quotes: Array.isArray(data.quotes) ? data.quotes : [],
      })
    } catch (error) {
      console.error('❌ Fetch celebration error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      })
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch celebration')
      navigate('/admin/celebrations')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.slug) {
      toast.error('Title and slug are required')
      return
    }
    
    setSaving(true)
    
    try {
      if (isNew || id === 'new') {
        console.log('📝 Creating new celebration:', formData)
        const response = await api.post('/celebrations', formData)
        console.log('✅ Celebration created successfully:', response.data)
        toast.success('Celebration created!')
        navigate('/admin/celebrations')
      } else {
        if (!id || id === 'undefined') {
          toast.error('Invalid celebration ID for update')
          return
        }
        console.log('📝 Updating celebration:', id, formData)
        const response = await api.put(`/celebrations/${id}`, formData)
        console.log('✅ Celebration updated successfully:', response.data)
        toast.success('Celebration updated!')
        navigate('/admin/celebrations')
      }
    } catch (error) {
      console.error('❌ Save celebration error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: formData,
      })
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save celebration'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      console.warn('⚠️ No file selected')
      return
    }
    
    // Validate file
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      toast.error('Video size must be less than 100MB')
      console.error('❌ File too large:', file.size, 'bytes')
      return
    }
    
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only MP4, WebM, MOV, AVI, and MKV videos are allowed')
      console.error('❌ Invalid file type:', file.type)
      return
    }
    
    console.log(`📤 Uploading video:`, {
      name: file.name,
      size: file.size,
      type: file.type,
    })
    
    // Set uploading state
    setUploading({ type: 'video', progress: 0 })
    
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('video', file)
      
      console.log('🔄 Sending video upload request to /upload/video')
      const response = await api.post('/upload/video', uploadFormData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploading({ type: 'video', progress: percentCompleted })
          console.log(`📊 Upload progress: ${percentCompleted}%`)
        },
      })
      
      console.log('✅ Video upload successful:', response.data)
      
      if (!response.data || !response.data.url) {
        throw new Error('Invalid response from server: missing URL')
      }
      
      // Add video to videos array
      setFormData(prev => ({ 
        ...prev, 
        videos: [...(prev.videos || []), response.data.url] 
      }))
      console.log('✅ Video added to gallery')
      
      toast.success('Video uploaded successfully!')
      
      // Reset uploading state
      setUploading({ type: null, progress: 0 })
      
      // Reset file input
      e.target.value = ''
    } catch (error) {
      console.error('❌ Video upload error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      })
      
      let errorMessage = 'Failed to upload video'
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage
        console.error('Server error response:', error.response.data)
      } else if (error.request) {
        errorMessage = 'No response from server. Is the backend running?'
        console.error('No response received:', error.request)
      } else {
        errorMessage = error.message || errorMessage
        console.error('Request setup error:', error.message)
      }
      
      toast.error(errorMessage)
      
      // Reset uploading state on error
      setUploading({ type: null, progress: 0 })
      
      // Reset file input on error
      e.target.value = ''
    }
  }

  const handleImageUpload = async (e, type = 'cover') => {
    const file = e.target.files[0]
    if (!file) {
      console.warn('⚠️ No file selected')
      return
    }
    
    // Validate file
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 10MB')
      console.error('❌ File too large:', file.size, 'bytes')
      return
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, GIF, and WebP images are allowed')
      console.error('❌ Invalid file type:', file.type)
      return
    }
    
    console.log(`📤 Uploading ${type} image:`, {
      name: file.name,
      size: file.size,
      type: file.type,
    })
    
    // Set uploading state
    setUploading({ type, progress: 0 })
    
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)
      
      console.log('🔄 Sending upload request to /upload/image')
      const response = await api.post('/upload/image', uploadFormData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploading({ type, progress: percentCompleted })
          console.log(`📊 Upload progress: ${percentCompleted}%`)
        },
      })
      
      console.log('✅ Upload successful:', response.data)
      
      if (!response.data || !response.data.url) {
        throw new Error('Invalid response from server: missing URL')
      }
      
      // Update form data based on type
      if (type === 'cover') {
        setFormData(prev => ({ ...prev, coverImage: response.data.url }))
        console.log('✅ Cover image updated')
      } else if (type === 'qr') {
        setFormData(prev => ({ ...prev, qrImage: response.data.url }))
        console.log('✅ QR image updated')
      } else if (type === 'spotify') {
        setFormData(prev => ({ ...prev, spotifyCode: response.data.url }))
        console.log('✅ Spotify code image updated')
      } else {
        setFormData(prev => ({ 
          ...prev, 
          images: [...(prev.images || []), response.data.url] 
        }))
        console.log('✅ Gallery image added')
      }
      
      toast.success('Image uploaded successfully!')
      
      // Reset uploading state
      setUploading({ type: null, progress: 0 })
      
      // Reset file input
      e.target.value = ''
    } catch (error) {
      console.error('❌ Image upload error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      })
      
      let errorMessage = 'Failed to upload image'
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage
        console.error('Server error response:', error.response.data)
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Is the backend running?'
        console.error('No response received:', error.request)
      } else {
        // Error setting up request
        errorMessage = error.message || errorMessage
        console.error('Request setup error:', error.message)
      }
      
      toast.error(errorMessage)
      
      // Reset uploading state on error
      setUploading({ type: null, progress: 0 })
      
      // Reset file input on error
      e.target.value = ''
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-serif font-bold text-gray-800">
        {isNew ? 'Create Celebration' : 'Edit Celebration'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
              <input
                type="text"
                className="input-field"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Will be used in URL: /{formData.slug || 'your-slug'}
              </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                className="input-field"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              >
                <option value="wedding">Wedding</option>
                <option value="engagement">Engagement</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="baby-shower">Baby Shower</option>
                <option value="festival">Festival</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="date"
                className="input-field"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Content</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story / Love Story
            </label>
            <ReactQuill
              theme="snow"
              value={formData.story}
              onChange={(value) => setFormData({ ...formData, story: value })}
              className="bg-white"
            />
          </div>
        </div>
        
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Media</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            {formData.coverImage && (
              <img src={formData.coverImage} alt="Cover" className="w-full max-w-md h-48 object-cover rounded-xl mb-2" />
            )}
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'cover')}
                className="input-field"
                disabled={uploading.type === 'cover'}
              />
              {uploading.type === 'cover' && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploading.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Uploading cover image... {uploading.progress}%</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Images
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: (formData.images || []).filter((_, i) => i !== idx) })}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'gallery')}
              className="input-field"
              disabled={uploading.type === 'gallery'}
            />
            {uploading.type === 'gallery' && (
              <div className="space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploading.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">Uploading image... {uploading.progress}%</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Videos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
              {(formData.videos || []).map((video, idx) => (
                <div key={idx} className="relative">
                  <video 
                    src={video} 
                    className="w-full h-32 object-cover rounded"
                    controls
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, videos: (formData.videos || []).filter((_, i) => i !== idx) })}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="input-field"
              disabled={uploading.type === 'video'}
            />
            {uploading.type === 'video' && (
              <div className="space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploading.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">Uploading video... {uploading.progress}%</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload videos (MP4, WebM, MOV, AVI, MKV). Max size: 100MB per video.
            </p>
          </div>
        </div>
        
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Theme & Colors</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.theme.primaryColor}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    theme: { ...formData.theme, primaryColor: e.target.value }
                  })}
                  className="w-16 h-10 rounded"
                />
                <input
                  type="text"
                  value={formData.theme.primaryColor}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    theme: { ...formData.theme, primaryColor: e.target.value }
                  })}
                  className="input-field flex-1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.theme.secondaryColor}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    theme: { ...formData.theme, secondaryColor: e.target.value }
                  })}
                  className="w-16 h-10 rounded"
                />
                <input
                  type="text"
                  value={formData.theme.secondaryColor}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    theme: { ...formData.theme, secondaryColor: e.target.value }
                  })}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="animations"
              checked={formData.theme.animationsEnabled}
              onChange={(e) => setFormData({ 
                ...formData, 
                theme: { ...formData.theme, animationsEnabled: e.target.checked }
              })}
              className="w-4 h-4"
            />
            <label htmlFor="animations" className="text-sm text-gray-700">
              Enable Animations
            </label>
          </div>
        </div>
        
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Sections</h2>
          
          {Object.entries(formData.sections || {}).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  sections: { ...(formData.sections || {}), [key]: e.target.checked }
                })}
                className="w-4 h-4"
              />
              <label htmlFor={key} className="text-sm text-gray-700 capitalize">
                Show {key} Section
              </label>
            </div>
          ))}
        </div>
        
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Money Collection</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="moneyCollection"
              checked={formData.moneyCollectionEnabled}
              onChange={(e) => setFormData({ ...formData, moneyCollectionEnabled: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="moneyCollection" className="text-sm text-gray-700">
              Enable Money Collection
            </label>
          </div>
          
          {formData.moneyCollectionEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI QR Code Image
              </label>
              {formData.qrImage && (
                <img src={formData.qrImage} alt="QR Code" className="w-48 h-48 object-contain rounded-xl mb-2" />
              )}
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'qr')}
                  className="input-field"
                  disabled={uploading.type === 'qr'}
                />
                {uploading.type === 'qr' && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploading.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">Uploading QR code... {uploading.progress}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Spotify Code</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spotify Code Image
            </label>
            {formData.spotifyCode && (
              <img src={formData.spotifyCode} alt="Spotify Code" className="w-48 h-48 object-contain rounded-xl mb-2" />
            )}
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'spotify')}
                className="input-field"
                disabled={uploading.type === 'spotify'}
              />
              {uploading.type === 'spotify' && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploading.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Uploading Spotify code... {uploading.progress}%</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload your Spotify code image. It will be displayed with "Scan and feel" text.
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary bg-primary text-white flex-1 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isNew ? 'Create Celebration' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/celebrations')}
            className="btn-secondary border-gray-300 text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminCelebrationEdit

