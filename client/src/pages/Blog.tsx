import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with Remix",
      excerpt: "Learn the basics of setting up your first Remix application and the core concepts.",
      date: "May 15, 2023",
      author: "John Doe"
    },
    {
      id: 2,
      title: "Nested Routing in Remix",
      excerpt: "Discover how to create complex layouts with nested routes in your Remix applications.",
      date: "June 2, 2023",
      author: "Jane Smith"
    },
    {
      id: 3,
      title: "Data Loading Strategies",
      excerpt: "Explore different approaches to loading data in your Remix applications for optimal performance.",
      date: "July 10, 2023",
      author: "Alex Johnson"
    }
  ];

  return (
    <MainLayout>
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Blog
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              The latest news, tutorials, and updates from the Remix team.
            </p>
            
            <div className="space-y-8">
              {blogPosts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
