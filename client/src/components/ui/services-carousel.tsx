
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "embla-carousel-react";

export function ServicesCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const animationRef = useRef<number | null>(null);

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['/api/services'],
    refetchOnWindowFocus: false,
  });

  const services = servicesData?.services || [];

  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Handle auto-play functionality
  useEffect(() => {
    if (!api || services.length <= 1) return;
    
    const startAutoPlay = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      const animate = () => {
        if (!autoPlay || !api) return;

        // Move to next slide with smooth animation
        const nextIndex = (current + 1) % count;
        api.scrollTo(nextIndex, { duration: 2000 });
        
        // Schedule the next scroll after the animation completes
        animationRef.current = window.setTimeout(() => {
          if (autoPlay) {
            animationRef.current = requestAnimationFrame(animate);
          }
        }, 3000);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const stopAutoPlay = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };

    if (autoPlay) {
      stopAutoPlay();
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => stopAutoPlay();
  }, [api, autoPlay, services.length, current, count]);

  const handleMouseEnter = () => {
    setAutoPlay(false);
    // Cancel any ongoing animation immediately
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };
  
  const handleMouseLeave = () => {
    setAutoPlay(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <div className="animate-pulse w-8 h-8 bg-green-200 rounded-full"></div>
              </div>
              <div className="space-y-3 w-full">
                <div className="animate-pulse h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="animate-pulse h-4 bg-gray-100 rounded w-full"></div>
                <div className="animate-pulse h-4 bg-gray-100 rounded w-5/6 mx-auto"></div>
                <div className="animate-pulse h-4 bg-gray-100 rounded w-4/6 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {services.map((service) => (
            <CarouselItem key={service.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 transition-all duration-300">
              <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4 h-full">
                  {service.imageUrl ? (
                    <div className="w-full h-40 overflow-hidden rounded-md mb-4">
                      <img 
                        src={service.imageUrl} 
                        alt={service.name} 
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span className="text-green-600 text-2xl">
                        <i className="fas fa-leaf"></i>
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-gray-600 flex-grow">
                    {service.description.length > 120
                      ? `${service.description.substring(0, 120)}...`
                      : service.description}
                  </p>
                  <div className="w-full flex flex-col items-center mt-auto">
                    <span className="text-green-600 font-semibold mb-3">{service.price}</span>
                    <Link href={`/services/${service.id}`}>
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4 hover:bg-green-50 border-green-200 hover:border-green-300" />
        <CarouselNext className="hidden md:flex -right-4 hover:bg-green-50 border-green-200 hover:border-green-300" />
      </Carousel>
      
      {/* Carousel indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === current ? "bg-green-600" : "bg-gray-300"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
