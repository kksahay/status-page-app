import { Activity, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceReport } from "@/api/serviceApi";
import { formatDate } from "@/utils/format";
import { socket } from "./status-metrics";


interface ServiceReport {
  service_id: string;
  title: string;
  history: {
    title: string;
    description: string;
    change_status: string;
    created_at: string;
  }[];
}

function EventCard({ event }: { event: ServiceReport["history"][0] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-gray-800">
        <div className="flex gap-5">
          {event.change_status === "resolved" ? (
            <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
          ) : (
            <Activity className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold capitalize text-gray-900">{event.description}</span>
              <span className="text-sm text-gray-500">{formatDate(event.created_at)}</span>
            </div>
            <p className="text-base text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventsList() {
  const [serviceReport, setServiceReport] = useState<ServiceReport[]>([]);
  const { userId } = useParams();

  async function fetchServiceReport() {
    if (!userId) return;
    try {
      const response = await getServiceReport(parseInt(userId));
      setServiceReport(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!userId) return;
    fetchServiceReport();

    socket.on("service-update", fetchServiceReport);
    socket.on("service-delete", fetchServiceReport);

    return () => {
      socket.off("service-update", fetchServiceReport);
      socket.off("service-delete", fetchServiceReport);
    };
  }, [userId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">OpenStatus Status Page</h1>
          <p className="text-lg text-gray-600">Our own status page 🚀</p>
        </div>
      </div>
      <div className="space-y-14">
        {serviceReport.map(
          (item) =>
            item.history.length > 0 && (
              <div key={item.service_id} className="space-y-6">
                <h2 className="text-2xl font-semibold sticky top-0 bg-white py-3 z-10 border-b-2 border-gray-300">
                  {item.title}
                </h2>
                <div className="space-y-5">
                  {item.history.map((event) => (
                    <EventCard key={event.created_at} event={event} />
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
