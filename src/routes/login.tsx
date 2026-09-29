import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import logoImg from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email("Format email belum benar"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk Panel Admin — Raditya.tech" },
      {
        name: "description",
        content:
          "Halaman masuk untuk mengelola profil, skill, sertifikat, proyek, testimoni, dan pesan masuk di portofolio Raditya.tech.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Masuk Panel Admin — Raditya.tech" },
      {
        property: "og:description",
        content: "Masuk untuk mengelola konten portofolio Raditya.tech.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [ready, setReady] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    setReady(true);
    setFocus("email");
  }, [setFocus]);

  if (ready && user) return <Navigate to="/admin" />;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const profile = await authService.login(values.email, values.password);
      queryClient.invalidateQueries();
      toast.success(`Selamat datang kembali, ${profile.name.split(" ")[0]}!`);
      navigate({ to: "/admin" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login gagal.");
    }
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-gradient-brand opacity-20 blur-[120px]" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center flex flex-col items-center">
          <img
            src={logoImg}
            alt="Raditya.tech"
            className="size-16 rounded-2xl object-cover border-2 border-primary/50 shadow-glow mb-1"
          />
          <h1 className="mt-3 font-display text-2xl font-bold">Panel Admin Raditya.tech</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masuk untuk mengelola konten portofolio.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass-panel space-y-4 rounded-2xl p-6 shadow-card sm:p-8"
          noValidate
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="dits144@gmail.com"
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email ? (
              <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="px-9"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password ? (
              <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full shadow-glow" disabled={!ready || isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {!ready ? "Menyiapkan…" : isSubmitting ? "Memeriksa…" : "Masuk"}
          </Button>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Kembali ke portofolio
          </a>
        </p>
      </div>
    </div>
  );
}
