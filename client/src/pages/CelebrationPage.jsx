import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import { useTheme } from '../contexts/ThemeContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import CelebrationHeader from '../components/celebration/CelebrationHeader'
import CelebrationStory from '../components/celebration/CelebrationStory'
import CelebrationGallery from '../components/celebration/CelebrationGallery'
import CelebrationWishes from '../components/celebration/CelebrationWishes'
import CelebrationContribution from '../components/celebration/CelebrationContribution'
import CelebrationSpotify from '../components/celebration/CelebrationSpotify'
import CelebrationFooter from '../components/celebration/CelebrationFooter'

const CelebrationPage = () => {
  const { slug } = useParams()
  const { updateTheme } = useTheme()
  const [celebration, setCelebration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCelebration()
  }, [slug])

  const fetchCelebration = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Clean slug - remove any URL parts
      const cleanSlug = slug?.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '')
      console.log('🔍 Fetching celebration with slug:', cleanSlug)
      
      const response = await api.get(`/celebrations/slug/${cleanSlug}`)
      console.log('✅ Celebration data received:', response.data)
      
      const data = response.data
      
      // Normalize data from database
      const normalized = {
        ...data,
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        slug: data.slug?.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '') || data.slug,
        eventType: data.event_type || data.eventType,
        eventDate: data.event_date || data.eventDate,
        story: data.story,
        coverImage: data.cover_image || data.coverImage,
        images: Array.isArray(data.images) ? data.images : [],
        videos: Array.isArray(data.videos) ? data.videos : [],
        qrImage: data.qr_image || data.qrImage,
        spotifyCode: data.spotify_code || data.spotifyCode,
        moneyCollectionEnabled: data.money_collection_enabled ?? data.moneyCollectionEnabled,
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
      }
      
      console.log('✅ Normalized celebration:', normalized)
      setCelebration(normalized)
      
      // Apply theme
      if (normalized.theme) {
        updateTheme({
          primaryColor: normalized.theme.primaryColor || '#9B7EDE',
          secondaryColor: normalized.theme.secondaryColor || '#E8D5FF',
          animationsEnabled: normalized.theme.animationsEnabled !== false,
        })
      }
    } catch (err) {
      console.error('❌ Error fetching celebration:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        slug: slug,
      })
      setError(err.response?.data?.message || 'Celebration page not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !celebration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Celebration not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {celebration.sections?.header !== false && (
        <CelebrationHeader celebration={celebration} />
      )}
      
      {celebration.sections?.story !== false && celebration.story && (
        <CelebrationStory story={celebration.story} />
      )}
      
      {celebration.sections?.gallery !== false && celebration.images?.length > 0 && (
        <CelebrationGallery images={celebration.images} />
      )}
      
      {celebration.sections?.wishes !== false && (
        <CelebrationWishes celebrationId={celebration.id} />
      )}
      
      {celebration.sections?.contribution !== false && celebration.moneyCollectionEnabled && (
        <CelebrationContribution 
          qrImage={celebration.qrImage} 
          celebrationId={celebration.id}
        />
      )}
      
      {celebration.spotifyCode && (
        <CelebrationSpotify spotifyCode={celebration.spotifyCode} />
      )}
      
      <CelebrationFooter />
    </div>
  )
}

export default CelebrationPage


