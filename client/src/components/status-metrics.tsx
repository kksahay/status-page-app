import { Info } from "lucide-react"
import { formatUptime } from "../utils/format"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface StatusMetricProps {
  name: string
  uptime: number
  days: number[]
}

function StatusMetric({ name, uptime, days }: StatusMetricProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Service status over the last {days.length} days</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-sm text-muted-foreground">{formatUptime(uptime)}</span>
      </div>
      <div className="flex gap-0.5">
        {days.map((status, i) => (
          <div
            key={i}
            className={`h-8 flex-1 rounded-full ${
              status === 1 ? "bg-green-500" : status === 0.5 ? "bg-yellow-500" : "bg-red-500"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>45 days ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}

export function StatusMetrics() {
  const metrics = [
    { name: "OpenStatus", uptime: 99.99, days: Array(45).fill(1) },
    { name: "OpenStatus Status Page", uptime: 99.97, days: Array(45).fill(1) },
    { name: "OpenStatus API", uptime: 99.98, days: [...Array(43).fill(1), 0.5, Array(1).fill(1)] },
    { name: "OpenStatus Astro Status Page", uptime: 99.98, days: Array(45).fill(1) },
  ]

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {metrics.map((metric) => (
          <StatusMetric key={metric.name} {...metric} />
        ))}
      </div>
    </TooltipProvider>
  )
}

