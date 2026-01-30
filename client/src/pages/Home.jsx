import { Link } from 'react-router-dom'
import { Heart, Sparkles, Calendar } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Heart className="w-12 h-12 text-primary fill-primary animate-float" />
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800">
            GsquaD Forever
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-600 font-light mb-2">
          Celebrating moments that last forever
        </p>
        <p className="text-lg text-gray-500 font-medium">
          என் நெஞ்சில் குடியிருக்கும்
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <div className="card max-w-xs">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Weddings</h3>
            <p className="text-gray-600 text-sm">Celebrate your union with a beautiful digital space</p>
          </div>
          
          <div className="card max-w-xs">
            <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Birthdays</h3>
            <p className="text-gray-600 text-sm">Make every birthday memorable</p>
          </div>
          
          <div className="card max-w-xs">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Anniversaries</h3>
            <p className="text-gray-600 text-sm">Honor your journey together</p>
          </div>
        </div>
        
        <div className="mt-12 space-y-4">
          <p className="text-gray-500 italic">
            "Love is not about how many days, months, or years you have been together. 
            It's about how much you love each other every single day."
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              to="/admin/login" 
              className="btn-primary bg-primary text-white hover:bg-primary/90"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home



