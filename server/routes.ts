import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { comparePasswords } from "./auth";
import { z } from "zod";
import { 
  insertServiceSchema,
  insertPortfolioItemSchema,
  insertBlogPostSchema,
  insertInquirySchema,
  insertAppointmentSchema,
  insertTestimonialSchema 
} from "@shared/schema";

// Authentication middleware
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  // For simplicity, we're not implementing real auth in this example
  // In a real application, you'd check session/token validity here
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API Status route
  app.get("/api/status", (req, res) => {
    res.json({ status: "ok", message: "Green Garden Services API is running!" });
  });

  // =========== PUBLIC API ROUTES ===========

  // Services API
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json({ services });
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/featured", async (req, res) => {
    try {
      const featuredServices = await storage.getFeaturedServices();
      res.json({ services: featuredServices });
    } catch (error) {
      console.error("Error fetching featured services:", error);
      res.status(500).json({ message: "Failed to fetch featured services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      // With MongoDB we need to use the string ID directly instead of parsing to integer
      const id = req.params.id;
      console.log(`Fetching service with ID: ${id}`);
      
      const service = await storage.getService(id);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json({ service });
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Portfolio API
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      res.json({ portfolioItems });
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  app.get("/api/portfolio/item/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const portfolioItem = await storage.getPortfolioItem(id);
      
      if (!portfolioItem) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      
      res.json({ portfolioItem });
    } catch (error) {
      console.error("Error fetching portfolio item:", error);
      res.status(500).json({ message: "Failed to fetch portfolio item" });
    }
  });

  app.get("/api/portfolio/service/:serviceId", async (req, res) => {
    try {
      // With MongoDB we need to use the string ID directly instead of parsing to integer
      const serviceId = req.params.serviceId;
      console.log(`Fetching portfolio items for service with ID: ${serviceId}`);
      
      const portfolioItems = await storage.getPortfolioItemsByService(serviceId);
      res.json({ portfolioItems });
    } catch (error) {
      console.error("Error fetching service portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch service portfolio items" });
    }
  });

  // Blog API
  app.get("/api/blog", async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json({ blogPosts });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = req.params.id;
      console.log(`Fetching blog post with ID: ${id}`);
      
      const blogPost = await storage.getBlogPost(id);
      
      if (!blogPost) {
        console.log(`Blog post with ID ${id} not found`);
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      console.log(`Successfully found blog post: ${blogPost.title}`);
      res.json({ blogPost });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Testimonials API
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json({ testimonials });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Contact/Inquiry form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const contactSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().optional(),
        message: z.string().min(10, "Message must be at least 10 characters"),
        serviceId: z.number().optional()
      });
      
      const validated = contactSchema.safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: validated.error.format()
        });
      }
      
      const inquiry = await storage.createInquiry({
        ...validated.data,
        createdAt: new Date()
      });
      
      res.json({ 
        success: true, 
        message: "Thank you for your message! We'll get back to you soon.",
        inquiryId: inquiry.id
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Appointment booking endpoint
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 characters"),
        serviceId: z.number(),
        date: z.string().refine((val: string) => !isNaN(Date.parse(val)), {
          message: "Invalid date format"
        }),
        notes: z.string().optional()
      });
      
      const validated = appointmentSchema.safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const { date, ...rest } = validated.data;
      const appointment = await storage.createAppointment({
        ...rest,
        date: new Date(date)
      });
      
      res.json({ 
        success: true, 
        message: "Your appointment has been booked! We'll see you soon.",
        appointmentId: appointment.id
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      res.status(500).json({ message: "Failed to book appointment" });
    }
  });

  // =========== ADMIN API ROUTES ===========
  
  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const passwordsMatch = await comparePasswords(password, user.password);
      if (!passwordsMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      // In a real app you would create a session or JWT token here
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin Service Management
  app.get("/api/admin/services", authenticateAdmin, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json({ services });
    } catch (error) {
      console.error("Error fetching admin services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", authenticateAdmin, async (req, res) => {
    try {
      console.log("Request body for service creation:", JSON.stringify(req.body));
      
      const validated = insertServiceSchema.safeParse(req.body);
      
      if (!validated.success) {
        console.log("Validation failed:", validated.error.format());
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      console.log("Validated data:", JSON.stringify(validated.data));
      
      const service = await storage.createService(validated.data);
      res.json({ success: true, service });
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertServiceSchema.partial().safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const service = await storage.updateService(id, validated.data);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json({ success: true, service });
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = req.params.id; // MongoDB uses string IDs directly
      console.log(`Admin deleting service with ID: ${id}`);
      const success = await storage.deleteService(id);
      
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Admin Portfolio Management
  app.get("/api/admin/portfolio", authenticateAdmin, async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioItems();
      res.json({ portfolioItems });
    } catch (error) {
      console.error("Error fetching admin portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  app.post("/api/admin/portfolio", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertPortfolioItemSchema.safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const portfolioItem = await storage.createPortfolioItem(validated.data);
      res.json({ success: true, portfolioItem });
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      res.status(500).json({ message: "Failed to create portfolio item" });
    }
  });

  app.put("/api/admin/portfolio/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertPortfolioItemSchema.partial().safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const portfolioItem = await storage.updatePortfolioItem(id, validated.data);
      
      if (!portfolioItem) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      
      res.json({ success: true, portfolioItem });
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      res.status(500).json({ message: "Failed to update portfolio item" });
    }
  });

  app.delete("/api/admin/portfolio/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePortfolioItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  });

  // Admin Blog Management
  app.get("/api/admin/blog", authenticateAdmin, async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.json({ blogPosts });
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertBlogPostSchema.safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const blogPost = await storage.createBlogPost(validated.data);
      res.json({ success: true, blogPost });
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      console.log(`Admin updating blog post with ID: ${id}`);
      
      const validated = insertBlogPostSchema.partial().safeParse(req.body);
      
      if (!validated.success) {
        console.log("Validation failed:", validated.error.format());
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const blogPost = await storage.updateBlogPost(id, validated.data);
      
      if (!blogPost) {
        console.log(`Blog post with ID ${id} not found for update`);
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      console.log(`Successfully updated blog post: ${blogPost.title}`);
      res.json({ success: true, blogPost });
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      console.log(`Admin deleting blog post with ID: ${id}`);
      
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        console.log(`Blog post with ID ${id} not found for deletion`);
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      console.log(`Successfully deleted blog post with ID: ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Admin Testimonial Management
  app.get("/api/admin/testimonials", authenticateAdmin, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json({ testimonials });
    } catch (error) {
      console.error("Error fetching admin testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertTestimonialSchema.safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const testimonial = await storage.createTestimonial(validated.data);
      res.json({ success: true, testimonial });
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertTestimonialSchema.partial().safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const testimonial = await storage.updateTestimonial(id, validated.data);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json({ success: true, testimonial });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTestimonial(id);
      
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Admin Inquiry Management
  app.get("/api/admin/inquiries", authenticateAdmin, async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json({ inquiries });
    } catch (error) {
      console.error("Error fetching admin inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.put("/api/admin/inquiries/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertInquirySchema.partial().safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const inquiry = await storage.updateInquiry(id, validated.data);
      
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      res.json({ success: true, inquiry });
    } catch (error) {
      console.error("Error updating inquiry:", error);
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  app.delete("/api/admin/inquiries/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInquiry(id);
      
      if (!success) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      res.status(500).json({ message: "Failed to delete inquiry" });
    }
  });

  // Admin Appointment Management
  app.get("/api/admin/appointments", authenticateAdmin, async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json({ appointments });
    } catch (error) {
      console.error("Error fetching admin appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.put("/api/admin/appointments/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validated = insertAppointmentSchema.partial().safeParse(req.body);
      
      if (!validated.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validated.error.format()
        });
      }
      
      const appointment = await storage.updateAppointment(id, validated.data);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json({ success: true, appointment });
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete("/api/admin/appointments/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAppointment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
