import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoPlay || features.length <= 4) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);

      // Force carousel to scroll to the next slide
      if (features.length > 0) {
        const api = document.querySelector('.embla__viewport')?.__emblaApi__;
        if (api) api.scrollTo((currentSlide + 1) % features.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, features.length, currentSlide]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">De Ce Să Ne Alegeți</h2>
          <p className="text-gray-600">
            Suntem dedicați să oferim servicii excepționale pentru grădină cu expertiză și grijă.
          </p>
        </div>

        {features.length > 0 && (
          <div 
            className="relative" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            {features.length <= 4 ? (
              // Regular grid for 4 or fewer items
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => (
                  <div key={feature.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow h-full">
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
                ))}
              </div>
            ) : (
              // Carousel for more than 4 items
              <Carousel
                className="w-full"
                setApi={(api) => {
                  if (api) {
                    api.on('select', () => setCurrentSlide(api.selectedScrollSnap()));
                  }
                }}
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {features.map((feature) => (
                    <CarouselItem key={feature.id} className="md:basis-1/2 lg:basis-1/4">
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow h-full">
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
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
                  <CarouselPrevious className="bg-white border border-green-200 hover:bg-green-50" />
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <CarouselNext className="bg-white border border-green-200 hover:bg-green-50" />
                </div>

                <div className="flex justify-center mt-6 space-x-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        currentSlide === index ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                      onClick={() => {
                        const api = document.querySelector('.embla__viewport')?.__emblaApi__;
                        if (api) api.scrollTo(index);
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </Carousel>
            )}
          </div>
        )}
      </div>
    </section>
  );
}