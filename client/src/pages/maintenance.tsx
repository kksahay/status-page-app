import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { getServicesApi } from "@/api/serviceApi"
import { NewMaintenanceForm } from "@/components/new-maintenance-form"
import { Maintenance, MaintenanceList } from "@/components/maintenance-list"
import { getMaintenanaceApi } from "@/api/maintenanceApi"
import { Service } from "@/components/service-list"

export default function MaintenancePage() {
  const [open, setOpen] = React.useState(false)
  const [maintenance, setMaintenance] = React.useState<Maintenance[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);

  React.useEffect(() => {
    const fetchMaintenance = async () => {
      const response = await getMaintenanaceApi()
      setMaintenance(response)
    }
    const fetchServices = async () => {
      const response = await getServicesApi();
      setServices(response);
    }
    fetchMaintenance()
    fetchServices()
  }, [])

  const handleMaintenanceAdded = async () => {
    const response = await getMaintenanaceApi()
    setMaintenance(response)
    setOpen(false)
  }



  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Maintenance</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-6">
            <NewMaintenanceForm onSuccess={handleMaintenanceAdded} services={services} />
          </DialogContent>
        </Dialog>
      </div>
      <MaintenanceList maintenance={maintenance} setMaintenance={setMaintenance} />
    </div>
  )
}
