import { Link, useLocation } from "react-router-dom";
import type * as React from "react";
import { Command } from "lucide-react"; // Import User icon

import { NavUser } from "./nav-user";
import {
  Sidebar, SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useContext(AuthContext);

  return (
    <Sidebar className="bg-gray-900 text-white" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader className="p-4 border-b border-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="#" className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-gray-800 text-gray-300">
                  <Command className="size-5" />
                </div>
                <div className="text-lg font-bold tracking-wide">Status App</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
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
