import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Instagram, Linkedin, Loader2, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { messageService } from "@/services/messageService";
import type { Profile } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email belum benar"),
  content: z.string().min(20, "Ceritakan kebutuhanmu minimal 20 karakter"),
});

type FormValues = z.infer<typeof schema>;

export function Contact({ profile }: { profile: Profile }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const send = useMutation({
    mutationFn: messageService.send,
    onSuccess: () => {
      toast.success("Pesan terkirim!", {
        description: "Terima kasih, saya akan membalas secepatnya.",
      });
      reset();
    },
    onError: () => toast.error("Pesan gagal dikirim. Coba lagi ya."),
  });

  const info = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: MapPin, label: "Lokasi", value: profile.location, href: undefined },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat langsung", href: profile.socials.whatsapp },
  ];

  const socials = [
    { icon: Linkedin, href: profile.socials.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: profile.socials.instagram, label: "Instagram" },
    { icon: GithubLite, href: profile.socials.github, label: "GitHub" },
  ];

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Mari bekerja sama"
        title="Punya ide atau kebutuhan proyek?"
        description="Ceritakan briefly proyekmu — saya balas biasanya dalam 1x24 jam."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_380px]">
        <Reveal>
          <form
            onSubmit={handleSubmit((values) => send.mutate(values))}
            className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Nama
                </label>
                <Input id="name" placeholder="Nama kamu" {...register("name")} />
                {errors.name ? (
                  <p className="mt-2 text-xs text-destructive">{errors.name.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="nama@perusahaan.com" {...register("email")} />
                {errors.email ? (
                  <p className="mt-2 text-xs text-destructive">{errors.email.message}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="content" className="mb-2 block text-sm font-medium">
                Pesan
              </label>
              <Textarea
                id="content"
                rows={6}
                placeholder="Halo, saya butuh developer untuk…"
                {...register("content")}
              />
              {errors.content ? (
                <p className="mt-2 text-xs text-destructive">{errors.content.message}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full shadow-glow sm:w-auto"
              disabled={send.isPending}
            >
              {send.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Mengirim…
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" /> Kirim Pesan
                </>
              )}
            </Button>
          </form>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex h-full flex-col gap-4">
            {info.map((item) => {
              const Wrapper = item.href ? "a" : "div";
              return (
                <motion.div whileHover={{ x: 4 }} key={item.label}>
                  <Wrapper
                    {...(item.href
                      ? { href: item.href, target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="glow-ring flex items-center gap-4 rounded-2xl border border-border bg-surface p-5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                      <item.icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-xs text-muted-foreground">{item.label}</span>
                      <span className="block text-sm font-medium">{item.value}</span>
                    </span>
                  </Wrapper>
                </motion.div>
              );
            })}

            <div className="mt-auto rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted-foreground">
                Atau temukan saya di jaringan lain:
              </p>
              <div className="mt-3 flex gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function GithubLite(props: { className?: string }) {
  return <Github className={props.className} />;
}

import { Github } from "lucide-react";
