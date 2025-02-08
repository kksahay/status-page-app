import { ChevronsUpDown, LogOut } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useContext } from "react"
import { AuthContext } from "@/context/authContext"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { logout } = useContext(AuthContext)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="flex items-center gap-3 rounded-lg px-4 py-2  text-white hover:bg-gray-700 transition duration-200"
            >
              <Avatar className="h-9 w-9 rounded-md">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-md bg-gray-700">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold">{user.name}</span>
                <span className="truncate text-xs text-gray-400">{user.email}</span>
              </div>
              <ChevronsUpDown className="size-4 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Elegant & Slick Dropdown */}
          <DropdownMenuContent
            className="min-w-60 bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 p-2 space-y-1 transition-all duration-200"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-md">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-md bg-gray-700">CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="border-gray-700" />

            <DropdownMenuItem
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white transition duration-200 cursor-pointer rounded-md"
              onClick={() => logout()}
            >
              <LogOut className="size-4 opacity-80" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
