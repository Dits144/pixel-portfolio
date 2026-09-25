import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { RequireAuth } from "@/components/admin/require-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin — Raditya.tech" },
      { name: "description", content: "Kelola konten portofolio Raditya.tech." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <RequireAuth>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </RequireAuth>
  );
}
