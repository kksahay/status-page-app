import * as React from "react";
import { MoreVertical, CloudOff, Gauge, ServerCrash } from "lucide-react";
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
  onSuccess?: () => void
}

export function ServiceList({ services, setServices, onSuccess }: ServiceListProps) {
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
    onSuccess?.();
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
    onSuccess?.();
    setIsEditDialogOpen(false);
  };

  const selectType = (type: string) => {
    setSelectedService((prev) => prev && { ...prev, selectedType: type });
  };

  return (
    <div className="space-y-4 p-2">
      {services.map((service) => (
        <Card
          key={service.service_id}
          className="bg-gray-900 border-none text-white"
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-md font-semibold text-white">{service.title}</h3>
              <p className="text-xs text-white mt-1">Endpoint: {service.endpoint}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold border-none">{service.status}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 flex items-center justify-center">
                    <MoreVertical className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-24 bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 p-2 space-y-1 transition-all duration-200"
                >
                  <DropdownMenuItem
                    className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-700 hover:text-gray-200 cursor-pointer"
                    onClick={() => {
                      setSelectedService(service);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-2 rounded-md transition-all duration-200 text-red-500 cursor-pointer"
                    onClick={() => {
                      setSelectedService(service);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>

              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))
      }

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[50vw] max-w-2xl p-6 sm:p-8 md:p-10 rounded-lg shadow-lg bg-white">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update the service details and save changes.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
              <Input
                id="title"
                value={selectedService?.title || ""}
                disabled
                className="bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="endpoint" className="text-sm font-medium text-gray-700">Endpoint</Label>
              <Input
                id="endpoint"
                value={selectedService?.endpoint || ""}
                disabled
                className="bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className={`${selectedService?.selectedType === "Degraded Performance"
                  ? "bg-black text-white hover:bg-black hover:text-white"
                  : "bg-transparent text-black"
                  }`}
                onClick={() => selectType("Degraded Performance")}
              >
                <Gauge className="w-4 h-4 mr-2" /> Degraded Performance
              </Button>

              <Button
                variant="outline"
                className={`${selectedService?.selectedType === "Partial Outage"
                  ? "bg-black text-white hover:bg-black hover:text-white"
                  : "bg-transparent text-black"
                  }`}
                onClick={() => selectType("Partial Outage")}
              >
                <CloudOff className="w-4 h-4 mr-2" /> Partial Outage
              </Button>

              <Button
                variant="outline"
                className={`${selectedService?.selectedType === "Major Outage"
                  ? "bg-black text-white hover:bg-black hover:text-white"
                  : "bg-transparent text-black"
                  }`}
                onClick={() => selectType("Major Outage")}
              >
                <ServerCrash className="w-4 h-4 mr-2" /> Major Outage
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
            <Button
              onClick={handleEdit}
              disabled={!selectedService?.description?.trim()}
              className="bg-black hover:bg-black text-white font-semibold px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[50vw] max-w-2xl p-6 sm:p-8 md:p-10 rounded-lg shadow-lg bg-white">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
