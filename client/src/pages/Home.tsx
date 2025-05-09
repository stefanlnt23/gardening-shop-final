import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  import MainLayout from "@/components/layouts/MainLayout";

return (
    <MainLayout>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Transform Your Outdoor Space Into a <span className="text-green-600">Paradise</span>
              </h1>
              <p className="text-lg mb-8 text-gray-700 max-w-lg">
                Professional gardening services to make your garden beautiful, sustainable, and thriving all year round.
              </p>
              <div className="flex space-x-4">
                <Link href="/contact">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                    Get a Quote
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl bg-white p-2">
                <div className="rounded-lg overflow-hidden bg-green-100 aspect-video flex items-center justify-center">
                  <div className="text-green-600 text-6xl">
                    <i className="fas fa-image"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Our Services
            </h2>
            <p className="text-gray-600">
              We provide comprehensive gardening and landscaping services to keep your outdoor space beautiful and healthy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingServices ? (
              Array(3).fill(0).map((_, i) => (
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
              ))
            ) : featuredServices.length > 0 ? (
              featuredServices.map((service) => (
                <Card key={service.id} className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span className="text-green-600 text-2xl">
                        <i className="fas fa-leaf"></i>
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-gray-600 flex-grow">
                      {service.description.length > 120
                        ? `${service.description.substring(0, 120)}...`
                        : service.description}
                    </p>
                    <span className="text-green-600 font-semibold">{service.price}</span>
                    <Link href={`/contact`}>
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full">
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-10">
                <p className="text-gray-500">No services available at the moment.</p>
              </div>
            )}
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
      
      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">What Our Clients Say</h2>
            <p className="text-gray-600">
              Hear from our satisfied customers about their experiences with Green Garden services.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {isLoadingTestimonials ? (
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="animate-pulse w-20 h-20 bg-gray-200 rounded-full"></div>
                    <div className="space-y-3 w-full">
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
                    </div>
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-32 mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ) : testimonials.length > 0 ? (
              <div className="relative">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`transition-opacity duration-500 absolute inset-0 ${
                      index === activeTestimonial ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                    style={{ position: index === activeTestimonial ? "relative" : "absolute" }}
                  >
                    <Card className="shadow-lg">
                      <CardContent className="p-8">
                        <div className="flex flex-col items-center text-center space-y-6">
                          {testimonial.imageUrl ? (
                            <img
                              src={testimonial.imageUrl}
                              alt={testimonial.name}
                              className="w-20 h-20 rounded-full object-cover border-4 border-green-200"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200">
                              <span className="text-green-600 text-2xl">
                                <i className="fas fa-user"></i>
                              </span>
                            </div>
                          )}
                          <div className="text-yellow-400 flex space-x-1">
                            {Array(5).fill(0).map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < (testimonial.rating || 5) ? "text-yellow-400" : "text-gray-300"}`}></i>
                            ))}
                          </div>
                          <blockquote className="text-gray-700 text-lg italic">"{testimonial.content}"</blockquote>
                          <div>
                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                            {testimonial.role && (
                              <p className="text-gray-600 text-sm">{testimonial.role}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}

                {/* Testimonial Controls */}
                {testimonials.length > 1 && (
                  <div className="flex justify-center space-x-2 mt-6">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === activeTestimonial ? "bg-green-600" : "bg-gray-300"
                        }`}
                        onClick={() => setActiveTestimonial(index)}
                        aria-label={`View testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No testimonials available yet.</p>
              </div>
            )}
          </div>
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
    </div>
  );
}