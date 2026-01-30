import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const CelebrationGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [visibleImages, setVisibleImages] = useState([])
  const galleryRef = useRef(null)
  const { theme } = useTheme()
  const animationsEnabled = theme?.animationsEnabled !== false

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
    <section className="py-16 px-4 bg-white/50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 
          className={`text-3xl font-serif font-bold text-center mb-12 text-gray-800 ${
            animationsEnabled ? 'animate-fade-in-up' : ''
          }`}
        >
          Our Memories
        </h2>
        
        <div 
          ref={galleryRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {images.map((image, index) => {
            const isVisible = visibleImages.includes(index)
            const animationDelay = animationsEnabled ? index * 0.1 : 0
            const slideDirection = index % 2 === 0 ? -32 : 32 // -32px left, 32px right
            
            return (
              <div
                key={index}
                className="gallery-item relative aspect-square rounded-xl overflow-hidden cursor-pointer group transition-all duration-700 ease-out"
                style={{
                  opacity: animationsEnabled ? (isVisible ? 1 : 0) : 1,
                  transform: animationsEnabled 
                    ? isVisible 
                      ? 'translateY(0) translateX(0)' 
                      : `translateY(32px) translateX(${slideDirection}px)`
                    : 'none',
                  transitionDelay: `${animationDelay}s`,
                }}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 pointer-events-none" />
                
                {/* Shine/sweep effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              </div>
            )
          })}
        </div>
      </div>
      
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
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



