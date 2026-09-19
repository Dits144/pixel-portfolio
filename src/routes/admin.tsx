import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { RequireAuth } from "@/components/admin/require-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin — rizky.dev" },
      { name: "description", content: "Kelola konten portofolio rizky.dev." },
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
