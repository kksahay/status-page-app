import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Nav() {
  const location = useLocation();
  const { userId } = useParams();

  const isStatusActive = location.pathname.includes("/status");
  const isEventsActive = location.pathname.includes("/events");
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center space-x-8">
          <div className="w-8 h-8 bg-black rounded-full" />
          <div className="flex space-x-4">
            <Button
              variant="link"
              className={isStatusActive ? "text-primary font-medium" : "text-muted-foreground"}
              asChild
            >
              <Link to={`/status/${userId ?? "default"}`}>Status</Link>
            </Button>
            <Button
              variant="link"
              className={isEventsActive ? "text-primary font-medium" : "text-muted-foreground"}
              asChild
            >
              <Link to={`/status/${userId ?? "default"}/events`}>Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
