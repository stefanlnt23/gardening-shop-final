import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { insertBlogPostSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Extend the schema with validation
const formSchema = insertBlogPostSchema.extend({
  // Add any additional validation here
  content: z.string().min(30, "Content must be at least 30 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(150, "Excerpt must be less than 150 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminBlogPostForm() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id;

  // Fetch blog post data if editing
  const { data, isLoading: isLoadingPost } = useQuery({
    queryKey: ['/api/blog', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiRequest("GET", `/api/blog/${id}`);
      const data = await response.json();
      return data;
    },
    enabled: isEditing,
  });

  // Fetch users (authors) for the dropdown
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/users'],
    refetchOnWindowFocus: false,
  });

  const users = usersData?.users || [];
  const blogPost = data?.blogPost;

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      authorId: undefined,
      publishedAt: new Date(),
    },
  });

  // Update form values when blog post data is loaded
  useEffect(() => {
    if (blogPost) {
      form.reset({
        title: blogPost.title,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        imageUrl: blogPost.imageUrl || "",
        authorId: blogPost.authorId,
        publishedAt: new Date(blogPost.publishedAt),
      });
    }
  }, [blogPost, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await apiRequest("POST", "/api/blog", values);
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Created",
        description: "The blog post has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      setLocation("/admin/blog");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create the blog post",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await apiRequest("PUT", `/api/blog/${id}`, values);
    },
    onSuccess: () => {
      toast({
        title: "Blog Post Updated",
        description: "The blog post has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog', id] });
      setLocation("/admin/blog");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update the blog post",
        variant: "destructive",
      });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <AdminLayout
      title={isEditing ? "Edit Blog Post" : "Create New Blog Post"}
      description={isEditing ? "Update post details" : "Write a new blog post"}
      action={
        <Button 
          variant="outline" 
          onClick={() => setLocation("/admin/blog")}
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to Blog Posts
        </Button>
      }
    >
      <Card>
        <CardContent className="pt-6">
          {isEditing && isLoadingPost ? (
            <div className="flex items-center justify-center p-6">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mr-3"></i>
              <p>Loading blog post data...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog post title" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive title for your blog post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a brief summary of the post"
                          className="min-h-16"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that will appear in blog listings (max 150 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your blog post content here"
                          className="min-h-64"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The main content of your blog post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : undefined}
                        disabled={isLoadingUsers}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingUsers ? (
                            <SelectItem value="loading" disabled>Loading authors...</SelectItem>
                          ) : users.length === 0 ? (
                            <SelectItem value="none" disabled>No authors available</SelectItem>
                          ) : (
                            users.map((user) => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Who wrote this blog post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Publication Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When the blog post should be published
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        A URL to an image for the blog post (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setLocation("/admin/blog")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        {isEditing ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      isEditing ? "Update Post" : "Publish Post"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}