import { useState, useEffect, useRef } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const CelebrationVideos = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playingIndex, setPlayingIndex] = useState(null)
  const [visibleVideos, setVisibleVideos] = useState([])
  const videoRefs = useRef({})
  const galleryRef = useRef(null)
  const { theme } = useTheme()
  const animationsEnabled = theme?.animationsEnabled !== false

  const nextVideo = () => {
    // Pause current video
    if (playingIndex !== null && videoRefs.current[playingIndex]) {
      videoRefs.current[playingIndex].pause()
    }
    setCurrentIndex((prev) => (prev + 1) % videos.length)
    setPlayingIndex(null)
  }

  const prevVideo = () => {
    // Pause current video
    if (playingIndex !== null && videoRefs.current[playingIndex]) {
      videoRefs.current[playingIndex].pause()
    }
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)
    setPlayingIndex(null)
  }

  const togglePlay = (index) => {
    if (playingIndex === index) {
      // Pause current video
      if (videoRefs.current[index]) {
        videoRefs.current[index].pause()
      }
      setPlayingIndex(null)
    } else {
      // Pause any other playing video
      if (playingIndex !== null && videoRefs.current[playingIndex]) {
        videoRefs.current[playingIndex].pause()
      }
      // Play selected video
      if (videoRefs.current[index]) {
        videoRefs.current[index].play()
      }
      setPlayingIndex(index)
    }
  }

  // Handle video end
  const handleVideoEnd = (index) => {
    setPlayingIndex(null)
    // Auto-advance to next video
    if (index < videos.length - 1) {
      setTimeout(() => {
        setCurrentIndex(index + 1)
      }, 1000)
    }
  }

  // Auto-slide carousel (only if no video is playing)
  useEffect(() => {
    if (videos.length <= 1 || playingIndex !== null) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length)
    }, 8000) // Change video every 8 seconds
    return () => clearInterval(interval)
  }, [videos.length, playingIndex])

  useEffect(() => {
    // Staggered animation for videos
    if (animationsEnabled) {
      const timer = setTimeout(() => {
        videos.forEach((_, index) => {
          setTimeout(() => {
            setVisibleVideos(prev => [...prev, index])
          }, index * 100) // 100ms delay between each video
        })
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setVisibleVideos(videos.map((_, i) => i))
    }
  }, [videos, animationsEnabled])

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!animationsEnabled || !galleryRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const videoElements = galleryRef.current.querySelectorAll('.video-item')
    videoElements.forEach((el) => observer.observe(el))

    return () => {
      videoElements.forEach((el) => observer.unobserve(el))
    }
  }, [videos, animationsEnabled])

  if (!videos || videos.length === 0) return null

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 
          className={`text-2xl sm:text-3xl font-serif font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800 ${
            animationsEnabled ? 'animate-fade-in-up' : ''
          }`}
        >
          Our Videos
        </h2>
        
        {/* Carousel Container */}
        <div 
          ref={galleryRef}
          className="relative w-full"
        >
          {/* Main Carousel Video */}
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-black">
            {videos.map((video, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video}
                  className="w-full h-full object-contain"
                  onEnded={() => handleVideoEnd(index)}
                  onPlay={() => setPlayingIndex(index)}
                  onPause={() => {
                    if (playingIndex === index) {
                      setPlayingIndex(null)
                    }
                  }}
                  playsInline
                  controls={playingIndex === index}
                />
                
                {/* Play/Pause Overlay */}
                {playingIndex !== index && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <button
                      onClick={() => togglePlay(index)}
                      className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-4 sm:p-5 md:p-6 shadow-lg transition-all duration-300 hover:scale-110 touch-manipulation"
                      aria-label="Play video"
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="currentColor" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Navigation Arrows */}
            {videos.length > 1 && (
              <>
                <button
                  onClick={prevVideo}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 touch-manipulation"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={nextVideo}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 touch-manipulation"
                  aria-label="Next video"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
              </>
            )}
            
            {/* Video Counter */}
            {videos.length > 1 && (
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                {currentIndex + 1} / {videos.length}
              </div>
            )}
          </div>
          
          {/* Thumbnail Strip */}
          {videos.length > 1 && (
            <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Pause current video
                    if (playingIndex !== null && videoRefs.current[playingIndex]) {
                      videoRefs.current[playingIndex].pause()
                    }
                    setCurrentIndex(index)
                    setPlayingIndex(null)
                  }}
                  className={`flex-shrink-0 w-20 h-12 sm:w-24 sm:h-14 md:w-32 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 relative touch-manipulation ${
                    index === currentIndex 
                      ? 'border-primary scale-105 sm:scale-110 shadow-lg' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  {index === currentIndex && playingIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  )}
                  {index === currentIndex && playingIndex !== index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="currentColor" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </section>
  )
}

export default CelebrationVideos


