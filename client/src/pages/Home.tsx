import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import { HomeCarousel } from "@/components/ui/home-carousel";
import { ServicesCarousel } from "@/components/ui/services-carousel";

export default function Home() {
  // State for the testimonial carousel
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Get services data
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ['/api/services'],
    refetchOnWindowFocus: false,
  });

  // Get testimonials data
  const { data: testimonialsData, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['/api/testimonials'],
    refetchOnWindowFocus: false,
  });

  // Feature services (limit to 3)
  const featuredServices = servicesData?.services?.filter(service => service.featured).slice(0, 3) || [];

  // Testimonials
  const testimonials = testimonialsData?.testimonials || [];

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveTestimonial((current) => 
        current === testimonials.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <MainLayout>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20 md:py-32 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-green-300"></div>
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-green-200"></div>
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-green-400"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-6">
                Professional Garden Services
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Transform Your Outdoor Space Into a <span className="text-green-600 relative">
                  Paradise
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-green-200 -z-10"></span>
                </span>
              </h1>
              <p className="text-lg mb-8 text-gray-700 max-w-lg">
                Professional gardening services to make your garden beautiful, sustainable, and thriving all year round. Our expert team brings your garden dreams to life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                    Get a Free Quote
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center text-gray-600">
                <span className="flex items-center mr-6">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  Experienced Team
                </span>
                <span className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  Quality Guarantee
                </span>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="shadow-2xl rounded-lg overflow-hidden border-8 border-white">
                <HomeCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-green-50 opacity-50 clip-path-slant"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-4">
              Expert Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Our Services
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">
              We provide comprehensive gardening and landscaping services to keep your outdoor space beautiful and healthy throughout all seasons.
            </p>
          </div>

          {/* Services Carousel */}
          <div className="px-4 md:px-8 lg:px-12">
            <ServicesCarousel />
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button className="bg-green-600 hover:bg-green-700">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Garden?</h2>
            <p className="text-lg mb-8 text-green-100">
              Schedule a consultation with our expert gardeners today and get a personalized plan for your outdoor space.
            </p>
            <Link href="/contact">
              <Button className="bg-white text-green-700 hover:bg-green-100 px-8 py-3 text-lg">
                Contact Us Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Choose Us</h2>
            <p className="text-gray-600">
              We're committed to delivering exceptional garden services with expertise and care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Gardeners</h3>
              <p className="text-gray-600">Our team consists of certified and experienced gardening professionals</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-leaf text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eco-Friendly Practices</h3>
              <p className="text-gray-600">We use sustainable methods and materials in all our garden work</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-check text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reliable Service</h3>
              <p className="text-gray-600">Always on time with consistent, dependable garden maintenance</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-award text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">We stand behind our work with a 100% satisfaction guarantee</p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/services">
              <Button className="bg-green-600 hover:bg-green-700">
                Explore Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">What Our Clients Say</h2>
            <p className="text-gray-600">
              Hear from our satisfied customers about their experiences with our services.
            </p>
          </div>

          {isLoadingTestimonials ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="animate-pulse w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      <div className="space-y-2 w-full">
                        <div className="animate-pulse h-3 bg-gray-200 rounded w-full"></div>
                        <div className="animate-pulse h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
                        <div className="animate-pulse h-3 bg-gray-200 rounded w-4/6 mx-auto"></div>
                      </div>
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Show 3 testimonials at a time, based on the active one */}
                {[0, 1, 2].map((offset) => {
                  const index = (activeTestimonial + offset) % testimonials.length;
                  const testimonial = testimonials[index];
                  
                  return testimonial ? (
                    <Card key={testimonial.id} className="shadow-lg transform transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          {testimonial.photoUrl ? (
                            <img 
                              src={testimonial.photoUrl} 
                              alt={testimonial.name}
                              className="w-16 h-16 object-cover rounded-full border-2 border-green-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                              <i className="fas fa-user text-green-600 text-2xl"></i>
                            </div>
                          )}
                          <div className="flex items-center justify-center">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <i key={i} className="fas fa-star text-yellow-400 text-sm mr-0.5"></i>
                            ))}
                          </div>
                          <blockquote className="text-lg italic text-gray-800">"{testimonial.comment}"</blockquote>
                          <div>
                            <p className="font-bold text-gray-900">{testimonial.name}</p>
                            {testimonial.company && (
                              <p className="text-sm text-gray-600">{testimonial.company}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null;
                })}
              </div>

              {/* Pagination dots */}
              {testimonials.length > 3 && (
                <div className="flex justify-center space-x-2 mt-6">
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        Math.floor(activeTestimonial / 3) === index ? "bg-green-600" : "bg-gray-300"
                      }`}
                      onClick={() => setActiveTestimonial(index * 3)}
                      aria-label={`Testimonial page ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-center mt-4 space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => setActiveTestimonial((activeTestimonial - 3 + testimonials.length) % testimonials.length)}
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => setActiveTestimonial((activeTestimonial + 3) % testimonials.length)}
                >
                  Next
                  <i className="fas fa-chevron-right ml-2"></i>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">No testimonials available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-300 rounded-md flex items-center justify-center">
                  <i className="fas fa-leaf text-white text-lg"></i>
                </div>
                <span className="text-xl font-bold text-white">
                  Green Garden
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Transforming outdoor spaces into beautiful, sustainable gardens since 2010.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-pinterest-p"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Garden Maintenance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Landscaping
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Planting & Pruning
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Irrigation Systems
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-3 text-green-400"></i>
                  <span>123 Garden Street, Greenville, 12345</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-phone-alt mt-1 mr-3 text-green-400"></i>
                  <span>(123) 456-7890</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-envelope mt-1 mr-3 text-green-400"></i>
                  <span>info@greengarden.com</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-clock mt-1 mr-3 text-green-400"></i>
                  <span>Mon-Fri: 8am - 6pm<br />Sat: 9am - 4pm</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Green Garden Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}