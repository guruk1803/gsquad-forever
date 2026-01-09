import { Heart } from 'lucide-react'

const CelebrationHeader = ({ celebration }) => {
  return (
    <div 
      className="relative min-h-[60vh] flex items-center justify-center text-center px-4 py-20"
      style={{
        background: `linear-gradient(135deg, ${celebration.theme?.primaryColor || '#9B7EDE'}15 0%, ${celebration.theme?.secondaryColor || '#E8D5FF'}15 100%)`
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
        {celebration.coverImage && (
          <img 
            src={celebration.coverImage} 
            alt={celebration.title}
            className="w-full max-w-2xl mx-auto rounded-3xl shadow-2xl object-cover"
          />
        )}
        
        <div className="space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 
              className="text-4xl md:text-6xl font-serif font-bold"
              style={{ color: celebration.theme?.primaryColor || '#9B7EDE' }}
            >
              {celebration.title}
            </h1>
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </div>
          
          {celebration.subtitle && (
            <p className="text-xl md:text-2xl text-gray-600 font-light">
              {celebration.subtitle}
            </p>
          )}
          
          {celebration.eventDate && (
            <p className="text-lg text-gray-500">
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



