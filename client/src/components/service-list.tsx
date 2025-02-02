import * as React from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"

type Service = {
  id: string
  title: string
  endpoint: string
}

const mockServices: Service[] = [
  { id: "1", title: "User API", endpoint: "/api/users" },
  { id: "2", title: "Product API", endpoint: "/api/products" },
  { id: "3", title: "Order API", endpoint: "/api/orders" },
]

export function ServiceList() {
  const [services, setServices] = React.useState<Service[]>(mockServices)

  const handleEdit = (id: string) => {
    // Implement edit functionality
  }

  const handleDelete = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  return (
    <div className="space-y-4 p-4">
      {services.map((service) => (
        <Card key={service.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.endpoint}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(service.id)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(service.id)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

