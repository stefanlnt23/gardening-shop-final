
import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";

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

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images: CarouselImage[] = carouselImages?.images || [];

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  // Define a scroll function to advance to the next slide
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-rotate slides
  useEffect(() => {
    if (!autoPlay || images.length <= 1 || !emblaApi) return;
    
    const interval = setInterval(() => {
      scrollNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, images.length, emblaApi, scrollNext]);

  // Update current slide index when slide changes
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // For testing - add default images if none are loaded from the API
  const defaultImages = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      alt: "Garden image 1",
      order: 1
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      alt: "Garden image 2",
      order: 2
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      alt: "Garden image 3",
      order: 3
    }
  ];

  // Use default images if none are available from API
  const displayImages = images.length > 0 ? images : defaultImages;

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

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-xl bg-white p-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayImages.map((image) => (
            <div key={image.id} className="flex-[0_0_100%] min-w-0">
              <Card className="border-0 rounded-lg overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={image.imageUrl} 
                    alt={image.alt || "Garden showcase"} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-center items-center gap-2">
        <button 
          onClick={() => emblaApi?.scrollPrev()} 
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center border border-green-100 text-green-600 hover:bg-green-50"
          aria-label="Previous slide"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="flex space-x-2">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-green-600" : "bg-gray-300"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => emblaApi?.scrollNext()} 
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center border border-green-100 text-green-600 hover:bg-green-50"
          aria-label="Next slide"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
