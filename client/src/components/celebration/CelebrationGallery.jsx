import { useState } from 'react'
import { X } from 'lucide-react'

const CelebrationGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <section className="py-16 px-4 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-gray-800">
          Our Memories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
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


