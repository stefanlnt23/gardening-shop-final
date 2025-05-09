import { useQuery } from "@tanstack/react-query";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  order: number;
}

export default function FeaturesSection() {
  const { data: featureCardsData, isLoading } = useQuery({
    queryKey: ['/api/feature-cards'],
    refetchOnWindowFocus: false,
  });

  const features: FeatureCard[] = featureCardsData?.cards || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to delivering exceptional garden services with expertise and care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}