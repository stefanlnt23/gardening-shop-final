import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum for user roles
export const userRoleEnum = pgEnum('user_role', ['admin', 'staff']);

// User model with roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default('staff'),
});

// Services offered
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
});

// Portfolio/Projects
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  serviceId: integer("service_id").references(() => services.id),
  date: timestamp("date").notNull(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url"),
  authorId: integer("author_id").references(() => users.id).notNull(),
  publishedAt: timestamp("published_at").notNull(),
});

// Customer inquiries/contact messages
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  serviceId: integer("service_id").references(() => services.id),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").notNull(),
});

// Appointments/Bookings
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  status: text("status").default("scheduled"),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  content: text("content").notNull(),
  rating: integer("rating"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order"),
});

// Create Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  role: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  featured: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).pick({
  title: true,
  description: true,
  imageUrl: true,
  serviceId: true,
  date: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  excerpt: true,
  imageUrl: true,
  authorId: true,
  publishedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
  serviceId: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  name: true,
  email: true,
  phone: true,
  serviceId: true,
  date: true,
  notes: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  role: true,
  content: true,
  rating: true,
  imageUrl: true,
  displayOrder: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
