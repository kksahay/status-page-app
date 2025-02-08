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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <PlusCircle className="size-5 text-gray-900" />
        Add New Service
      </h2>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </Label>
        <div className="relative">
          <PlusCircle className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="title"
            placeholder="Enter service title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pl-10 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="endpoint" className="text-sm font-medium text-gray-700">
          Endpoint
        </Label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="endpoint"
            placeholder="Enter service endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="pl-10 bg-gray-50 border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-gray-700 hover:bg-black text-white font-semibold px-4 py-2 rounded-md transition-all flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin size-4" />
            Adding Service...
          </>
        ) : (
          "Add Service"
        )}
      </Button>
    </form>
  )
}
