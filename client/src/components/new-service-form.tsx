import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createServiceApi } from "@/api/serviceApi"
import { useToast } from "@/hooks/use-toast"
import { Loader2, PlusCircle, Link } from "lucide-react"

interface NewServiceFormProps {
  onSuccess?: () => void
}

export function NewServiceForm({ onSuccess }: NewServiceFormProps) {
  const [title, setTitle] = React.useState("")
  const [endpoint, setEndpoint] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const response = await createServiceApi(title, endpoint)
      toast({
        title: "Service Created",
        description: response.message,
        variant: "default",
      })
      setTitle("")
      setEndpoint("")
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title
        </Label>
        <div className="relative">
          <PlusCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="title"
            placeholder="Enter service title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="endpoint" className="text-sm font-medium">
          Endpoint
        </Label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="endpoint"
            placeholder="Enter service endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full transition-all duration-300 hover:bg-blue-600" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Service...
          </>
        ) : (
          "Add Service"
        )}
      </Button>
    </form>
  )
}

