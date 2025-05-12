
// Vercel Serverless Function to handle API requests
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['https://gardening-shop-finalv1.vercel.app', process.env.FRONTEND_URL || '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Enable JSON parsing
app.use(express.json());

// Connect to MongoDB
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://stefanlenta:MABCkbbCfNeUOo1M@cluster0.3ibgvtn.mongodb.net/garden_services_db';
console.log('MongoDB connection will use:', process.env.DATABASE_URL ? 'Environment variable' : 'Fallback URL');

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Service schema
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

// Portfolio item schema
const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  imageUrl: { type: String },
  images: [{
    before: { type: String, required: true },
    after: { type: String, required: true },
    caption: { type: String },
    richDescription: { type: String },
    order: { type: Number, default: 0 }
  }],
  location: { type: String },
  completionDate: { type: Date },
  projectDuration: { type: String },
  difficultyLevel: { type: String, enum: ['Easy', 'Moderate', 'Complex'] },
  clientTestimonial: {
    clientName: { type: String },
    comment: { type: String },
    displayPermission: { type: Boolean, default: false }
  },
  featured: { type: Boolean, default: false },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    tags: [{ type: String }]
  },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Blog post schema
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  imageUrl: { type: String },
  publishedAt: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

// Inquiry schema
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  status: { type: String, enum: ['new', 'in-progress', 'resolved', 'archived'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Appointment schema
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  buildingName: { type: String },
  streetName: { type: String, required: true },
  houseNumber: { type: String, required: true },
  city: { type: String, required: true },
  county: { type: String, required: true },
  postalCode: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  priority: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
  notes: { type: String },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Testimonial schema
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

// Create the models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const PortfolioItem = mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', portfolioItemSchema);
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

// Connect to MongoDB
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('Connection string format:', DATABASE_URL ? 'URL is defined' : 'URL is undefined');
    throw error;
  }
};

// Helper function to map MongoDB documents to schema format
function mapServiceToSchema(service) {
  return {
    id: service._id.toString(),
    name: service.name,
    description: service.description,
    shortDesc: service.shortDesc,
    price: service.price,
    imageUrl: service.imageUrl,
    featured: service.isFeatured
  };
}

function mapInquiryToSchema(inquiry) {
  return {
    id: inquiry._id.toString(),
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    serviceId: inquiry.serviceId ? inquiry.serviceId.toString() : null,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
    updatedAt: inquiry.updatedAt
  };
}

function mapAppointmentToSchema(appointment) {
  return {
    id: appointment._id.toString(),
    name: appointment.name,
    email: appointment.email,
    phone: appointment.phone,
    buildingName: appointment.buildingName,
    streetName: appointment.streetName,
    houseNumber: appointment.houseNumber,
    city: appointment.city,
    county: appointment.county,
    postalCode: appointment.postalCode,
    serviceId: appointment.serviceId.toString(),
    date: appointment.date,
    priority: appointment.priority,
    notes: appointment.notes,
    status: appointment.status,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt
  };
}

function mapTestimonialToSchema(testimonial) {
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

// API Routes
// Services
app.get('/api/services', async (req, res) => {
  try {
    await connectToDatabase();
    const services = await Service.find();
    res.json({ services: services.map(mapServiceToSchema) });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services' });
  }
});

// Admin Services
app.get('/api/admin/services', async (req, res) => {
  try {
    await connectToDatabase();
    const services = await Service.find();
    res.json({ services: services.map(mapServiceToSchema) });
  } catch (error) {
    console.error('Error fetching admin services:', error);
    res.status(500).json({ message: 'Error fetching admin services' });
  }
});

// Inquiries
app.get('/api/admin/inquiries', async (req, res) => {
  try {
    await connectToDatabase();
    const inquiries = await Inquiry.find();
    res.json({ inquiries: inquiries.map(mapInquiryToSchema) });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

// Appointments
app.get('/api/admin/appointments', async (req, res) => {
  try {
    await connectToDatabase();
    const appointments = await Appointment.find();
    res.json({ appointments: appointments.map(mapAppointmentToSchema) });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find();
    res.json({ testimonials: testimonials.map(mapTestimonialToSchema) });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
});

// Debug route to check if API is working
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running', mongodb: isConnected ? 'connected' : 'disconnected' });
});

// Handle all other API routes
app.all('/api/*', (req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'API endpoint not found' });
});

// Add better logging for debugging on Vercel
app.all('*', (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Add a catch-all route to handle undefined API routes
app.all('/api/*', (req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Add a catch-all error handler
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

module.exports = app;
