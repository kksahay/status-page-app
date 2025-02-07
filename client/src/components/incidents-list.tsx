import * as React from "react";
import { MoreVertical, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { deleteServiceApi, updateServiceApi } from "@/api/serviceApi";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Service = {
  service_id: number;
  title: string;
  description?: string;
  endpoint: string;
  status: string;
  selectedType?: string;
};

type ServiceListProps = {
  services: Service[]
  setServices: React.Dispatch<React.SetStateAction<Service[]>>
}

export function IncidentList({ services, setServices }: ServiceListProps) {
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { toast } = useToast();

  

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      const response = await deleteServiceApi(selectedService.service_id);
      setServices((prev) => prev.filter((s) => s.service_id !== selectedService.service_id));
      toast({
        title: "Service Deleted",
        description: `${response.message}`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = async () => {
    if (!selectedService) return;

    try {
      const response = await updateServiceApi(
        selectedService.service_id,
        selectedService.title,
        selectedService.description ?? "",
        selectedService.endpoint,
        selectedService.selectedType ?? "Operational"
      );

      setServices((prev) =>
        prev.map((s) => (s.service_id === selectedService.service_id ? selectedService : s))
      );

      toast({
        title: "Service Updated",
        description: `${response.message}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    }
    setIsEditDialogOpen(false);
  };

  const selectType = (type: string) => {
    setSelectedService((prev) => prev && { ...prev, selectedType: type });
  };

  return (
    <div className="space-y-4 p-4">
      {services.map((service) => (
        <Card
          key={service.service_id}
          className="bg-gray-50 border border-gray-200 rounded-lg"
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
              <p className="text-sm text-gray-500">{service.status}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 flex items-center justify-center">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 shadow-lg rounded-md">
                <DropdownMenuItem
                  className="px-4 py-2 hover:bg-gray-100 transition-all"
                  onClick={() => {
                    setSelectedService(service);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-4 py-2 hover:bg-red-100 text-red-600 transition-all"
                  onClick={() => {
                    setSelectedService(service);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update the service details and save changes.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={selectedService?.title || ""} disabled />
            </div>
            <div>
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input id="endpoint" value={selectedService?.endpoint || ""} disabled />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedService?.selectedType === "Operational" ? "default" : "outline"}
                onClick={() => selectType("Operational")}
              >
                <Settings className="w-4 h-4 mr-2" /> Operational
              </Button>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={selectedService?.description || ""}
                disabled={!Boolean(selectedService?.selectedType)}
                onChange={(e) =>
                  setSelectedService((prev) => prev && { ...prev, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit} disabled={!selectedService?.description?.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
