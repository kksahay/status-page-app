import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createServiceApi } from "@/api/serviceApi";
import { useToast } from "@/hooks/use-toast";

export function NewServiceForm() {
  const [title, setTitle] = React.useState("");
  const [endpoint, setEndpoint] = React.useState("");
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await createServiceApi(title, endpoint);
      toast({
        title: "Service",
        description: response.message,
        variant: "destructive"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${error.response}`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter service title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endpoint">Endpoint</Label>
        <Input
          id="endpoint"
          placeholder="Enter service endpoint"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
      </div>
      <Button type="submit">Add Service</Button>
    </form>
  );
}
