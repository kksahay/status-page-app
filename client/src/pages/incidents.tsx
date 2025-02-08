import * as React from "react"
import { getServicesApi } from "@/api/serviceApi"
import type { Service } from "@/components/service-list"
import { IncidentList } from "@/components/incidents-list"
import { CloudAlert } from "lucide-react"

export default function IncidentsPage() {
    const [services, setServices] = React.useState<Service[]>([])

    const fetchServices = async () => {
        try {
            const response = await getServicesApi()
            const operationalServices = response.filter((service: Service) => (service.status !== "Operational" && service.status !== "Maintenance"));
            setServices(operationalServices)

        } catch (error) {
            console.log(error);
        }
    }


    React.useEffect(() => {
        fetchServices()
    }, []);

    const handleServiceUpdated = async () => {
        await fetchServices()
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <CloudAlert className="size-6 text-black" />
                    <h1 className="text-3xl font-extrabold text-black tracking-wide">Incidents</h1>
                </div>
            </div>
            <IncidentList services={services} setServices={setServices} onSuccess={handleServiceUpdated} />
        </div>
    )
}
