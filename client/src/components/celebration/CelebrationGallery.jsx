import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const CelebrationGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleImages, setVisibleImages] = useState([])
  const galleryRef = useRef(null)
  const { theme } = useTheme()
  const animationsEnabled = theme?.animationsEnabled !== false

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Auto-slide carousel
  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds
    return () => clearInterval(interval)
  }, [images.length])

  useEffect(() => {
    // Staggered animation for images
    if (animationsEnabled) {
      const timer = setTimeout(() => {
        images.forEach((_, index) => {
          setTimeout(() => {
            setVisibleImages(prev => [...prev, index])
          }, index * 100) // 100ms delay between each image
        })
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setVisibleImages(images.map((_, i) => i))
    }
  }, [images, animationsEnabled])

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

    const imageElements = galleryRef.current.querySelectorAll('.gallery-item')
    imageElements.forEach((el) => observer.observe(el))

    return () => {
      imageElements.forEach((el) => observer.unobserve(el))
    }
  }, [images, animationsEnabled])

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-white/50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 
          className={`text-2xl sm:text-3xl font-serif font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800 ${
            animationsEnabled ? 'animate-fade-in-up' : ''
          }`}
        >
          Our Memories
        </h2>
        
        {/* Carousel Container */}
        <div 
          ref={galleryRef}
          className="relative w-full"
        >
          {/* Main Carousel Image */}
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === currentIndex ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            ))}
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 touch-manipulation"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 touch-manipulation"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
          
          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 touch-manipulation ${
                    index === currentIndex 
                      ? 'border-primary scale-105 sm:scale-110 shadow-lg' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
      </div>
      
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 touch-manipulation"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

export default CelebrationGallery



