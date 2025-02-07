import * as React from "react"
import { getServicesApi } from "@/api/serviceApi"
import type { Service } from "@/components/service-list"
import { IncidentList } from "@/components/incidents-list"

export default function IncidentsPage() {
    const [services, setServices] = React.useState<Service[]>([])

    React.useEffect(() => {
        const fetchServices = async () => {
            const response = await getServicesApi()
            const operationalServices = response.filter((service: Service) => service.status !== "Operational")
            setServices(operationalServices)
        }
        fetchServices()
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Incidents</h1>
            </div>
            <IncidentList services={services} setServices={setServices} />
        </div>
    )
}
