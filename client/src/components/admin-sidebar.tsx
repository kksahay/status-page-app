import { Link } from "react-router-dom";
import type * as React from "react";
import { Command } from "lucide-react"; // Import Command icon

import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useContext(AuthContext);
  return (
    <Sidebar className="bg-gray-900 text-white flex flex-col h-full" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader className="p-4 border-b border-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="#" className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center rounded-lg bg-gray-800 text-gray-300">
                  <Command className="size-5" />
                </div>
                <div className="text-md font-bold tracking-wide">Admin Dashboard</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="flex-grow px-2 py-4">
        {/* Content remains empty for now */}
      </div>

      <SidebarFooter className="border-t border-gray-800 p-4">
        <NavUser user={{
          name: user?.name || "Shadcn",
          email: user?.email || "shadcn@example.com",
          avatar: "/avatars/shadcn.jpg",
        }} />
      </SidebarFooter>
    </Sidebar>
  );
}
