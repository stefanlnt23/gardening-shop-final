import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Public Page imports
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";

// Admin Page imports
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";

// Lazy load admin pages to improve initial load time
const AdminServices = React.lazy(() => import("@/pages/admin/Services"));
const AdminServicesForm = React.lazy(() => import("@/pages/admin/ServicesForm"));
const AdminPortfolio = React.lazy(() => import("@/pages/admin/Portfolio"));
const AdminPortfolioForm = React.lazy(() => import("@/pages/admin/PortfolioForm"));

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Admin Services */}
      <Route path="/admin/services/new">
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminServicesForm />
        </React.Suspense>
      </Route>
      <Route path="/admin/services/:id">
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminServicesForm />
        </React.Suspense>
      </Route>
      <Route path="/admin/services">
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminServices />
        </React.Suspense>
      </Route>
      
      {/* Admin Portfolio */}
      <Route path="/admin/portfolio/new">
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminPortfolioForm />
        </React.Suspense>
      </Route>
      <Route path="/admin/portfolio/:id">
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminPortfolioForm />
        </React.Suspense>
      </Route>
      <Route path="/admin/portfolio">
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminPortfolio />
        </React.Suspense>
      </Route>
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
