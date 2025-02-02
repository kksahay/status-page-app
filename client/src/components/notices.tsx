import { FileText } from "lucide-react"

export function Notices() {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
        <FileText className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-medium">No recent notices</h2>
        <p className="text-sm text-muted-foreground">There have been no reports within the last 7 days.</p>
      </div>
    </div>
  )
}

