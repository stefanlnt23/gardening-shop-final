const features = [
  {
    id: 1,
    icon: "fas fa-bolt",
    iconBg: "bg-blue-100",
    iconColor: "text-primary",
    title: "Fast Page Loads",
    description: "Deliver the smallest amount of JavaScript possible, loading what's needed when it's needed."
  },
  {
    id: 2,
    icon: "fas fa-server",
    iconBg: "bg-purple-100",
    iconColor: "text-secondary",
    title: "Server Rendering",
    description: "Leverage server rendering for improved performance and better SEO out of the box."
  },
  {
    id: 3,
    icon: "fas fa-code-branch",
    iconBg: "bg-amber-100",
    iconColor: "text-accent",
    title: "Nested Routing",
    description: "Create complex layouts and page structures with nested routes that just work."
  },
  {
    id: 4,
    icon: "fas fa-shield-alt",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Data Loading",
    description: "Load data for your components before rendering to ensure consistent user experiences."
  },
  {
    id: 5,
    icon: "fas fa-exclamation-circle",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    title: "Error Boundaries",
    description: "Handle errors gracefully with built-in error boundaries at any level of your application."
  },
  {
    id: 6,
    icon: "fas fa-mobile-alt",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    title: "Mobile Friendly",
    description: "Build responsive applications that work beautifully across all device sizes."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Remix?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Remix provides a seamless development experience with powerful features that help you build better websites.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                <i className={`${feature.icon} ${feature.iconColor} text-xl`}></i>
              </div>
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