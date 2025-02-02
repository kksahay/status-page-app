import { CheckCircle } from "lucide-react"
import { formatDate } from "../utils/format"

export function StatusHeader() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">OpenStatus Status Page</h1>
        <p className="text-muted-foreground">Our own status page 🚀</p>
      </div>
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="font-medium">All Systems Operational</span>
        </div>
        <span className="text-sm text-muted-foreground">{formatDate(new Date())}</span>
      </div>
    </div>
  )
}

