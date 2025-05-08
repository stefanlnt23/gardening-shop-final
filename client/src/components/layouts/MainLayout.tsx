import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
    { path: "/appointment", label: "Book Appointment" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-md flex items-center justify-center">
                  <i className="fas fa-leaf text-white text-lg"></i>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-700">
                  Green Garden
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-medium ${
                    location === link.path
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
              </button>
            </div>

            {/* Call to Action */}
            <div className="hidden md:block">
              <Link href="/appointment">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location === link.path
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/appointment"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
