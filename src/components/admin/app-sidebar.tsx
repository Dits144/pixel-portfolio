import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  FolderGit2,
  Inbox,
  LayoutDashboard,
  LogOut,
  Quote,
  Sparkles,
  Terminal,
  UserCog,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export const adminNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Profil", url: "/admin/profile", icon: UserCog },
  { title: "Skill", url: "/admin/skills", icon: Wrench },
  { title: "Proyek", url: "/admin/projects", icon: FolderGit2 },
  { title: "Pengalaman", url: "/admin/experiences", icon: Briefcase },
  { title: "Testimoni", url: "/admin/testimonials", icon: Quote },
  { title: "Pesan", url: "/admin/messages", icon: Inbox },
  { title: "Surat Lamaran AI", url: "/admin/cover-letter", icon: Sparkles },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = (url: string) => (url === "/admin" ? pathname === url : pathname.startsWith(url));

  const handleLogout = async () => {
    await authService.logout();
    queryClient.clear();
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-primary-foreground">
                  <Terminal className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-sm font-semibold">rizky.dev</span>
                  <span className="text-xs text-muted-foreground">Admin panel</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Konten</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link
                      to={item.url}
                      onClick={() => setOpenMobile(false)}
                      className={cn(isActive(item.url) && "font-medium")}
                    >
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

      <SidebarFooter>
        <div className="flex flex-col gap-2 px-1">
          <p className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            {user?.email}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="justify-start gap-2"
          >
            <LogOut className="size-4" />
            {isMobile ? null : <span className="group-data-[collapsible=icon]:hidden">Keluar</span>}
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
