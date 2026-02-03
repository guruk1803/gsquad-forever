import { Music } from 'lucide-react'

const CelebrationSpotify = ({ spotifyCode }) => {
  if (!spotifyCode) return null

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Music className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
            Scan and Feel
          </h2>
        </div>
        
        <div className="card bg-white/90 backdrop-blur-sm inline-block p-4 sm:p-6">
          <img 
            src={spotifyCode} 
            alt="Spotify Code" 
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain mx-auto rounded-xl"
          />
          <p className="mt-3 sm:mt-4 text-gray-600 font-medium text-sm sm:text-base">
            Scan with Spotify app to play our playlist
          </p>
        </div>
      </div>
    </section>
  )
}

export default CelebrationSpotify

