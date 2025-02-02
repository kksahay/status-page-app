import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Nav() {
  const location = useLocation()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center space-x-8">
          <div className="w-8 h-8 bg-black rounded-full" />
          <div className="flex space-x-4">
            <Button
              variant="link"
              className={location.pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"}
              asChild
            >
              <Link to="/">Status</Link>
            </Button>
            <Button
              variant="link"
              className={location.pathname === "/events" ? "text-primary font-medium" : "text-muted-foreground"}
              asChild
            >
              <Link to="/events">Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

