import MainLayout from "@/components/layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio'],
    refetchOnWindowFocus: false
  });

  const portfolioItems = data?.portfolioItems || [];

  return (
    <MainLayout>
      <div className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-gray-600">
              Browse through our collection of completed projects and garden transformations.
            </p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Portfolio</h3>
              <p className="text-red-600 mb-4">We encountered a problem while loading our portfolio projects.</p>
              <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.length === 0 ? (
                <div className="col-span-3 text-center p-8">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Portfolio Items Found</h3>
                  <p className="text-gray-600">We're currently updating our portfolio. Please check back later.</p>
                </div>
              ) : (
                portfolioItems.map((item) => (
                  <div key={item.id} className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all">
                    <div className="relative">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full aspect-square object-cover transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button className="bg-white text-green-700 hover:bg-green-50">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{item.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}