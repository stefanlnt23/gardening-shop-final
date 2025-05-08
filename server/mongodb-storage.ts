import { IStorage } from './storage';
import {
  User, Service, PortfolioItem, BlogPost, Inquiry, Appointment, Testimonial,
  mapUserToSchema, mapServiceToSchema, mapPortfolioItemToSchema, mapBlogPostToSchema,
  mapInquiryToSchema, mapAppointmentToSchema, mapTestimonialToSchema
} from './mongodb';
import { InsertUser, InsertService, InsertPortfolioItem, InsertBlogPost, InsertInquiry, InsertAppointment, InsertTestimonial } from '@shared/schema';
import mongoose from 'mongoose';
import { log } from './vite';
import * as crypto from 'crypto';

export class MongoDBStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<any | undefined> {
    try {
      const user = await User.findById(id);
      return user ? mapUserToSchema(user) : undefined;
    } catch (error) {
      log(`Error fetching user with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    try {
      const user = await User.findOne({ username });
      return user ? mapUserToSchema(user) : undefined;
    } catch (error) {
      log(`Error fetching user with username ${username}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    try {
      const user = await User.findOne({ email });
      return user ? mapUserToSchema(user) : undefined;
    } catch (error) {
      log(`Error fetching user with email ${email}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      const users = await User.find();
      return users.map(mapUserToSchema);
    } catch (error) {
      log(`Error fetching users: ${error}`, 'mongodb');
      return [];
    }
  }

  async createUser(insertUser: InsertUser): Promise<any> {
    try {
      // Use the password hashing utility
      const hashedPassword = await import('./auth').then(auth => auth.hashPassword(insertUser.password));
      
      const newUser = new User({
        ...insertUser,
        password: hashedPassword
      });
      const savedUser = await newUser.save();
      return mapUserToSchema(savedUser);
    } catch (error) {
      log(`Error creating user: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<any | undefined> {
    try {
      // If password is being updated, hash it
      if (userData.password) {
        userData.password = await import('./auth').then(auth => auth.hashPassword(userData.password));
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { ...userData, updatedAt: new Date() },
        { new: true }
      );
      return updatedUser ? mapUserToSchema(updatedUser) : undefined;
    } catch (error) {
      log(`Error updating user with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      log(`Error deleting user with id ${id}: ${error}`, 'mongodb');
      return false;
    }
  }

  // Service operations
  async getService(id: number | string): Promise<any | undefined> {
    try {
      log(`MongoDB: Fetching service with id ${id}`, 'mongodb');
      const service = await Service.findById(id);
      if (!service) {
        log(`MongoDB: Service with id ${id} not found`, 'mongodb');
        return undefined;
      }
      return mapServiceToSchema(service);
    } catch (error) {
      log(`Error fetching service with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getServices(): Promise<any[]> {
    try {
      const services = await Service.find();
      return services.map(mapServiceToSchema);
    } catch (error) {
      log(`Error fetching services: ${error}`, 'mongodb');
      return [];
    }
  }

  async getFeaturedServices(): Promise<any[]> {
    try {
      log(`Fetching featured services from MongoDB...`, 'mongodb');
      const services = await Service.find({ isFeatured: true });
      log(`Found ${services.length} featured services`, 'mongodb');
      return services.map(mapServiceToSchema);
    } catch (error) {
      log(`Error fetching featured services: ${error}`, 'mongodb');
      return [];
    }
  }

  async createService(insertService: InsertService): Promise<any> {
    try {
      // Map the data correctly to match MongoDB schema
      const serviceData = {
        name: insertService.name,
        description: insertService.description,
        shortDesc: insertService.shortDesc,
        price: insertService.price,
        imageUrl: insertService.imageUrl,
        isFeatured: insertService.featured
      };
      
      const newService = new Service(serviceData);
      const savedService = await newService.save();
      return mapServiceToSchema(savedService);
    } catch (error) {
      log(`Error creating service: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<any | undefined> {
    try {
      // Map the data correctly to match MongoDB schema
      const mappedData: any = {
        updatedAt: new Date()
      };
      
      if (serviceData.name) mappedData.name = serviceData.name;
      if (serviceData.description) mappedData.description = serviceData.description;
      if (serviceData.shortDesc !== undefined) mappedData.shortDesc = serviceData.shortDesc;
      if (serviceData.price) mappedData.price = serviceData.price;
      if (serviceData.imageUrl !== undefined) mappedData.imageUrl = serviceData.imageUrl;
      if (serviceData.featured !== undefined) mappedData.isFeatured = serviceData.featured;
      
      const updatedService = await Service.findByIdAndUpdate(
        id,
        mappedData,
        { new: true }
      );
      return updatedService ? mapServiceToSchema(updatedService) : undefined;
    } catch (error) {
      log(`Error updating service with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async deleteService(id: number | string): Promise<boolean> {
    try {
      log(`Attempting to delete service with id ${id}`, 'mongodb');
      
      // Convert string numeric ID to number if needed (for compatibility)
      let serviceId = id;
      
      log(`Looking for service with ID: ${serviceId}`, 'mongodb');
      
      const result = await Service.findByIdAndDelete(serviceId);
      log(`Delete result: ${result ? 'Success' : 'Not found'}`, 'mongodb');
      
      if (!result) {
        log(`Service with ID ${serviceId} not found`, 'mongodb');
        return false;
      }
      
      // Also delete any related portfolio items
      await PortfolioItem.deleteMany({ serviceId: serviceId });
      log(`Deleted related portfolio items for service ${serviceId}`, 'mongodb');
      
      return true;
    } catch (error) {
      log(`Error deleting service with id ${id}: ${error}`, 'mongodb');
      return false;
    }
  }

  // Portfolio operations
  async getPortfolioItem(id: number): Promise<any | undefined> {
    try {
      const item = await PortfolioItem.findById(id);
      return item ? mapPortfolioItemToSchema(item) : undefined;
    } catch (error) {
      log(`Error fetching portfolio item with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getPortfolioItems(): Promise<any[]> {
    try {
      const items = await PortfolioItem.find();
      return items.map(mapPortfolioItemToSchema);
    } catch (error) {
      log(`Error fetching portfolio items: ${error}`, 'mongodb');
      return [];
    }
  }

  async getPortfolioItemsByService(serviceId: string | number): Promise<any[]> {
    try {
      log(`MongoDB: Fetching portfolio items for service ID ${serviceId}`, 'mongodb');
      const items = await PortfolioItem.find({ serviceId });
      return items.map(mapPortfolioItemToSchema);
    } catch (error) {
      log(`Error fetching portfolio items for service ${serviceId}: ${error}`, 'mongodb');
      return [];
    }
  }

  async createPortfolioItem(insertPortfolioItem: InsertPortfolioItem): Promise<any> {
    try {
      const newItem = new PortfolioItem(insertPortfolioItem);
      const savedItem = await newItem.save();
      return mapPortfolioItemToSchema(savedItem);
    } catch (error) {
      log(`Error creating portfolio item: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updatePortfolioItem(id: number, portfolioItemData: Partial<InsertPortfolioItem>): Promise<any | undefined> {
    try {
      const updatedItem = await PortfolioItem.findByIdAndUpdate(
        id,
        { ...portfolioItemData, updatedAt: new Date() },
        { new: true }
      );
      return updatedItem ? mapPortfolioItemToSchema(updatedItem) : undefined;
    } catch (error) {
      log(`Error updating portfolio item with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    try {
      const result = await PortfolioItem.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      log(`Error deleting portfolio item with id ${id}: ${error}`, 'mongodb');
      return false;
    }
  }

  // Blog operations
  async getBlogPost(id: number | string): Promise<any | undefined> {
    try {
      log(`Fetching blog post with ID: ${id}`, 'mongodb');
      const post = await BlogPost.findById(id);
      if (!post) {
        log(`Blog post with ID ${id} not found`, 'mongodb');
        return undefined;
      }
      return mapBlogPostToSchema(post);
    } catch (error) {
      log(`Error fetching blog post with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getBlogPosts(): Promise<any[]> {
    try {
      const posts = await BlogPost.find().sort({ publishedAt: -1 });
      return posts.map(mapBlogPostToSchema);
    } catch (error) {
      log(`Error fetching blog posts: ${error}`, 'mongodb');
      return [];
    }
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<any> {
    try {
      log(`Creating blog post with data: ${JSON.stringify(insertBlogPost)}`, 'mongodb');
      
      // Ensure authorId exists - if it's a placeholder, fetch the first admin user
      if (!insertBlogPost.authorId || insertBlogPost.authorId === '000000000000000000000000') {
        log(`AuthorId is missing or placeholder, trying to find default admin...`, 'mongodb');
        const adminUser = await User.findOne({ role: 'admin' });
        
        if (adminUser) {
          log(`Found admin user ${adminUser._id} to use as author`, 'mongodb');
          insertBlogPost.authorId = adminUser._id;
        } else {
          log(`No admin user found for default author`, 'mongodb');
          // We'll let it continue with the placeholder ID, which might fail
        }
      }
      
      const newPost = new BlogPost(insertBlogPost);
      const savedPost = await newPost.save();
      log(`Blog post created successfully with ID: ${savedPost._id}`, 'mongodb');
      return mapBlogPostToSchema(savedPost);
    } catch (error) {
      log(`Error creating blog post: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateBlogPost(id: number | string, blogPostData: Partial<InsertBlogPost>): Promise<any | undefined> {
    try {
      log(`Updating blog post with ID: ${id}, data: ${JSON.stringify(blogPostData)}`, 'mongodb');
      
      // Handle default authorId or placeholder the same as in create
      if (!blogPostData.authorId || blogPostData.authorId === '000000000000000000000000') {
        log(`AuthorId is missing or placeholder, trying to find default admin...`, 'mongodb');
        const adminUser = await User.findOne({ role: 'admin' });
        
        if (adminUser) {
          log(`Found admin user ${adminUser._id} to use as author`, 'mongodb');
          blogPostData.authorId = adminUser._id;
        }
      }
      
      const updatedPost = await BlogPost.findByIdAndUpdate(
        id,
        { ...blogPostData, updatedAt: new Date() },
        { new: true }
      );
      
      if (!updatedPost) {
        log(`Blog post with ID ${id} not found for update`, 'mongodb');
        return undefined;
      }
      
      log(`Blog post updated successfully`, 'mongodb');
      return mapBlogPostToSchema(updatedPost);
    } catch (error) {
      log(`Error updating blog post with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async deleteBlogPost(id: number | string): Promise<boolean> {
    try {
      log(`Deleting blog post with ID: ${id}`, 'mongodb');
      const result = await BlogPost.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      log(`Error deleting blog post with id ${id}: ${error}`, 'mongodb');
      return false;
    }
  }

  // Inquiry operations
  async getInquiry(id: number): Promise<any | undefined> {
    try {
      const inquiry = await Inquiry.findById(id);
      return inquiry ? mapInquiryToSchema(inquiry) : undefined;
    } catch (error) {
      log(`Error fetching inquiry with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getInquiries(): Promise<any[]> {
    try {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return inquiries.map(mapInquiryToSchema);
    } catch (error) {
      log(`Error fetching inquiries: ${error}`, 'mongodb');
      return [];
    }
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<any> {
    try {
      const newInquiry = new Inquiry(insertInquiry);
      const savedInquiry = await newInquiry.save();
      return mapInquiryToSchema(savedInquiry);
    } catch (error) {
      log(`Error creating inquiry: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateInquiry(id: number, inquiryData: Partial<InsertInquiry>): Promise<any | undefined> {
    try {
      const updatedInquiry = await Inquiry.findByIdAndUpdate(
        id,
        { ...inquiryData, updatedAt: new Date() },
        { new: true }
      );
      return updatedInquiry ? mapInquiryToSchema(updatedInquiry) : undefined;
    } catch (error) {
      log(`Error updating inquiry with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async deleteInquiry(id: number): Promise<boolean> {
    try {
      const result = await Inquiry.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      log(`Error deleting inquiry with id ${id}: ${error}`, 'mongodb');
      return false;
    }
  }

  // Appointment operations
  async getAppointment(id: number): Promise<any | undefined> {
    try {
      const appointment = await Appointment.findById(id);
      return appointment ? mapAppointmentToSchema(appointment) : undefined;
    } catch (error) {
      log(`Error fetching appointment with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getAppointments(): Promise<any[]> {
    try {
      const appointments = await Appointment.find().sort({ date: 1 });
      return appointments.map(mapAppointmentToSchema);
    } catch (error) {
      log(`Error fetching appointments: ${error}`, 'mongodb');
      return [];
    }
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<any> {
    try {
      const newAppointment = new Appointment(insertAppointment);
      const savedAppointment = await newAppointment.save();
      return mapAppointmentToSchema(savedAppointment);
    } catch (error) {
      log(`Error creating appointment: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateAppointment(id: number, appointmentData: Partial<InsertAppointment>): Promise<any | undefined> {
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        { ...appointmentData, updatedAt: new Date() },
        { new: true }
      );
      return updatedAppointment ? mapAppointmentToSchema(updatedAppointment) : undefined;
    } catch (error) {
      log(`Error updating appointment with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async deleteAppointment(id: number): Promise<boolean> {
    try {
      const result = await Appointment.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      log(`Error deleting appointment with id ${id}: ${error}`, 'mongodb');
      return false;
    }
  }

  // Testimonial operations
  async getTestimonial(id: number): Promise<any | undefined> {
    try {
      const testimonial = await Testimonial.findById(id);
      return testimonial ? mapTestimonialToSchema(testimonial) : undefined;
    } catch (error) {
      log(`Error fetching testimonial with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async getTestimonials(): Promise<any[]> {
    try {
      const testimonials = await Testimonial.find().sort({ displayOrder: 1 });
      return testimonials.map(mapTestimonialToSchema);
    } catch (error) {
      log(`Error fetching testimonials: ${error}`, 'mongodb');
      return [];
    }
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<any> {
    try {
      const newTestimonial = new Testimonial(insertTestimonial);
      const savedTestimonial = await newTestimonial.save();
      return mapTestimonialToSchema(savedTestimonial);
    } catch (error) {
      log(`Error creating testimonial: ${error}`, 'mongodb');
      throw error;
    }
  }

  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<any | undefined> {
    try {
      const updatedTestimonial = await Testimonial.findByIdAndUpdate(
        id,
        { ...testimonialData, updatedAt: new Date() },
        { new: true }
      );
      return updatedTestimonial ? mapTestimonialToSchema(updatedTestimonial) : undefined;
    } catch (error) {
      log(`Error updating testimonial with id ${id}: ${error}`, 'mongodb');
      return undefined;
    }
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    try {
      const result = await Testimonial.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      log(`Error deleting testimonial with id ${id}: ${error}`, 'mongodb');
      return false;
    }
  }

  // Initialize demo data 
  async seedDemoData(): Promise<void> {
    try {
      // Check if we already have data
      const userCount = await User.countDocuments();
      
      if (userCount === 0) {
        log('Seeding demo data to MongoDB...', 'mongodb');
        
        // Create admin user
        const adminUser = await this.createUser({
          name: 'Admin User',
          email: 'admin@example.com',
          username: 'admin',
          password: 'password123',
          role: 'admin'
        });
        
        // Create services
        const service1 = await this.createService({
          name: 'Garden Maintenance',
          description: 'Our garden maintenance service includes weeding, pruning, lawn care, and general upkeep to keep your garden looking its best year-round.',
          shortDesc: 'Regular maintenance to keep your garden healthy and beautiful',
          price: 125,
          imageUrl: '/images/services/maintenance.jpg',
          isFeatured: true
        });
        
        const service2 = await this.createService({
          name: 'Landscape Design',
          description: 'Our landscape design service creates beautiful, functional outdoor spaces tailored to your preferences and site conditions.',
          shortDesc: 'Custom designs to transform your outdoor space',
          price: 350,
          imageUrl: '/images/services/design.jpg',
          isFeatured: true
        });
        
        const service3 = await this.createService({
          name: 'Planting Services',
          description: 'Our planting services include selection, placement, and installation of trees, shrubs, perennials, and seasonal flowers.',
          shortDesc: 'Expert plant selection and installation',
          price: 200,
          imageUrl: '/images/services/planting.jpg',
          isFeatured: true
        });
        
        // Create portfolio items
        await this.createPortfolioItem({
          title: 'Modern Backyard Transformation',
          description: 'Complete redesign of a neglected backyard into a modern outdoor living space with native plants and sustainable features.',
          serviceId: service2.id,
          imageUrl: '/images/portfolio/backyard1.jpg',
          completionDate: new Date('2023-05-15'),
          clientName: 'Johnson Family'
        });
        
        await this.createPortfolioItem({
          title: 'Drought-Resistant Front Yard',
          description: 'Conversion of a water-hungry lawn into a beautiful, low-maintenance xeriscape with native plants.',
          serviceId: service3.id,
          imageUrl: '/images/portfolio/frontyard1.jpg',
          completionDate: new Date('2023-07-22'),
          clientName: 'Smith Residence'
        });
        
        // Create testimonials
        await this.createTestimonial({
          name: 'Sarah Johnson',
          role: 'Homeowner',
          content: 'The team transformed our boring backyard into a beautiful outdoor living space that we use all the time. Professional, punctual, and a pleasure to work with!',
          rating: 5,
          imageUrl: '/images/testimonials/person1.jpg',
          displayOrder: 1
        });
        
        await this.createTestimonial({
          name: 'Michael Rodriguez',
          role: 'Business Owner',
          content: 'We hired them to maintain the landscaping at our office building, and the service has been exceptional. Our clients always comment on how beautiful our entrance looks.',
          rating: 5,
          imageUrl: '/images/testimonials/person2.jpg',
          displayOrder: 2
        });
        
        // Create blog posts
        await this.createBlogPost({
          title: 'Top 10 Plants for Shade Gardens',
          content: 'Long-form content about the best shade plants...',
          excerpt: 'Discover beautiful plants that thrive in shaded areas and create stunning garden displays even without direct sunlight.',
          authorId: adminUser.id,
          imageUrl: '/images/blog/shade-plants.jpg',
          publishedAt: new Date('2023-04-12')
        });
        
        await this.createBlogPost({
          title: 'How to Create a Pollinator-Friendly Garden',
          content: 'Long-form content about attracting pollinators...',
          excerpt: 'Learn how to support local ecosystems by creating a garden that attracts and nourishes important pollinators like bees and butterflies.',
          authorId: adminUser.id,
          imageUrl: '/images/blog/pollinators.jpg',
          publishedAt: new Date('2023-05-18')
        });
        
        log('Demo data successfully seeded to MongoDB', 'mongodb');
      } else {
        log('Database already contains data, skipping seed operation', 'mongodb');
      }
    } catch (error) {
      log(`Error seeding demo data: ${error}`, 'mongodb');
      throw error;
    }
  }
}