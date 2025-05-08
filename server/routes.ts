import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/status", (req, res) => {
    res.json({ status: "ok", message: "Remix server is running!" });
  });

  // Simple API for demonstration
  app.get("/api/features", (req, res) => {
    res.json({
      features: [
        {
          id: 1,
          title: "Fast Page Loads",
          description: "Deliver the smallest amount of JavaScript possible, loading what's needed when it's needed."
        },
        {
          id: 2,
          title: "Server Rendering",
          description: "Leverage server rendering for improved performance and better SEO out of the box."
        },
        {
          id: 3,
          title: "Nested Routing",
          description: "Create complex layouts and page structures with nested routes that just work."
        }
      ]
    });
  });

  // Contact form endpoint
  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: "Name, email, and message are required" 
      });
    }
    
    // In a real application, you would save this to a database
    // or send an email notification
    
    res.json({ 
      success: true, 
      message: "Thank you for your message! We'll get back to you soon." 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
