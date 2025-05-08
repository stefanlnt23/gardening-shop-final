import { useState } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  serviceId: z.string().optional(),
  message: z.string().min(10, "Please provide more details in your message")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form setup
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceId: "",
      message: ""
    }
  });

  // Handle form submission
  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    // Convert serviceId to number if present
    const serviceId = data.serviceId ? parseInt(data.serviceId, 10) : null;
    
    apiRequest("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...data,
        serviceId
      })
    })
      .then(response => {
        setIsSubmitting(false);
        setFormSubmitted(true);
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you shortly.",
        });
        form.reset();
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "Something went wrong!",
          description: "Please try again later or contact us directly by phone.",
          variant: "destructive"
        });
        console.error("Error submitting form:", error);
      });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-400 rounded-md flex items-center justify-center">
                <i className="fas fa-leaf text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                Green Garden
              </span>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-green-600 transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-green-700 font-medium">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-green-600 transition-colors">
                Admin
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <button className="md:hidden text-gray-700">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-700">
              Have questions about our services or want to schedule a consultation? 
              Get in touch with our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
                
                {formSubmitted ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="mb-6 text-green-500 text-6xl">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Thank You!</h3>
                      <p className="text-gray-600 mb-6">
                        Your message has been received. We'll get back to you as soon as possible.
                      </p>
                      <Button 
                        onClick={() => setFormSubmitted(false)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Send Another Message
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 sm:p-8">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="(123) 456-7890" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="serviceId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service (Optional)</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a service" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="1">Garden Maintenance</SelectItem>
                                      <SelectItem value="2">Landscape Design</SelectItem>
                                      <SelectItem value="3">Tree & Shrub Care</SelectItem>
                                      <SelectItem value="4">Lawn Care</SelectItem>
                                      <SelectItem value="5">Irrigation Systems</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell us about your project or inquiry..." 
                                    className="min-h-32" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Sending...
                              </>
                            ) : "Send Message"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                            <i className="fas fa-map-marker-alt"></i>
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                          <p className="text-gray-600">
                            123 Garden Street<br />
                            Greenville, 12345<br />
                            United States
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                            <i className="fas fa-phone-alt"></i>
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Phone Numbers</h3>
                          <p className="text-gray-600 mb-2">
                            <span className="font-medium">Main Office:</span> (123) 456-7890
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Customer Support:</span> (123) 456-7891
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                            <i className="fas fa-envelope"></i>
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Email Addresses</h3>
                          <p className="text-gray-600 mb-2">
                            <span className="font-medium">General Inquiries:</span> info@greengarden.com
                          </p>
                          <p className="text-gray-600 mb-2">
                            <span className="font-medium">Customer Support:</span> support@greengarden.com
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Job Opportunities:</span> careers@greengarden.com
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                            <i className="fas fa-clock"></i>
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                          <div className="text-gray-600 space-y-1">
                            <p className="flex justify-between">
                              <span>Monday - Friday:</span>
                              <span>8:00 AM - 6:00 PM</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Saturday:</span>
                              <span>9:00 AM - 4:00 PM</span>
                            </p>
                            <p className="flex justify-between">
                              <span>Sunday:</span>
                              <span>Closed</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <i className="fas fa-map-marked-alt text-6xl mb-4"></i>
              <p className="text-lg">Map would be displayed here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-300 rounded-md flex items-center justify-center">
                  <i className="fas fa-leaf text-white text-lg"></i>
                </div>
                <span className="text-xl font-bold text-white">
                  Green Garden
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Transforming outdoor spaces into beautiful, sustainable gardens since 2010.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-pinterest-p"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/">
                    <a className="text-gray-400 hover:text-white transition-colors">Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <a className="text-gray-400 hover:text-white transition-colors">Blog</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className="text-gray-400 hover:text-white transition-colors">Contact</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Garden Maintenance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Landscaping
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Planting & Pruning
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Irrigation Systems
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-3 text-green-400"></i>
                  <span>123 Garden Street, Greenville, 12345</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-phone-alt mt-1 mr-3 text-green-400"></i>
                  <span>(123) 456-7890</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-envelope mt-1 mr-3 text-green-400"></i>
                  <span>info@greengarden.com</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-clock mt-1 mr-3 text-green-400"></i>
                  <span>Mon-Fri: 8am - 6pm<br />Sat: 9am - 4pm</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Green Garden Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}