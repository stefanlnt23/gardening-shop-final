import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      role: "Founder & Head Gardener",
      bio: "With over 20 years of experience in landscape design and garden maintenance, John founded Green Garden Services with a vision to create beautiful outdoor spaces that thrive in harmony with nature.",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Landscape Designer",
      bio: "Sarah holds a degree in Landscape Architecture and specializes in creating sustainable garden designs that are both beautiful and environmentally friendly.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      name: "Michael Wong",
      role: "Garden Maintenance Specialist",
      bio: "Michael's expertise in plant health and garden maintenance ensures that every garden we care for remains vibrant and healthy throughout the seasons.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Plant Specialist",
      bio: "With a background in botany, Emily helps our clients select the perfect plants for their specific needs, considering climate, soil conditions, and maintenance requirements.",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  return (
    <MainLayout>
      {/* Hero section */}
      <div className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About Green Garden Services
            </h1>
            <p className="text-xl text-gray-600">
              Transforming outdoor spaces into beautiful, sustainable gardens since 2005.
            </p>
          </div>
        </div>
      </div>

      {/* Our story section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-green max-w-none">
                <p>
                  Green Garden Services was founded in 2005 with a simple mission: to create beautiful, 
                  sustainable gardens that bring joy and enhance the environment.
                </p>
                <p>
                  What started as a small one-person operation has grown into a team of dedicated professionals
                  who share a passion for plants, design, and ecological gardening practices.
                </p>
                <p>
                  Today, we serve both residential and commercial clients throughout the region, providing 
                  comprehensive garden design, installation, and maintenance services that prioritize 
                  sustainability and biodiversity.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80" 
                alt="Garden maintenance" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-lg text-gray-600">
              At Green Garden Services, we're guided by a set of core values that inform everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-leaf text-green-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  We believe in working with nature, not against it. Our practices promote ecological health and minimize environmental impact.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-star text-green-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We take pride in our work and strive for excellence in every aspect of our service, from design to execution to ongoing care.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-users text-green-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                <p className="text-gray-600">
                  We're committed to building lasting relationships with our clients and contributing positively to our local community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              Our dedicated team of garden professionals brings expertise, creativity, and passion to every project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                <img 
                  src={member.imageUrl} 
                  alt={member.name}
                  className="w-full aspect-square object-cover" 
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}