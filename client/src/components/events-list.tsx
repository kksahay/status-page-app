import { ChevronRight, Activity, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  date: string
  title: string
  services: string[]
  updates: {
    type: "resolved" | "monitoring"
    timestamp: string
    description: string
  }[]
}

const events: Event[] = [
  {
    date: "Sep 01, 2024",
    title: "Upstream downtime",
    services: ["OpenStatus", "OpenStatus Status Page", "OpenStatus API"],
    updates: [
      {
        type: "resolved",
        timestamp: "Sep 01, 2024 20:13 (UTC)",
        description: "All systems are now back online. We are continuously monitoring the situation.",
      },
      {
        type: "monitoring",
        timestamp: "Sep 01, 2024 20:07 (UTC)",
        description:
          "We experienced an issue with our cloud infrastructure provider, which caused our database hosting provider to go down, affecting our APIs, status pages, and internal speed checker probes.\n\nThe database provider has since recovered, and our APIs and status pages are back online. However, we're still monitoring the ongoing outage with our cloud provider to restore our checker probes.",
      },
    ],
  },
  {
    date: "Aug 07, 2024",
    title: "Vercel issues",
    services: ["OpenStatus Status Page"],
    updates: [
      {
        type: "monitoring",
        timestamp: "Aug 07, 2024 20:01 (UTC)",
        description:
          "Our hosting provider Vercel is having an increase of 400 errors. We are aware of the dependency and will be working on a solution to reduce the risk.\n\nFollow more on vercel-status.",
      },
    ],
  },
]

function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {event.services.map((service) => (
            <Badge key={service} variant="secondary">
              {service}
            </Badge>
          ))}
        </div>
        <div className="space-y-4">
          {event.updates.map((update, index) => (
            <div key={index} className="flex gap-4">
              {update.type === "resolved" ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              ) : (
                <Activity className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{update.type}</span>
                  <span className="text-sm text-muted-foreground">{update.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{update.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function EventsList() {
  const groupedEvents = events.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = []
      }
      acc[event.date].push(event)
      return acc
    },
    {} as Record<string, Event[]>,
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">OpenStatus Status Page</h1>
          <p className="text-muted-foreground">Our own status page 🚀</p>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-12">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="space-y-4">
            <h2 className="text-xl font-semibold sticky top-0 bg-background py-2 z-10">{date}</h2>
            <div className="space-y-4">
              {dateEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

