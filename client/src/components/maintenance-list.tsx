import * as React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { deleteMaintenanceApi, updateMaintenanceApi } from "@/api/maintenanceApi";

export type Maintenance = {
  maintenance_id: number;
  service_id: number;
  title: number;
  start_time: string;
  end_time: string;
  status: string;
};

type MaintenanceListProps = {
  maintenance: Maintenance[]
  setMaintenance: React.Dispatch<React.SetStateAction<Maintenance[]>>
  onSuccess?: () => void
}

export function MaintenanceList({ maintenance, setMaintenance, onSuccess }: MaintenanceListProps) {
  const [selectedMaintenance, setSelectedMaintenance] = React.useState<Maintenance | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedMaintenance) return;
    try {
      const response = await deleteMaintenanceApi(selectedMaintenance.maintenance_id);
      setMaintenance((prev) => prev.filter((s) => s.maintenance_id !== selectedMaintenance.maintenance_id));
      toast({
        title: "Service Deleted",
        description: `${response.message}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    }
    onSuccess?.()
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
    onSuccess?.()
    setIsEditDialogOpen(false);
  };



  return (
    <div className="space-y-4 p-2">
      {maintenance.map((item) => (
        <Card
          key={item.maintenance_id}
          className="bg-gray-900 border-none text-white"
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="text-md font-semibold text-white">{item.title}</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs px-4 py-1 rounded-full ${item.status === "Ongoing" ? "bg-orange-100 text-orange-700 font-semibold border-none" :
                item.status === "Scheduled" ? "bg-blue-100 text-blue-700 font-semibold border-none" :
                  "bg-green-100 text-green-700 font-semibold border-none"}`}>{item.status}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 flex items-center justify-center">
                    <MoreVertical className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-24 bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 p-2 space-y-1 transition-all duration-200">
                  <DropdownMenuItem
                    className="px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-700 hover:text-gray-200 cursor-pointer"
                    onClick={() => {
                      setSelectedMaintenance(item);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-2 rounded-md transition-all duration-200 text-red-500 cursor-pointer"
                    onClick={() => {
                      setSelectedMaintenance(item);
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
      ))}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[50vw] max-w-2xl p-6 sm:p-8 md:p-10 rounded-lg shadow-lg bg-white">
          <DialogHeader>
            <DialogTitle>Complete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this maintenance? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleEdit}
              className="text-black border border-black hover:bg-black hover:text-white font-semibold px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
            >
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
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
    </div>
  );
}
