
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export default function FeaturesSection() {
  const { data: featureCardsData, isLoading } = useQuery({
    queryKey: ['/api/feature-cards'],
    refetchOnWindowFocus: false,
  });

  const features: FeatureCard[] = featureCardsData?.cards || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // For desktop, show 3 cards at a time
  const cardsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };
  
  // Auto-rotate carousel
  useEffect(() => {
    if (autoPlay && features.length > cardsPerPage.desktop) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoPlay, features.length, currentIndex]);
  
  // Pagination controls
  const nextSlide = () => {
    setCurrentIndex((prev) => 
      (prev + 1) % (features.length - cardsPerPage.desktop + 1)
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => 
      (prev - 1 + (features.length - cardsPerPage.desktop + 1)) % 
      (features.length - cardsPerPage.desktop + 1)
    );
  };
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to delivering exceptional garden services with expertise and care.
          </p>
        </div>

        {features.length > 0 && (
          <div 
            className="relative" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / cardsPerPage.desktop)}%)`,
                  width: `${(features.length / cardsPerPage.desktop) * 100}%`
                }}
              >
                {features.map((feature) => (
                  <div 
                    key={feature.id} 
                    className="px-4"
                    style={{ width: `${100 / features.length}%` }}
                  >
                    <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow h-full">
                      {feature.imageUrl && (
                        <div className="mb-4 h-48 overflow-hidden rounded-lg">
                          <img 
                            src={feature.imageUrl} 
                            alt={feature.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {features.length > cardsPerPage.desktop && (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                {/* Dots Indicator */}
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: features.length - cardsPerPage.desktop + 1 }).map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        currentIndex === index ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
