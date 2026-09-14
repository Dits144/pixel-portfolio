/**
 * Helper bersama untuk layer service.
 *
 * Saat ini semua service memakai data lokal (zustand + localStorage).
 * TODO: ganti isi fungsi di setiap service dengan fetch() ke REST API backend.
 * Contoh: const res = await fetch(`${API_BASE}/projects`); return res.json();
 */

export const API_BASE = "/api"; // TODO: ganti dengan base URL backend asli

/** Simulasi latency jaringan supaya loading state terasa realistis. */
export const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
