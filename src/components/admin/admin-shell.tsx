import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ExternalLink, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { AppSidebar, adminNav } from "@/components/admin/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export function AdminShell({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const current = adminNav.find((item) =>
    item.url === "/admin" ? pathname === item.url : pathname.startsWith(item.url),
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
      queryClient.clear();
      toast.success("Berhasil keluar dari panel admin.");
      navigate({ to: "/login" });
    } catch {
      toast.error("Gagal keluar.");
    }
  };

  const initials = (user?.name ?? "A")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-5">
          <SidebarTrigger className="-ml-1" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-base font-semibold sm:text-lg">
              {current?.title ?? "Admin"}
            </h1>
          </div>

          <Badge
            variant="outline"
            className="hidden font-mono text-[11px] sm:inline-flex border-emerald-500/40 text-emerald-400 bg-emerald-500/10 gap-1.5 py-0.5 px-2.5 items-center"
          >
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Production
          </Badge>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Akun admin">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-gradient-brand text-xs text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/">
                  <ExternalLink className="mr-2 size-4" /> Buka situs publik
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
