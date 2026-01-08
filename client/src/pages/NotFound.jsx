import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Heart className="w-16 h-16 text-primary mb-6 animate-float" />
      <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-8">This page doesn't exist in our celebration</p>
      <Link 
        to="/" 
        className="btn-primary bg-primary text-white hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  )
}

export default NotFound


