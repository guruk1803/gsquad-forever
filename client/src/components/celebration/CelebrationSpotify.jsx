import { Music } from 'lucide-react'

const CelebrationSpotify = ({ spotifyCode }) => {
  if (!spotifyCode) return null

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Music className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-serif font-bold text-gray-800">
            Scan and Feel
          </h2>
        </div>
        
        <div className="card bg-white/90 backdrop-blur-sm inline-block">
          <img 
            src={spotifyCode} 
            alt="Spotify Code" 
            className="w-64 h-64 object-contain mx-auto rounded-xl"
          />
          <p className="mt-4 text-gray-600 font-medium">
            Scan with Spotify app to play our playlist
          </p>
        </div>
      </div>
    </section>
  )
}

export default CelebrationSpotify

