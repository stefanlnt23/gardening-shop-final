import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PortfolioItem, Service } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

export default function AdminPortfolio() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);

  // Fetch portfolio items
  const { data: portfolioData, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio'],
    refetchOnWindowFocus: false,
  });

  // Fetch services for display
  const { data: servicesData } = useQuery({
    queryKey: ['/api/services'],
    refetchOnWindowFocus: false,
  });

  const portfolioItems = portfolioData?.portfolioItems || [];
  const services = servicesData?.services || [];

  // Helper to get service name
  const getServiceName = (serviceId: number | null): string => {
    if (!serviceId) return "No Service";
    const service = services.find((s: Service) => s.id === serviceId);
    return service ? service.name : "Unknown Service";
  };

  // Delete portfolio item mutation
  const deletePortfolioItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await apiRequest("DELETE", `/api/portfolio/${itemId}`);
    },
    onSuccess: () => {
      toast({
        title: "Portfolio Item Deleted",
        description: "The portfolio item has been successfully deleted",
      });
      // Invalidate portfolio query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete the portfolio item",
        variant: "destructive",
      });
    },
  });

  // Handle delete click
  const handleDeleteClick = (item: PortfolioItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deletePortfolioItemMutation.mutate(itemToDelete.id);
    }
  };

  return (
    <AdminLayout 
      title="Portfolio" 
      description="Manage your project portfolio"
      action={
        <Link href="/admin/portfolio/new">
          <Button className="bg-green-600 hover:bg-green-700">
            <i className="fas fa-plus mr-2"></i> Add Project
          </Button>
        </Link>
      }
    >
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <i className="fas fa-spinner fa-spin text-3xl text-gray-400 mb-4"></i>
              <p className="text-gray-500">Loading portfolio items...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <i className="fas fa-exclamation-circle text-3xl text-red-500 mb-4"></i>
              <p className="text-gray-500">Error loading portfolio items</p>
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="p-8 text-center">
              <i className="fas fa-images text-5xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No portfolio items found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first project</p>
              <Link href="/admin/portfolio/new">
                <Button className="bg-green-600 hover:bg-green-700">
                  <i className="fas fa-plus mr-2"></i> Add Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioItems.map((item: PortfolioItem) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {item.imageUrl ? (
                            <div className="h-10 w-10 rounded-md overflow-hidden">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                              <i className="fas fa-image text-green-600"></i>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description.length > 50 
                                ? `${item.description.substring(0, 50)}...` 
                                : item.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getServiceName(item.serviceId)}</TableCell>
                      <TableCell>{format(new Date(item.date), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/admin/portfolio/${item.id}`)}
                          >
                            <i className="fas fa-edit text-blue-600"></i>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <i className="fas fa-trash text-red-600"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the portfolio item "{itemToDelete?.title}". 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deletePortfolioItemMutation.isPending}
            >
              {deletePortfolioItemMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}