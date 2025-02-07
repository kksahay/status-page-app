import * as React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { deleteServiceApi } from "@/api/serviceApi";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { updateMaintenanceApi } from "@/api/maintenanceApi";

export type Maintenance = {
  maintenance_id: number;
  service_id: number;
  service_name: number;
  start_time: string;
  end_time: string;
  status: string;
};

type MaintenanceListProps = {
  maintenance: Maintenance[]
  setMaintenance: React.Dispatch<React.SetStateAction<Maintenance[]>>
}

export function MaintenanceList({ maintenance, setMaintenance }: MaintenanceListProps) {
  const [selectedMaintenance, setSelectedMaintenance] = React.useState<Maintenance | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedMaintenance) return;
    try {
      const response = await deleteServiceApi(selectedMaintenance.maintenance_id);
      setMaintenance((prev) => prev.filter((s) => s.maintenance_id !== selectedMaintenance.maintenance_id));
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
    if (!selectedMaintenance) return;

    try {
      const response = await updateMaintenanceApi(selectedMaintenance.service_id);

      setMaintenance((prev) =>
        prev.map((s) => (s.maintenance_id === selectedMaintenance.maintenance_id ? selectedMaintenance : s))
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



  return (
    <div className="space-y-4 p-4">
      {maintenance.map((item) => (
        <Card
          key={item.maintenance_id}
          className="bg-gray-50 border border-gray-200 rounded-lg"
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{item.service_name}</h3>
              <p className="text-sm text-gray-500">{item.status}</p>
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
                    setSelectedMaintenance(item);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Complete
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-4 py-2 hover:bg-red-100 text-red-600 transition-all"
                  onClick={() => {
                    setSelectedMaintenance(item);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this maintenance? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleEdit}>
              Confirm Completion
            </Button>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
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
