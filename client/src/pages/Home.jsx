import { Link } from 'react-router-dom'
import { Heart, Sparkles, Calendar } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary fill-primary animate-float" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-800">
            GsquaD Forever
          </h1>
        </div>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light mb-2 px-4">
          Celebrating moments that last forever
        </p>
        <p className="text-base sm:text-lg text-gray-500 font-medium px-4">
          என் நெஞ்சில் குடியிருக்கும்
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8 sm:mt-12">
          <div className="card max-w-xs w-full sm:w-auto">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold text-base sm:text-lg mb-2">Weddings</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Celebrate your union with a beautiful digital space</p>
          </div>
          
          <div className="card max-w-xs w-full sm:w-auto">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold text-base sm:text-lg mb-2">Birthdays</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Make every birthday memorable</p>
          </div>
          
          <div className="card max-w-xs w-full sm:w-auto">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold text-base sm:text-lg mb-2">Anniversaries</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Honor your journey together</p>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-12 space-y-4 px-4">
          <p className="text-gray-500 italic text-sm sm:text-base">
            "Love is not about how many days, months, or years you have been together. 
            It's about how much you love each other every single day."
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              to="/admin/login" 
              className="btn-primary bg-primary text-white hover:bg-primary/90 text-sm sm:text-base px-6 py-3 touch-manipulation"
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



