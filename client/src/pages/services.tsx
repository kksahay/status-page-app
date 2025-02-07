import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceList } from "@/components/service-list"
import { NewServiceForm } from "@/components/new-service-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getServicesApi } from "@/api/serviceApi"
import type { Service } from "@/components/service-list"
export default function ServicesPage() {
  const [open, setOpen] = React.useState(false)
  const [services, setServices] = React.useState<Service[]>([])

  React.useEffect(() => {
    const fetchServices = async () => {
      const response = await getServicesApi()
      const operationalServices = response.filter((service: Service) => service.status === "Operational")
      setServices(operationalServices)
    }
    fetchServices()
  }, [])

  const handleServiceAdded = async () => {
    const response = await getServicesApi()
    setServices(response)
    setOpen(false)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <NewServiceForm onSuccess={handleServiceAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <ServiceList services={services} setServices={setServices} />
    </div>
  )
}
