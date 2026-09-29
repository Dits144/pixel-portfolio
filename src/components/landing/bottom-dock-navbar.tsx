import { useState, useEffect } from "react";
import MacOSDock, { type DockApp } from "@/components/ui/mac-os-dock";
import { 
  User, 
  Cpu, 
  Award, 
  FolderGit2, 
  Briefcase, 
  MessageSquareQuote, 
  Send 
} from "lucide-react";
import logoImg from "@/assets/logo.jpg";

export function BottomDockNavbar() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sectionIds = ["hero", "about", "skills", "certificates", "projects", "experience", "testimonials", "contact"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dockApps: DockApp[] = [
    {
      id: "hero",
      name: "Raditya.tech",
      icon: (
        <img
          src={logoImg}
          alt="Logo"
          className="size-full rounded-xl object-cover"
        />
      ),
      href: "#hero",
    },
    {
      id: "about",
      name: "Tentang Saya",
      icon: <User className="size-5 text-sky-400" />,
      href: "#about",
    },
    {
      id: "skills",
      name: "Tech Stack",
      icon: <Cpu className="size-5 text-indigo-400" />,
      href: "#skills",
    },
    {
      id: "certificates",
      name: "Sertifikasi",
      icon: <Award className="size-5 text-amber-400" />,
      href: "#certificates",
    },
    {
      id: "projects",
      name: "Proyek",
      icon: <FolderGit2 className="size-5 text-emerald-400" />,
      href: "#projects",
    },
    {
      id: "experience",
      name: "Jejak Karir",
      icon: <Briefcase className="size-5 text-cyan-400" />,
      href: "#experience",
    },
    {
      id: "testimonials",
      name: "Testimoni",
      icon: <MessageSquareQuote className="size-5 text-rose-400" />,
      href: "#testimonials",
    },
    {
      id: "contact",
      name: "Hubungi",
      icon: <Send className="size-5 text-purple-400" />,
      href: "#contact",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto">
      <MacOSDock
        apps={dockApps}
        activeApp={activeSection}
        onAppClick={(id) => setActiveSection(id)}
      />
    </div>
  );
}

export default BottomDockNavbar;
