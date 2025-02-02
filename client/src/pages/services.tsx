import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceList } from "@/components/service-list"
import { NewServiceForm } from "@/components/new-service-form"

export default function ServicesPage() {
  const [showNewServiceForm, setShowNewServiceForm] = React.useState(false)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Services</h1>
      <Button onClick={() => setShowNewServiceForm(!showNewServiceForm)} className="mb-4">
        <Plus className="mr-2 h-4 w-4" />
        New Service
      </Button>
      {showNewServiceForm && <NewServiceForm />}
      <ServiceList />
    </div>
  )
}

