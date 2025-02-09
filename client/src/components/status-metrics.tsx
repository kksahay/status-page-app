import { Info, CheckCircle, XCircle, Wrench, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStatusApi } from "@/api/statusApi";
import { io, Socket } from "socket.io-client";

interface StatusMetricProps {
  service_id: number;
  title: string;
  currentStatus: string;
  statuses: string[];
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
export const socket: Socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function StatusMetric({ title, currentStatus, statuses }: StatusMetricProps) {
  const statusStyles: Record<string, { bg: string; border: string; Icon: React.ElementType }> = {
    "Major Outage": { bg: "bg-red-50", border: "border-red-100", Icon: XCircle },
    "Maintenance Ongoing": { bg: "bg-blue-50", border: "border-blue-100", Icon: Wrench },
    "Maintenance Scheduled": { bg: "bg-green-50", border: "border-green-100", Icon: Wrench },
    "Operational": { bg: "bg-green-50", border: "border-green-100", Icon: CheckCircle },
    "Degraded Performance": { bg: "bg-orange-50", border: "border-orange-100", Icon: AlertCircle },
  };

  const { bg, border, Icon } = statusStyles[currentStatus] || statusStyles["Degraded Performance"];

  const bars = statuses.length < 45
    ? [...Array(45 - statuses.length).fill(-1), ...statuses]
    : statuses.slice(-45);

  return (
    <div className={`space-y-2 p-4 ${bg} border ${border} rounded-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{title}</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Service status over the last {statuses.length} minutes</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-gray-700" />
          <span className="font-medium ml-2">{currentStatus}</span>
        </div>

      </div>
      <div className="flex gap-0.5">
        {bars.map((status, i) => (
          <div
            key={i}
            className={`h-8 flex-1 rounded-full ${status === 1 ? "bg-green-500" : status === 0 ? "bg-red-500" : "bg-gray-500"}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>45 minutes ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}

export function StatusMetrics() {
  const [status, setStatus] = useState<StatusMetricProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  async function fetchServiceReport() {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await getStatusApi(parseInt(userId));
      setStatus(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId) return;

    fetchServiceReport();

    const handleStatusUpdate = (data: { service_id: number; status: string }) => {
      setStatus((prev) =>
        prev.map((s) =>
          s.service_id === data.service_id
            ? {
              ...s,
              statuses: [...s.statuses, data.status].slice(-45),
            }
            : s
        )
      );
    };

    const handleServiceUpdate = (updatedReport: { service_id: number, title: string, description: string, change_status: string }) => {
      setStatus((prev) =>
        prev.map((s) =>
          s.service_id === updatedReport.service_id ?
            {
              ...s,
              currentStatus: updatedReport.change_status
            }
            : s
        )
      );
    };

    const handleServiceDelete = (serviceId: string) => {
      setStatus((prev) =>
        prev.filter((report) => report.service_id !== parseInt(serviceId))
      );
    };

    socket.on(`status-update:${userId}`, handleStatusUpdate);
    socket.on(`service-create:${userId}`, fetchServiceReport);
    socket.on(`service-update:${userId}`, handleServiceUpdate);
    socket.on(`service-delete:${userId}`, handleServiceDelete);
    socket.on(`maintenance-update:${userId}`, handleServiceUpdate);

    return () => {
      socket.off(`status-update:${userId}`, handleStatusUpdate);
      socket.off(`service-create:${userId}`, fetchServiceReport);
      socket.off(`service-update:${userId}`, handleServiceUpdate);
      socket.off(`service-delete:${userId}`, handleServiceDelete);
      socket.off(`maintenance-update:${userId}`, handleServiceUpdate);
    };
  }, [userId]);

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {loading ? (
          <p className="text-center text-gray-500">Loading statuses...</p>
        ) : status.length === 0 ? (
          <p className="text-center text-gray-500">No statuses available.</p>
        ) : (
          status.map((s) => <StatusMetric key={s.service_id} {...s} />)
        )}
      </div>
    </TooltipProvider>
  );
}
