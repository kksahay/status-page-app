import { AdminSidebar } from "@/components/admin-sidebar";
import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
