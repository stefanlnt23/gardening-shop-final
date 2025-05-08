import React, { ReactNode } from "react";
import { Link, useLocation } from "wouter";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminLayout({ children, title, description, action }: AdminLayoutProps) {
  const [location] = useLocation();
  
  // Admin navigation items
  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "fas fa-chart-line" },
    { label: "Services", path: "/admin/services", icon: "fas fa-tools" },
    { label: "Portfolio", path: "/admin/portfolio", icon: "fas fa-images" },
    { label: "Appointments", path: "/admin/appointments", icon: "fas fa-calendar-alt" },
    { label: "Inquiries", path: "/admin/inquiries", icon: "fas fa-envelope" },
    { label: "Blog Posts", path: "/admin/blog", icon: "fas fa-blog" },
    { label: "Testimonials", path: "/admin/testimonials", icon: "fas fa-star" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-400 rounded-md flex items-center justify-center">
              <i className="fas fa-leaf text-white text-lg"></i>
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
              Green Garden
            </span>
          </div>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location === item.path 
                      ? "bg-green-50 text-green-700" 
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}>
                    <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 absolute bottom-0 w-64">
          <div className="border-t pt-4">
            <Link href="/">
              <a className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <i className="fas fa-home mr-3"></i> 
                View Website
              </a>
            </Link>
            <Link href="/">
              <a className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <i className="fas fa-sign-out-alt mr-3"></i> 
                Sign Out
              </a>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="bg-white p-4 shadow-sm md:hidden w-full fixed top-0 z-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-400 rounded-md flex items-center justify-center">
            <i className="fas fa-leaf text-white text-lg"></i>
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
            Green Garden
          </span>
        </div>
        <button 
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => document.getElementById("mobile-menu")?.classList.toggle("hidden")}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className="fixed inset-0 bg-gray-800 bg-opacity-75 z-10 hidden md:hidden">
        <div className="bg-white w-64 min-h-screen shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-400 rounded-md flex items-center justify-center">
                <i className="fas fa-leaf text-white text-lg"></i>
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                Green Garden
              </span>
            </div>
            <button 
              className="text-gray-500"
              onClick={() => document.getElementById("mobile-menu")?.classList.add("hidden")}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a 
                      className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                        location === item.path 
                          ? "bg-green-50 text-green-700" 
                          : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                      }`}
                      onClick={() => document.getElementById("mobile-menu")?.classList.add("hidden")}
                    >
                      <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 pt-4 md:p-8 md:pt-8 mt-16 md:mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && <p className="text-gray-500">{description}</p>}
            </div>
            {action && (
              <div className="mt-4 md:mt-0 flex space-x-3">
                {action}
              </div>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}