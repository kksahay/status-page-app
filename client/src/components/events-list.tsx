import { CheckCircle, AlertTriangle, ShieldAlert, XCircle, CalendarCheck, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceReport } from "@/api/serviceApi";
import { formatDate } from "@/utils/format";
import { socket } from "./status-metrics"; // Ensure this is the correct import for your socket instance

interface ServiceReport {
  service_id: number;
  title: string;
  history: {
    title: string;
    description: string;
    change_status: string;
    created_at: string;
  }[];
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "operational":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "maintenance scheduled":
      return <CalendarCheck className="w-5 h-5 text-blue-500" />;
    case "maintenance ongoing":
      return <Wrench className="w-5 h-5 text-blue-600" />;
    case "maintenance completed":
      return <CheckCircle className="w-5 h-5 text-blue-600" />;
    case "degraded performance":
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case "partial outage":
      return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
    case "major outage":
      return <XCircle className="w-5 h-5 text-red-600" />;
    default:
      return <AlertTriangle className="w-5 h-5 text-gray-400" />;
  }
}

function EventCard({ event }: { event: ServiceReport["history"][0] }) {
  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm">
      <CardContent className="p-4 flex gap-4 items-start">
        <div className="flex-shrink-0">{getStatusIcon(event.change_status)}</div>
        <div className="flex flex-col space-y-1">
          <p className="text-sm text-gray-600">{event.description}</p>
          <span className="text-xs text-gray-400">{formatDate(event.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventsList() {
  const [serviceReport, setServiceReport] = useState<ServiceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  async function fetchServiceReport() {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await getServiceReport(parseInt(userId));
      setServiceReport(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId) return;
    fetchServiceReport();

    const handleServiceUpdate = (updatedReport: { service_id: number, title: string, description: string, change_status: string }) => {
      setServiceReport((prevReports) =>
        prevReports.map((report) =>
          report.service_id === updatedReport.service_id
            ? {
              ...report, history: [
                {
                  title: updatedReport.title,
                  description: updatedReport.description,
                  change_status: updatedReport.change_status,
                  created_at: new Date().toISOString(),
                },
                ...report.history,
              ]
            }
            : report
        )
      );
    };

    const handleServiceDelete = (serviceId: string) => {
      setServiceReport((prevReports) =>
        prevReports.filter((report) => report.service_id !== parseInt(serviceId))
      );
    };

    socket.on(`service-update:${userId}`, handleServiceUpdate);
    socket.on(`service-delete:${userId}`, handleServiceDelete);
    socket.on(`maintenance-update:${userId}`, handleServiceUpdate);

    return () => {
      socket.off(`service-update:${userId}`, handleServiceUpdate);
      socket.off(`service-delete:${userId}`, handleServiceDelete);
      socket.off(`maintenance-update:${userId}`, handleServiceUpdate);
    };
  }, [userId]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Status Page</h1>
        <p className="text-sm text-gray-500">Keep track of real-time service updates 🚀</p>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-6 text-sm">Fetching latest updates...</div>
      ) : serviceReport.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-sm">No incidents to report.</div>
      ) : (
        <div className="space-y-8">
          {serviceReport.map(
            (item) =>
              item.history.length > 0 && (
                <div key={item.service_id} className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 border-b pb-1">{item.title}</h2>
                  <div className="space-y-3">
                    {item.history.map((event) => (
                      <EventCard key={event.created_at} event={event} />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
