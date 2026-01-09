import { Heart } from 'lucide-react'

const CelebrationStory = ({ story }) => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <Heart className="w-10 h-10 text-primary fill-primary animate-float" />
        </div>
        <div 
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: story }}
        />
      </div>
    </section>
  )
}

export default CelebrationStory



