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

export const storage = new MemStorage();
