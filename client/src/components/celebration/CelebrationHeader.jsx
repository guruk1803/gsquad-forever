import { Heart } from 'lucide-react'

const CelebrationHeader = ({ celebration }) => {
  return (
    <div 
      className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center text-center px-4 py-8 sm:py-12 md:py-20"
      style={{
        background: `linear-gradient(135deg, ${celebration.theme?.primaryColor || '#9B7EDE'}15 0%, ${celebration.theme?.secondaryColor || '#E8D5FF'}15 100%)`
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-slide-up">
        {celebration.coverImage && (
          <img 
            src={celebration.coverImage} 
            alt={celebration.title}
            className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl shadow-2xl object-cover h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]"
          />
        )}
        
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-center items-center gap-1 sm:gap-2">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary fill-primary" />
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold px-2"
              style={{ color: celebration.theme?.primaryColor || '#9B7EDE' }}
            >
              {celebration.title}
            </h1>
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary fill-primary" />
          </div>
          
          {celebration.subtitle && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light px-4">
              {celebration.subtitle}
            </p>
          )}
          
          {celebration.eventDate && (
            <p className="text-sm sm:text-base md:text-lg text-gray-500 px-4">
              {new Date(celebration.eventDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CelebrationHeader



