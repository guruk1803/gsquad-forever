import { Heart } from 'lucide-react'

const CelebrationStory = ({ story }) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-6 sm:mb-8">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary fill-primary animate-float" />
        </div>
        <div 
          className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-gray-700 prose-headings:text-gray-800 prose-p:leading-relaxed prose-img:rounded-xl prose-img:shadow-lg prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: story }}
        />
      </div>
    </section>
  )
}

export default CelebrationStory



