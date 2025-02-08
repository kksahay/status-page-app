import { Link, useLocation } from "react-router-dom";
import type * as React from "react";
import { Activity, Bell, Cog, Command } from "lucide-react";

import { NavUser } from "./nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Services",
            url: "/dashboard/services",
            icon: Cog,
        },
        {
            title: "Incidents",
            url: "/dashboard/incidents",
            icon: Bell,
        },
        {
            title: "Maintenance",
            url: "/dashboard/maintenance",
            icon: Activity,
        },
    ],
};

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation();

    // Default to "Services" if no match
    const activePath = data.navMain.some((item) => item.url === location.pathname)
        ? location.pathname
        : "/dashboard/services";

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

            {/* Sidebar Content */}
            <SidebarContent className="px-2 py-4">
                <SidebarMenu className="space-y-1">
                    {data.navMain.map((item) => {
                        const isActive = activePath === item.url;
                        return (
                            <SidebarMenuItem key={item.url}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        to={item.url}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-2 text-base font-semibold rounded-md transition-all duration-200",
                                            isActive
                                                ? "bg-gray-800 text-white shadow-sm"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        )}
                                    >
                                        <item.icon className="size-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter className="border-t border-gray-800 p-4">
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
