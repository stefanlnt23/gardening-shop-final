import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const resources = [
    { href: "/docs", label: "Documentation" },
    { href: "/docs", label: "Tutorials" },
    { href: "/docs", label: "Examples" },
    { href: "/blog", label: "Blog" },
  ];

  const company = [
    { href: "/docs", label: "About" },
    { href: "/docs", label: "Careers" },
    { href: "/contact", label: "Contact" },
    { href: "/docs", label: "Privacy" },
  ];

  const socialLinks = [
    { href: "#", icon: "fab fa-twitter" },
    { href: "#", icon: "fab fa-github" },
    { href: "#", icon: "fab fa-discord" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-md flex items-center justify-center">
                <i className="fas fa-bolt text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold">Remix</span>
            </div>
            <p className="text-gray-400 mb-4">
              Build better websites with modern web standards.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  className="text-gray-400 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <Link 
                    href={resource.href} 
                    className="text-gray-400 hover:text-white"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {company.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="text-gray-400 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest Remix news and updates.
            </p>
            <form className="flex">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="rounded-r-none text-gray-800 focus:outline-none" 
              />
              <Button 
                type="submit" 
                className="rounded-l-none bg-primary hover:bg-blue-700"
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Remix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
