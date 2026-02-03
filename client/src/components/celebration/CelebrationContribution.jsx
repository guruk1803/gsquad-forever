import { QrCode, Heart } from 'lucide-react'

const CelebrationContribution = ({ qrImage, celebrationId }) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-4 sm:mb-6">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary fill-primary animate-float" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3 sm:mb-4 text-gray-800 px-4">
          Contribute to Our Celebration
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-4">
          Scan the QR code below to send your contribution via UPI
        </p>
        
        {qrImage ? (
          <div className="card inline-block p-4 sm:p-6">
            <img
              src={qrImage}
              alt="UPI QR Code"
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto rounded-xl"
            />
          </div>
        ) : (
          <div className="card inline-block p-8 sm:p-12">
            <QrCode className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-gray-300" />
            <p className="text-gray-500 mt-4 text-sm sm:text-base">QR code will be available soon</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CelebrationContribution



