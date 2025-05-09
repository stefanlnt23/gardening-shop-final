
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";

interface CarouselImage {
  id: string;
  imageUrl: string;
  alt: string;
  order: number;
}

export function HomeCarousel() {
  const { data: carouselImages, isLoading } = useQuery({
    queryKey: ['/api/carousel-images'],
    refetchOnWindowFocus: false,
  });

  const [autoPlay, setAutoPlay] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images: CarouselImage[] = carouselImages?.images || [];

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  // Auto-rotate slides
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    
    const interval = setInterval(() => {
      const nextSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
      setCurrentSlide(nextSlide);
      
      // Force carousel to scroll to the next slide
      if (carouselImages?.images?.length > 0) {
        const api = document.querySelector('.embla__viewport')?.__emblaApi__;
        if (api) api.scrollTo(nextSlide);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, images.length, currentSlide, carouselImages]);

  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden shadow-xl bg-white p-2">
        <div className="rounded-lg overflow-hidden bg-green-100 aspect-video flex items-center justify-center">
          <div className="text-green-600 text-6xl animate-pulse">
            <i className="fas fa-image"></i>
          </div>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden shadow-xl bg-white p-2">
        <div className="rounded-lg overflow-hidden bg-green-100 aspect-video flex items-center justify-center">
          <div className="text-green-600 text-6xl">
            <i className="fas fa-image"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-xl bg-white p-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel 
        className="w-full" 
        setApi={(api) => {
          if (api) {
            api.on('select', () => setCurrentSlide(api.selectedScrollSnap()));
          }
        }}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <Card className="border-0 rounded-lg overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={image.imageUrl} 
                    alt={image.alt || "Garden showcase"} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      <div className="flex justify-center space-x-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-green-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
