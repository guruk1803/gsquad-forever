import axios from 'axios'

// Use relative URL in development to leverage Vite proxy, absolute URL in production
const getBaseURL = () => {
  // Priority 1: Use explicit VITE_API_URL if set (required for production)
  if (import.meta.env.VITE_API_URL) {
    console.log('🌐 Using API URL from VITE_API_URL:', import.meta.env.VITE_API_URL)
    return import.meta.env.VITE_API_URL
  }
  
  // Priority 2: In development, use relative URL to go through Vite proxy
  if (import.meta.env.DEV) {
    console.log('🌐 Using relative API URL for development (via Vite proxy)')
    return '/api'
  }
  
  // Priority 3: Production fallback - use Render URL
  // ⚠️ WARNING: This should not be needed if VITE_API_URL is set correctly in Vercel
  const productionFallback = 'https://gsquad-forever.onrender.com/api'
  console.warn('⚠️ VITE_API_URL not set! Using fallback:', productionFallback)
  console.warn('⚠️ Please set VITE_API_URL in Vercel environment variables!')
  return productionFallback
}

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful API calls in development
    if (import.meta.env.DEV) {
      console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }
    return response
  },
  (error) => {
    // Enhanced error logging
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    }
    
    console.error('❌ API Error:', errorDetails)
    
    // Log full error for debugging
    if (import.meta.env.DEV) {
      console.group('🔍 API Error Details')
      console.error('URL:', error.config?.url)
      console.error('Method:', error.config?.method?.toUpperCase())
      console.error('Status:', error.response?.status, error.response?.statusText)
      console.error('Response Data:', error.response?.data)
      console.error('Request Data:', error.config?.data)
      console.error('Full Error:', error)
      console.groupEnd()
    }
    
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - redirecting to login')
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    
    return Promise.reject(error)
  }
)

