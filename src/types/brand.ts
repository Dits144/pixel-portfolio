export interface BrandItem {
  id: string;
  name: string;
  category: string;
  /** URL ke gambar logo (bisa https:// atau data: base64) */
  logoUrl: string;
  /** Apakah ditampilkan di marquee */
  active: boolean;
  /** Urutan tampil */
  sortOrder: number;
}
