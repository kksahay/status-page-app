import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { getStatusApi } from "@/api/statusApi";

interface StatusMetricProps {
  service_id: number;
  title: string;
  currentStatus: string;
  // statuses are stored in chronological order (oldest first, newest last)
  statuses: string[];
}

export const socket = io("http://localhost:3000");

function StatusMetric({ title, statuses }: StatusMetricProps) {
  // We want exactly 45 bars, with the newest status on the right.
  // If there are fewer than 45 statuses, pad the left side with the first status (if available) so the bars don't appear gray.
  const bars = statuses.length < 45 
    ? [...Array(45 - statuses.length).fill(-1), ...statuses] 
    : statuses.slice(-45);

  return (
    <div className="space-y-2">
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
      </div>
      <div className="flex gap-0.5">
        {bars.map((status, i) => (
          <div
            key={i}
            className={`h-8 flex-1 rounded-full ${
              status === 1 ? "bg-green-500" : status == 0 ? "bg-red-500" : "bg-gray-500"
            }`}
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
  const { userId } = useParams();

  async function fetchServiceReport() {
      if (!userId) return;
      try {
        const response = await getStatusApi(parseInt(userId));
        setStatus(response);
      } catch (error) {
        console.log(error);
      }
    }
  useEffect(() => {
    if (!userId) return;

    fetchServiceReport()

    // Append the new status to the end of the array (keeping chronological order)
    const handleStatusUpdate = (data: { service_id: number; status: string }) => {
      setStatus((prev) =>
        prev.map((s) =>
          s.service_id === data.service_id
            ? { 
                ...s, 
                statuses: [...s.statuses, data.status].slice(-45) 
              }
            : s
        )
      );
    };

    socket.on(`service-update:${userId}`, handleStatusUpdate);
    socket.on(`service-create`, fetchServiceReport);
    
    return () => {
      socket.off(`service-update:${userId}`, handleStatusUpdate);
      socket.off(`service-create`, fetchServiceReport);
    };
  }, [userId]);

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {status.map((s) => (
          <StatusMetric key={s.service_id} {...s} />
        ))}
      </div>
    </TooltipProvider>
  );
}
