import { Nav } from "@/components/nav"
import { EventsList } from "@/components/events-list"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        <EventsList />
      </main>
    </div>
  )
}

