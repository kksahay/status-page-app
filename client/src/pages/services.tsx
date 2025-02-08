import * as React from "react"
import { Plus, ListChecks, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceList } from "@/components/service-list"
import { NewServiceForm } from "@/components/new-service-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getServicesApi } from "@/api/serviceApi"
import type { Service } from "@/components/service-list"

export default function ServicesPage() {
  const [open, setOpen] = React.useState(false)
  const [services, setServices] = React.useState<Service[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await getServicesApi()
      setServices(response.filter((service: Service) => service.status === "Operational"))
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceAdded = async () => {
    await fetchServices()
    setOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <ListChecks className="size-6 text-black" />
          <h1 className="text-3xl font-extrabold text-black tracking-wide">Services</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchServices}
            disabled={loading}
            className="transition-transform duration-200 hover:rotate-90"
          >
            <RefreshCw className={`size-5 ${loading ? "animate-spin text-gray-400" : "text-black"}`} />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-800 hover:bg-black flex items-center gap-2 text-white font-medium px-4 py-2">
                <Plus className="size-5" />
                <span>New Service</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[50vw] max-w-2xl p-6 sm:p-8 md:p-10 rounded-lg shadow-lg bg-white">
              <NewServiceForm onSuccess={handleServiceAdded} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-400 text-sm">Loading services...</div>
      ) : (
        <ServiceList services={services} setServices={setServices} onSuccess={handleServiceAdded}/>
      )}
    </div>
  )
}
