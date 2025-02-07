import { Nav } from "@/components/nav"
import { StatusHeader } from "@/components/status-header"
import { StatusMetrics } from "@/components/status-metrics"

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        <StatusHeader />
        <StatusMetrics />
      </main>
    </div>
  )
}