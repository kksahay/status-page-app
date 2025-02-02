import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NewServiceForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Enter service title" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endpoint">Endpoint</Label>
        <Input id="endpoint" placeholder="Enter service endpoint" />
      </div>
      <Button type="submit">Add Service</Button>
    </form>
  )
}

