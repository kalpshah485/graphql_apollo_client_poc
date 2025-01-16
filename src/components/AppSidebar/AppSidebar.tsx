import { Notebook, Users, UsersRound } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

// Menu items.
const items = [
  {
    title: "Characters",
    url: "characters",
    icon: Users,
  },
  {
    title: "Characters with mutation",
    url: "characters-with-mutation",
    icon: UsersRound,
  },
  {
    title: "Subscription blogs",
    url: "blog-subscription",
    icon: Notebook,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="mt-[72px]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Apollo GraphQL</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
