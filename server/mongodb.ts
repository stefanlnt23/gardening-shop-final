import mongoose from 'mongoose';
import { log } from './vite';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://stefanlenta:MABCkbbCfNeUOo1M@cluster0.3ibgvtn.mongodb.net/garden_services_db';

// Initialize MongoDB connection
export async function connectToMongoDB() {
  try {
    await mongoose.connect(DATABASE_URL);
    log('Connected to MongoDB', 'mongodb');
    return mongoose.connection;
  } catch (error) {
    log(`Error connecting to MongoDB: ${error}`, 'mongodb');
    throw error;
  }
}

// Create schemas and models for the application
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  shortDesc: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  imageUrl: { type: String, required: true },
  completionDate: { type: Date },
  clientName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'in-progress', 'completed'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  imageUrl: { type: String },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
export const User = mongoose.model('User', userSchema);
export const Service = mongoose.model('Service', serviceSchema);
export const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);
export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export const Inquiry = mongoose.model('Inquiry', inquirySchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// Helper functions to convert between MongoDB documents and our schema types
export function mapUserToSchema(user: any): any {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    password: user.password,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function mapServiceToSchema(service: any): any {
  return {
    id: service._id.toString(),
    name: service.name,
    description: service.description,
    shortDesc: service.shortDesc,
    price: service.price,
    imageUrl: service.imageUrl,
    isFeatured: service.isFeatured
  };
}

export function mapPortfolioItemToSchema(item: any): any {
  return {
    id: item._id.toString(),
    title: item.title,
    description: item.description,
    serviceId: item.serviceId.toString(),
    imageUrl: item.imageUrl,
    completionDate: item.completionDate,
    clientName: item.clientName
  };
}

export function mapBlogPostToSchema(post: any): any {
  return {
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    authorId: post.authorId.toString(),
    imageUrl: post.imageUrl,
    publishedAt: post.publishedAt
  };
}

export function mapInquiryToSchema(inquiry: any): any {
  return {
    id: inquiry._id.toString(),
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    status: inquiry.status,
    createdAt: inquiry.createdAt
  };
}

export function mapAppointmentToSchema(appointment: any): any {
  return {
    id: appointment._id.toString(),
    name: appointment.name,
    email: appointment.email,
    phone: appointment.phone,
    serviceId: appointment.serviceId.toString(),
    date: appointment.date,
    message: appointment.message,
    status: appointment.status
  };
}

export function mapTestimonialToSchema(testimonial: any): any {
  return {
    id: testimonial._id.toString(),
    name: testimonial.name,
    role: testimonial.role,
    content: testimonial.content,
    rating: testimonial.rating,
    imageUrl: testimonial.imageUrl,
    displayOrder: testimonial.displayOrder
  };
}