import { QrCode, Heart } from 'lucide-react'

const CelebrationContribution = ({ qrImage, celebrationId }) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Heart className="w-10 h-10 text-primary fill-primary animate-float" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4 text-gray-800">
          Contribute to Our Celebration
        </h2>
        <p className="text-gray-600 mb-8">
          Scan the QR code below to send your contribution via UPI
        </p>
        
        {qrImage ? (
          <div className="card inline-block p-6">
            <img
              src={qrImage}
              alt="UPI QR Code"
              className="w-64 h-64 mx-auto rounded-xl"
            />
          </div>
        ) : (
          <div className="card inline-block p-12">
            <QrCode className="w-32 h-32 mx-auto text-gray-300" />
            <p className="text-gray-500 mt-4">QR code will be available soon</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CelebrationContribution


