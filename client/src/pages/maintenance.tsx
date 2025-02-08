import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Settings, RefreshCw } from "lucide-react"
import { getServicesApi } from "@/api/serviceApi"
import { NewMaintenanceForm } from "@/components/new-maintenance-form"
import { Maintenance, MaintenanceList } from "@/components/maintenance-list"
import { getMaintenanaceApi } from "@/api/maintenanceApi"
import { Service } from "@/components/service-list"

export default function MaintenancePage() {
  const [open, setOpen] = React.useState(false)
  const [maintenance, setMaintenance] = React.useState<Maintenance[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await getServicesApi()
      setServices(response)
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaintenance = async () => {
    setLoading(true)
    try {
      const response = await getMaintenanaceApi()
      setMaintenance(response)
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchMaintenance()
    fetchServices()
  }, [])

  const handleMaintenanceAdded = async () => {
    const response = await getMaintenanaceApi()
    setMaintenance(response)
    setOpen(false)
  }



  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <Settings className="size-6 text-black" />
          <h1 className="text-3xl font-extrabold text-black tracking-wide">Maintenance</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchMaintenance}
            disabled={loading}
            className="transition-transform duration-200 hover:rotate-90"
          >
            <RefreshCw className={`size-5 ${loading ? "animate-spin text-gray-400" : "text-black"}`} />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-800 hover:bg-black flex items-center gap-2 text-white font-medium px-4 py-2">
                <Plus className="size-5" />
                <span>New Maintenance</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[50vw] max-w-2xl p-6 sm:p-8 md:p-10 rounded-lg shadow-lg bg-white">
              <NewMaintenanceForm onSuccess={handleMaintenanceAdded} services={services} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <MaintenanceList maintenance={maintenance} setMaintenance={setMaintenance} onSuccess={handleMaintenanceAdded} />
    </div>
  )
}
