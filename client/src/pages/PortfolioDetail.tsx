
import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function PortfolioDetail() {
  const { id } = useParams();
  
  // Fetch portfolio item details
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio/item', id],
    queryFn: async () => {
      const response = await fetch(`/api/portfolio/item/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio item');
      }
      return response.json();
    },
    refetchOnWindowFocus: false
  });
  
  const portfolioItem = data?.portfolioItem;
  
  // Fetch service details if serviceId exists
  const { data: serviceData } = useQuery({
    queryKey: ['/api/services', portfolioItem?.serviceId],
    queryFn: async () => {
      if (!portfolioItem?.serviceId) return null;
      const response = await fetch(`/api/services/${portfolioItem.serviceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }
      return response.json();
    },
    enabled: !!portfolioItem?.serviceId,
    refetchOnWindowFocus: false
  });
  
  const service = serviceData?.service;
  
  // Update view count when the page loads
  useEffect(() => {
    // In a real application, you would update the view count here
    // This would typically be an API call to increment the view count
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-80 bg-gray-200 rounded mb-8"></div>
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !portfolioItem) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 p-8 rounded-lg text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Project Not Found</h2>
            <p className="text-red-600 mb-6">We couldn't find the project you're looking for. It may have been removed or the URL might be incorrect.</p>
            <Button onClick={() => window.history.back()} className="mr-4">
              Go Back
            </Button>
            <Button onClick={() => window.location.href = "/portfolio"} variant="outline">
              View All Projects
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Project Header */}
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()} 
                className="mb-6"
              >
                <i className="fas fa-arrow-left mr-2"></i> Back to Portfolio
              </Button>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {portfolioItem.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {portfolioItem.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Featured Project
                  </Badge>
                )}
                
                {service && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    {service.name}
                  </Badge>
                )}
                
                {portfolioItem.difficultyLevel && (
                  <Badge variant="outline" className={`
                    ${portfolioItem.difficultyLevel === 'Easy' ? 'bg-green-50 text-green-800 border-green-200' : ''}
                    ${portfolioItem.difficultyLevel === 'Moderate' ? 'bg-orange-50 text-orange-800 border-orange-200' : ''}
                    ${portfolioItem.difficultyLevel === 'Complex' ? 'bg-red-50 text-red-800 border-red-200' : ''}
                  `}>
                    {portfolioItem.difficultyLevel} Complexity
                  </Badge>
                )}
                
                {portfolioItem.date && (
                  <div className="text-sm text-gray-500">
                    Completed on {format(new Date(portfolioItem.date), "MMMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>
            
            {/* Main Content */}
            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="before-after">Before & After</TabsTrigger>
                {portfolioItem.clientTestimonial?.clientName && portfolioItem.clientTestimonial?.displayPermission && (
                  <TabsTrigger value="testimonial">Client Testimonial</TabsTrigger>
                )}
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Main Image */}
                {portfolioItem.imageUrl && (
                  <div className="rounded-lg overflow-hidden shadow-lg mb-8">
                    <img 
                      src={portfolioItem.imageUrl} 
                      alt={portfolioItem.title} 
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                {/* Project Details */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2">Location</h3>
                      <p>{portfolioItem.location || "Not specified"}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2">Duration</h3>
                      <p>{portfolioItem.projectDuration || "Not specified"}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2">Service Type</h3>
                      <p>{service?.name || "General Project"}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Project Description */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Project Description</h2>
                  <div className="prose prose-green max-w-none">
                    <p className="whitespace-pre-line">{portfolioItem.description}</p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Before & After Tab */}
              <TabsContent value="before-after">
                <div className="space-y-12">
                  {portfolioItem.images && portfolioItem.images.length > 0 ? (
                    portfolioItem.images.map((image, index) => (
                      <div key={index} className="mb-12">
                        <h3 className="text-xl font-semibold mb-4">{image.caption || `Transformation ${index + 1}`}</h3>
                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <h4 className="text-lg font-medium mb-2">Before</h4>
                            <div className="rounded-lg overflow-hidden border shadow">
                              <img 
                                src={image.before} 
                                alt={`Before ${image.caption || `Transformation ${index + 1}`}`} 
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-medium mb-2">After</h4>
                            <div className="rounded-lg overflow-hidden border shadow">
                              <img 
                                src={image.after} 
                                alt={`After ${image.caption || `Transformation ${index + 1}`}`} 
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-12 bg-gray-50 rounded-lg">
                      <i className="fas fa-images text-4xl text-gray-400 mb-4"></i>
                      <h3 className="text-xl font-medium text-gray-600 mb-2">No Before & After Images</h3>
                      <p className="text-gray-500">This project doesn't have any before & after images to display.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Client Testimonial Tab */}
              {portfolioItem.clientTestimonial?.clientName && portfolioItem.clientTestimonial?.displayPermission && (
                <TabsContent value="testimonial">
                  <div className="bg-green-50 p-8 rounded-lg border border-green-100">
                    <div className="text-4xl text-green-500 mb-4">"</div>
                    <blockquote className="text-xl italic text-gray-700 mb-6">
                      {portfolioItem.clientTestimonial.comment}
                    </blockquote>
                    <div className="font-semibold text-right">
                      — {portfolioItem.clientTestimonial.clientName}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            {/* Call to Action */}
            <div className="bg-green-50 p-8 rounded-lg border border-green-100 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Inspired by this project?</h2>
              <p className="text-lg text-gray-700 mb-6">
                Let us transform your garden or outdoor space with our professional services.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = "/appointment"}
                >
                  Book an Appointment
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/contact"}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
