import { 
  type User, type InsertUser,
  type Service, type InsertService,
  type PortfolioItem, type InsertPortfolioItem,
  type BlogPost, type InsertBlogPost,
  type Inquiry, type InsertInquiry,
  type Appointment, type InsertAppointment, 
  type Testimonial, type InsertTestimonial
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Service operations
  getService(id: number): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getFeaturedServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Portfolio operations
  getPortfolioItem(id: number): Promise<PortfolioItem | undefined>;
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemsByService(serviceId: number): Promise<PortfolioItem[]>;
  createPortfolioItem(portfolioItem: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, portfolioItemData: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;

  // Blog operations
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPostData: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Inquiry operations
  getInquiry(id: number): Promise<Inquiry | undefined>;
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: number, inquiryData: Partial<InsertInquiry>): Promise<Inquiry | undefined>;
  deleteInquiry(id: number): Promise<boolean>;

  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointments(): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;

  // Testimonial operations
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  // In-memory storage maps
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private portfolioItems: Map<number, PortfolioItem>;
  private blogPosts: Map<number, BlogPost>;
  private inquiries: Map<number, Inquiry>;
  private appointments: Map<number, Appointment>;
  private testimonials: Map<number, Testimonial>;

  // ID counters
  private userIdCounter: number;
  private serviceIdCounter: number;
  private portfolioIdCounter: number;
  private blogIdCounter: number;
  private inquiryIdCounter: number;
  private appointmentIdCounter: number;
  private testimonialIdCounter: number;

  constructor() {
    // Initialize maps
    this.users = new Map();
    this.services = new Map();
    this.portfolioItems = new Map();
    this.blogPosts = new Map();
    this.inquiries = new Map();
    this.appointments = new Map();
    this.testimonials = new Map();

    // Initialize ID counters
    this.userIdCounter = 1;
    this.serviceIdCounter = 1;
    this.portfolioIdCounter = 1;
    this.blogIdCounter = 1;
    this.inquiryIdCounter = 1;
    this.appointmentIdCounter = 1;
    this.testimonialIdCounter = 1;

    // Add an admin user by default
    this.createUser({
      username: 'admin',
      password: 'admin123',
      email: 'admin@greengarden.com',
      name: 'Admin User',
      role: 'admin' as const
    });
    
    // Seed more data
    this.seedDemoData();
  }
  
  private async seedDemoData() {
    // Add services
    const gardenMaintenanceId = this.serviceIdCounter;
    await this.createService({
      name: "Garden Maintenance",
      description: "Regular maintenance to keep your garden looking its best year-round. Includes weeding, pruning, mulching, and seasonal clean-up. Our expert gardeners will ensure your plants thrive in every season.",
      price: "From $120/month",
      imageUrl: null,
      featured: true
    });
    
    await this.createService({
      name: "Landscape Design",
      description: "Transform your outdoor space with our professional landscape design services. We create beautiful, sustainable landscapes tailored to your preferences and local climate conditions.",
      price: "From $500",
      imageUrl: null,
      featured: true
    });
    
    await this.createService({
      name: "Tree & Shrub Care",
      description: "Comprehensive care for your trees and shrubs, including pruning, fertilization, pest management, and disease treatment to ensure healthy growth and longevity.",
      price: "From $150",
      imageUrl: null,
      featured: true
    });
    
    await this.createService({
      name: "Lawn Care",
      description: "Complete lawn maintenance services including mowing, fertilization, aeration, overseeding, and pest control to keep your lawn lush, green, and healthy.",
      price: "From $80/visit",
      imageUrl: null,
      featured: false
    });
    
    await this.createService({
      name: "Irrigation Systems",
      description: "Design, installation, and maintenance of efficient irrigation systems to ensure your garden gets the right amount of water while conserving this precious resource.",
      price: "From $350",
      imageUrl: null,
      featured: false
    });
    
    // Add portfolio items
    await this.createPortfolioItem({
      title: "Residential Garden Renovation",
      description: "Complete transformation of a neglected backyard into a vibrant garden with native plants, a water feature, and sustainable irrigation.",
      date: new Date("2023-04-15"),
      imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      serviceId: gardenMaintenanceId
    });
    
    await this.createPortfolioItem({
      title: "Commercial Landscape Project",
      description: "Designed and implemented landscaping for a corporate campus, featuring drought-resistant plants and efficient irrigation systems.",
      date: new Date("2023-05-22"),
      imageUrl: "https://images.unsplash.com/photo-1626807236036-8c9584a9f8a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      serviceId: gardenMaintenanceId
    });
    
    // Add blog posts
    await this.createBlogPost({
      title: "10 Tips for a Thriving Summer Garden",
      excerpt: "Essential tips to help your garden flourish during the hot summer months, from watering techniques to pest management.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam volutpat aliquam. Integer et elit eget elit facilisis tristique. Nam vel iaculis mauris. Sed ullamcorper tellus erat, ultrices sem tincidunt euismod.",
      authorId: 1,
      publishedAt: new Date("2023-06-01"),
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    });
    
    await this.createBlogPost({
      title: "Sustainable Gardening Practices",
      excerpt: "Learn how to create an eco-friendly garden that conserves water, supports local wildlife, and reduces environmental impact.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam volutpat aliquam. Integer et elit eget elit facilisis tristique. Nam vel iaculis mauris. Sed ullamcorper tellus erat, ultrices sem tincidunt euismod.",
      authorId: 1,
      publishedAt: new Date("2023-05-15"),
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    });
    
    // Add testimonials
    await this.createTestimonial({
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "Green Garden transformed my backyard into a beautiful oasis! Their team was professional, responsive, and truly cared about bringing my vision to life. I couldn't be happier with the results!",
      imageUrl: null,
      rating: 5,
      displayOrder: 1
    });
    
    await this.createTestimonial({
      name: "Michael Chen",
      role: "Business Owner",
      content: "We hired Green Garden to maintain the landscaping at our office building, and they've exceeded our expectations. Their attention to detail and proactive approach has made our property look exceptional year-round.",
      imageUrl: null,
      rating: 5,
      displayOrder: 2
    });
    
    await this.createTestimonial({
      name: "Emily Rodriguez",
      role: "Homeowner",
      content: "The landscape design service from Green Garden was excellent. They listened to our needs, worked within our budget, and created a sustainable garden that we love spending time in.",
      imageUrl: null,
      rating: 4,
      displayOrder: 3
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || 'admin' // Default to admin if not specified
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getFeaturedServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.featured
    );
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const service: Service = { 
      ...insertService, 
      id, 
      imageUrl: insertService.imageUrl || null,
      featured: insertService.featured || false
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;

    const updatedService = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Portfolio methods
  async getPortfolioItem(id: number): Promise<PortfolioItem | undefined> {
    return this.portfolioItems.get(id);
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values());
  }

  async getPortfolioItemsByService(serviceId: number): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).filter(
      (item) => item.serviceId === serviceId
    );
  }

  async createPortfolioItem(insertPortfolioItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.portfolioIdCounter++;
    const portfolioItem: PortfolioItem = { 
      ...insertPortfolioItem, 
      id,
      serviceId: insertPortfolioItem.serviceId || null
    };
    this.portfolioItems.set(id, portfolioItem);
    return portfolioItem;
  }

  async updatePortfolioItem(id: number, portfolioItemData: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const portfolioItem = this.portfolioItems.get(id);
    if (!portfolioItem) return undefined;

    const updatedPortfolioItem = { ...portfolioItem, ...portfolioItemData };
    this.portfolioItems.set(id, updatedPortfolioItem);
    return updatedPortfolioItem;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    return this.portfolioItems.delete(id);
  }

  // Blog methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogIdCounter++;
    const blogPost: BlogPost = { 
      ...insertBlogPost, 
      id,
      imageUrl: insertBlogPost.imageUrl || null
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, blogPostData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const blogPost = this.blogPosts.get(id);
    if (!blogPost) return undefined;

    const updatedBlogPost = { ...blogPost, ...blogPostData };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Inquiry methods
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.inquiryIdCounter++;
    const inquiry: Inquiry = { 
      ...insertInquiry,
      id,
      status: 'new',
      phone: insertInquiry.phone || null,
      serviceId: insertInquiry.serviceId || null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async updateInquiry(id: number, inquiryData: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;

    const updatedInquiry = { ...inquiry, ...inquiryData };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }

  async deleteInquiry(id: number): Promise<boolean> {
    return this.inquiries.delete(id);
  }

  // Appointment methods
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      status: 'scheduled',
      notes: insertAppointment.notes || null
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;

    const updatedAppointment = { ...appointment, ...appointmentData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Testimonial methods
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      role: insertTestimonial.role || null,
      imageUrl: insertTestimonial.imageUrl || null,
      rating: insertTestimonial.rating || null,
      displayOrder: insertTestimonial.displayOrder || null
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;

    const updatedTestimonial = { ...testimonial, ...testimonialData };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }
}

// Import MongoDB storage
import { MongoDBStorage } from './mongodb-storage';

// Use MongoDB storage for production
export const storage = new MongoDBStorage();
