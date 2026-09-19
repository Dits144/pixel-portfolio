import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";

/**
 * Menjaga halaman admin supaya hanya bisa dibuka setelah login.
 * Sengaja menunda pengecekan sampai mount supaya HTML server dan render
 * pertama client identik (tidak ada hydration mismatch saat localStorage dibaca).
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  if (!ready) return <AdminBootSkeleton />;
  if (!user) {
    queryClient.clear();
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

function AdminBootSkeleton() {
  return (
    <div className="flex min-h-screen gap-6 bg-background p-6">
      <Skeleton className="hidden h-[calc(100vh-3rem)] w-60 rounded-2xl lg:block" />
      <div className="flex-1 space-y-6">
        <Skeleton className="h-9 w-52" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
