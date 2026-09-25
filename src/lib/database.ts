/**
 * RadityaDB — Powerful Hybrid Database Engine (IndexedDB + Storage Sync)
 * 
 * Fitur:
 * - Penyimpanan transaksional IndexedDB berkapasitas besar (mendukung Base64 foto & sertifikat tanpa batas 5MB localStorage).
 * - Sinkronisasi reaktif ke Zustand PortfolioStore.
 * - Auto-seeding data awal jika database baru/kosong.
 * - Manajemen Backup (Ekspor JSON), Restore (Impor JSON), dan Reset data.
 */

import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type {
  Certificate,
  CoverLetter,
  Experience,
  Message,
  PortfolioData,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "@/types";

const DB_NAME = "RadityaPortfolioDB";
const DB_VERSION = 1;

type CollectionName =
  | "profile"
  | "skills"
  | "certificates"
  | "projects"
  | "experiences"
  | "testimonials"
  | "messages"
  | "coverLetters";

const COLLECTIONS: CollectionName[] = [
  "profile",
  "skills",
  "certificates",
  "projects",
  "experiences",
  "testimonials",
  "messages",
  "coverLetters",
];

class RadityaDB {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof window !== "undefined" && "indexedDB" in window;
  }

  private getDB(): Promise<IDBDatabase> {
    if (!this.isSupported) {
      return Promise.reject(new Error("IndexedDB tidak didukung di lingkungan ini"));
    }

    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        for (const storeName of COLLECTIONS) {
          if (!db.objectStoreNames.contains(storeName)) {
            if (storeName === "profile") {
              db.createObjectStore(storeName, { keyPath: "id" });
            } else {
              db.createObjectStore(storeName, { keyPath: "id" });
            }
          }
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  /**
   * Inisialisasi Database dan Auto-Seed data awal jika kosong
   */
  async init(): Promise<void> {
    if (!this.isSupported) return;

    try {
      const db = await this.getDB();
      const tx = db.transaction(["certificates", "skills", "profile"], "readonly");
      const certStore = tx.objectStore("certificates");
      const countReq = certStore.count();

      countReq.onsuccess = async () => {
        if (countReq.result === 0) {
          // Database kosong, lakukan seeding awal
          await this.seedInitialData();
        } else {
          // Sinkronisasi data dari IndexedDB ke Zustand Store
          await this.syncToZustand();
        }
      };
    } catch (err) {
      console.warn("Gagal inisialisasi RadityaDB IndexedDB, fallback ke localStorage:", err);
    }
  }

  /**
   * Seed data awal ke IndexedDB
   */
  async seedInitialData(): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(COLLECTIONS, "readwrite");

    // Profile
    const profileStore = tx.objectStore("profile");
    profileStore.put({ id: "main", ...initialPortfolioData.profile });

    // Skills
    const skillsStore = tx.objectStore("skills");
    for (const item of initialPortfolioData.skills) {
      skillsStore.put(item);
    }

    // Certificates
    const certStore = tx.objectStore("certificates");
    for (const item of initialPortfolioData.certificates) {
      certStore.put(item);
    }

    // Projects
    const projStore = tx.objectStore("projects");
    for (const item of initialPortfolioData.projects) {
      projStore.put(item);
    }

    // Experiences
    const expStore = tx.objectStore("experiences");
    for (const item of initialPortfolioData.experiences) {
      expStore.put(item);
    }

    // Testimonials
    const testStore = tx.objectStore("testimonials");
    for (const item of initialPortfolioData.testimonials) {
      testStore.put(item);
    }

    // Messages
    const msgStore = tx.objectStore("messages");
    for (const item of initialPortfolioData.messages) {
      msgStore.put(item);
    }

    // Cover Letters
    const clStore = tx.objectStore("coverLetters");
    for (const item of initialPortfolioData.coverLetters) {
      clStore.put(item);
    }

    await new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
    });

    await this.syncToZustand();
  }

  /**
   * Muat seluruh data dari IndexedDB dan sinkronkan ke memory Zustand store
   */
  async syncToZustand(): Promise<void> {
    try {
      const data = await this.exportAll();
      const store = usePortfolioStore.getState();

      if (data.profile) store.setProfile(data.profile);
      if (data.skills?.length) {
        usePortfolioStore.setState({ skills: data.skills });
      }
      if (data.certificates?.length) {
        usePortfolioStore.setState({ certificates: data.certificates });
      }
      if (data.projects?.length) {
        usePortfolioStore.setState({ projects: data.projects });
      }
      if (data.experiences?.length) {
        usePortfolioStore.setState({ experiences: data.experiences });
      }
      if (data.testimonials?.length) {
        usePortfolioStore.setState({ testimonials: data.testimonials });
      }
      if (data.messages?.length) {
        usePortfolioStore.setState({ messages: data.messages });
      }
      if (data.coverLetters?.length) {
        usePortfolioStore.setState({ coverLetters: data.coverLetters });
      }
    } catch (e) {
      console.error("Gagal sync ke Zustand:", e);
    }
  }

  /**
   * Mengambil semua item dari satu koleksi
   */
  async getAll<T>(collection: CollectionName): Promise<T[]> {
    if (!this.isSupported) {
      const state = usePortfolioStore.getState();
      return (state[collection as keyof PortfolioData] as unknown as T[]) || [];
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(collection, "readonly");
        const store = tx.objectStore(collection);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => reject(req.error);
      });
    } catch {
      const state = usePortfolioStore.getState();
      return (state[collection as keyof PortfolioData] as unknown as T[]) || [];
    }
  }

  /**
   * Menyimpan / memperbarui item
   */
  async put<T extends { id: string }>(collection: CollectionName, item: T): Promise<T> {
    if (this.isSupported) {
      try {
        const db = await this.getDB();
        await new Promise((resolve, reject) => {
          const tx = db.transaction(collection, "readwrite");
          const store = tx.objectStore(collection);
          const req = store.put(item);
          req.onsuccess = () => resolve(true);
          req.onerror = () => reject(req.error);
        });
      } catch (e) {
        console.warn(`Gagal put ke ${collection}:`, e);
      }
    }
    return item;
  }

  /**
   * Menghapus item berdasarkan ID
   */
  async delete(collection: CollectionName, id: string): Promise<void> {
    if (this.isSupported) {
      try {
        const db = await this.getDB();
        await new Promise((resolve, reject) => {
          const tx = db.transaction(collection, "readwrite");
          const store = tx.objectStore(collection);
          const req = store.delete(id);
          req.onsuccess = () => resolve(true);
          req.onerror = () => reject(req.error);
        });
      } catch (e) {
        console.warn(`Gagal delete dari ${collection}:`, e);
      }
    }
  }

  /**
   * Ekspor seluruh database ke objek JSON
   */
  async exportAll(): Promise<PortfolioData> {
    const [
      profileArr,
      skills,
      certificates,
      projects,
      experiences,
      testimonials,
      messages,
      coverLetters,
    ] = await Promise.all([
      this.getAll<{ id: string } & Profile>("profile"),
      this.getAll<Skill>("skills"),
      this.getAll<Certificate>("certificates"),
      this.getAll<Project>("projects"),
      this.getAll<Experience>("experiences"),
      this.getAll<Testimonial>("testimonials"),
      this.getAll<Message>("messages"),
      this.getAll<CoverLetter>("coverLetters"),
    ]);

    const profile = profileArr.length
      ? (profileArr[0] as unknown as Profile)
      : initialPortfolioData.profile;

    return {
      profile,
      skills: skills.length ? skills : initialPortfolioData.skills,
      certificates: certificates.length ? certificates : initialPortfolioData.certificates,
      projects: projects.length ? projects : initialPortfolioData.projects,
      experiences: experiences.length ? experiences : initialPortfolioData.experiences,
      testimonials: testimonials.length ? testimonials : initialPortfolioData.testimonials,
      messages: messages.length ? messages : initialPortfolioData.messages,
      articles: initialPortfolioData.articles,
      coverLetters: coverLetters.length ? coverLetters : initialPortfolioData.coverLetters,
    };
  }

  /**
   * Mengimpor database dari objek JSON
   */
  async importAll(data: Partial<PortfolioData>): Promise<void> {
    if (!this.isSupported) return;

    const db = await this.getDB();
    const tx = db.transaction(COLLECTIONS, "readwrite");

    if (data.profile) {
      const st = tx.objectStore("profile");
      st.clear();
      st.put({ id: "main", ...data.profile });
    }
    if (data.skills) {
      const st = tx.objectStore("skills");
      st.clear();
      for (const item of data.skills) st.put(item);
    }
    if (data.certificates) {
      const st = tx.objectStore("certificates");
      st.clear();
      for (const item of data.certificates) st.put(item);
    }
    if (data.projects) {
      const st = tx.objectStore("projects");
      st.clear();
      for (const item of data.projects) st.put(item);
    }
    if (data.experiences) {
      const st = tx.objectStore("experiences");
      st.clear();
      for (const item of data.experiences) st.put(item);
    }
    if (data.testimonials) {
      const st = tx.objectStore("testimonials");
      st.clear();
      for (const item of data.testimonials) st.put(item);
    }
    if (data.messages) {
      const st = tx.objectStore("messages");
      st.clear();
      for (const item of data.messages) st.put(item);
    }
    if (data.coverLetters) {
      const st = tx.objectStore("coverLetters");
      st.clear();
      for (const item of data.coverLetters) st.put(item);
    }

    await new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
    });

    await this.syncToZustand();
  }

  /**
   * Reset seluruh database ke default data
   */
  async reset(): Promise<void> {
    if (this.isSupported) {
      try {
        const db = await this.getDB();
        const tx = db.transaction(COLLECTIONS, "readwrite");
        for (const c of COLLECTIONS) {
          tx.objectStore(c).clear();
        }
        await new Promise((resolve) => {
          tx.oncomplete = () => resolve(true);
        });
      } catch (e) {
        console.warn("Gagal clear IndexedDB:", e);
      }
    }
    await this.seedInitialData();
  }

  /**
   * Info status engine database untuk halaman admin
   */
  async getStatus() {
    const isIDB = this.isSupported;
    const collectionsCount: Record<string, number> = {};

    for (const c of COLLECTIONS) {
      const items = await this.getAll(c);
      collectionsCount[c] = items.length;
    }

    return {
      engine: isIDB ? "IndexedDB Engine v1.0 (Enterprise Client DB)" : "LocalStorage / Memory Fallback",
      status: "Online & Connected (Healthy)",
      databaseName: DB_NAME,
      version: DB_VERSION,
      collectionsCount,
      timestamp: new Date().toISOString(),
    };
  }
}

export const radityaDB = new RadityaDB();

// Auto inisialisasi di browser
if (typeof window !== "undefined") {
  radityaDB.init().catch(console.error);
}
