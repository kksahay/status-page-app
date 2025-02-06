import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function MaintenancePage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission
  }

  return (
    <div className="p-6 w-full min-w-0">
      <h1 className="text-2xl font-bold mb-6">Maintenance</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl w-full">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter maintenance title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Enter maintenance description" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDateTime">Start Date and Time</Label>
          <Input id="startDateTime" type="datetime-local" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDateTime">End Date and Time</Label>
          <Input id="endDateTime" type="datetime-local" />
        </div>
        <Button type="submit">Schedule Maintenance</Button>
      </form>
    </div>
  )
}

