/**
 * BrandStore — persisted in localStorage via zustand.
 * Menyimpan daftar logo/brand yang tampil di marquee halaman depan.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { BrandItem } from "@/types/brand";

// Default initial brand/partner items (static defaults matching brand-marquee.tsx)
const defaultBrands: BrandItem[] = [
  { id: "br-1", name: "Direktorat Jenderal Pajak", category: "Data & IT Internship",   logoUrl: "", active: true, sortOrder: 1  },
  { id: "br-2", name: "BNSP Indonesia",            category: "Certified JNA",           logoUrl: "", active: true, sortOrder: 2  },
  { id: "br-3", name: "Kali Linux",                category: "Penetration Testing",     logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kali_Linux_2.0_wordmark.svg/240px-Kali_Linux_2.0_wordmark.svg.png", active: true, sortOrder: 3  },
  { id: "br-4", name: "Wireshark",                 category: "Network Forensics",       logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Wireshark_icon.svg/120px-Wireshark_icon.svg.png", active: true, sortOrder: 4  },
  { id: "br-5", name: "Burp Suite",                category: "Web Security",            logoUrl: "", active: true, sortOrder: 5  },
  { id: "br-6", name: "Cisco Systems",             category: "Routing & Switching",     logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/200px-Cisco_logo_blue_2016.svg.png", active: true, sortOrder: 6  },
  { id: "br-7", name: "MikroTik RouterOS",         category: "Bandwidth & Firewall",    logoUrl: "", active: true, sortOrder: 7  },
  { id: "br-8", name: "React & Next.js",           category: "Modern Fullstack",        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/120px-React-icon.svg.png", active: true, sortOrder: 8  },
  { id: "br-9", name: "PostgreSQL & Docker",       category: "Cloud & Database",        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/120px-Postgresql_elephant.svg.png", active: true, sortOrder: 9  },
  { id: "br-10", name: "OWASP Top 10",             category: "Security Compliance",     logoUrl: "", active: true, sortOrder: 10 },
  { id: "br-11", name: "STT Terpadu NF",           category: "Informatics Alma Mater",  logoUrl: "", active: true, sortOrder: 11 },
];

interface BrandState {
  brands: BrandItem[];
  addBrand: (item: BrandItem) => void;
  updateBrand: (id: string, patch: Partial<BrandItem>) => void;
  removeBrand: (id: string) => void;
  reorder: (ids: string[]) => void;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      brands: defaultBrands,

      addBrand: (item) =>
        set((s) => ({ brands: [...s.brands, item] })),

      updateBrand: (id, patch) =>
        set((s) => ({
          brands: s.brands.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),

      removeBrand: (id) =>
        set((s) => ({ brands: s.brands.filter((b) => b.id !== id) })),

      reorder: (ids) =>
        set((s) => {
          const map = new Map(s.brands.map((b) => [b.id, b]));
          return {
            brands: ids
              .map((id, i) => {
                const b = map.get(id);
                return b ? { ...b, sortOrder: i + 1 } : null;
              })
              .filter(Boolean) as BrandItem[],
          };
        }),
    }),
    {
      name: "portfolio-brands-v1",
    }
  )
);
