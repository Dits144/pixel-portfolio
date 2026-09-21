# Pixel Portfolio

Buatkan saya website portfolio personal Fullstack Web Developer dengan kualitas premium/production-ready, fokus untuk memamerkan skill teknis dan proyek. Buat frontend saja (React + Tailwind), gunakan mock/dummy data dan simulasikan semua interaksi CRUD dan AI secara lokal (state/local storage), tanpa perlu koneksi backend nyata — nanti backend akan saya sambungkan sendiri lewat REST API.

1. Desain & Nuansa

Tema modern, clean, sedikit "techy" (bisa terinspirasi dark theme dengan aksen gradient neon/electric blue-purple), lengkap dengan dark/light mode toggle.

Smooth scroll animation, micro-interaction, hover effect elegan (gunakan framer-motion).

Fully responsive (mobile, tablet, desktop).

Typography modern (misal Inter/Space Grotesk), grid layout rapi.

2. Halaman Publik (Landing Page)

Hero Section — nama, jabatan ("Fullstack Web Developer"), tagline singkat, tombol CTA "Lihat Proyek" & "Download CV", animasi teks berganti (typing effect: "React", "Node.js", "Laravel", dst).

About Me — foto profil, deskripsi singkat, statistik (tahun pengalaman, jumlah proyek, jumlah klien) dalam bentuk counter animation.

Tech Stack / Skills — grid ikon teknologi (Frontend, Backend, Database, DevOps/Tools) dengan progress bar atau badge level (Beginner–Expert).

Featured Projects — grid/carousel kartu proyek: thumbnail, judul, deskripsi singkat, tech badges, tombol "Live Demo" & "GitHub", filter by category (Web App, Mobile, API, dst).

Experience / Career Timeline — timeline vertikal berisi riwayat pekerjaan/organisasi.

Testimonials — slider testimoni klien/rekan kerja dengan foto & rating bintang.

Blog/Articles (opsional) — grid artikel singkat (judul, ringkasan, tanggal).

Contact Section — form kontak (nama, email, pesan) + link sosial media (GitHub, LinkedIn, Instagram, WhatsApp), tampilkan toast notifikasi sukses saat submit (simulasi).

Footer — copyright, quick links, scroll-to-top button.

3. Admin Panel (Protected Route)

Buat halaman /login dan /admin (proteksi route sederhana, bisa pakai mock auth di localStorage — email/password hardcode dulu untuk simulasi).

Setelah login, tampilkan Admin Dashboard dengan sidebar navigasi berisi menu:

Dashboard — ringkasan statistik (jumlah proyek, pesan masuk, dsb) dalam card/chart.

Kelola Profil — form edit data hero/about (nama, tagline, foto, deskripsi, CV file upload UI).

Kelola Skills — CRUD (Create, Read, Update, Delete) daftar skill: nama, kategori, level/persentase, ikon.

Kelola Projects — CRUD proyek: judul, deskripsi, thumbnail, tech stack (multi-select tags), link demo, link GitHub, kategori, featured (toggle).

Kelola Experience — CRUD riwayat pekerjaan: posisi, perusahaan, periode, deskripsi.

Kelola Testimonials — CRUD testimoni: nama, jabatan, foto, isi testimoni, rating.

Pesan Masuk — tabel daftar pesan dari contact form (read/unread status, hapus).

Semua CRUD pakai modal/drawer form dengan validasi, dan tabel data dengan search + pagination.

Semua perubahan disimpan ke state global (Zustand/Context API) + localStorage agar tersimpan saat refresh (simulasi database), dengan struktur data yang rapi supaya gampang diganti ke fetch API asli nanti.

4. Fitur Khusus: AI Cover Letter Generator (di dalam Admin)

Tambahkan menu "Generate Surat Lamaran (AI)" di sidebar admin, berisi:

Form input: Nama Perusahaan, Posisi yang Dilamar, Deskripsi Pekerjaan/Job Desc (textarea), Tone (Formal / Semi-formal / Santai — dropdown), bahasa (Indonesia/English — toggle).

Tombol "Generate dengan AI" — untuk sekarang cukup buat fungsi stub/placeholder (misal generateCoverLetter(payload)) yang mensimulasikan loading (skeleton/spinner 2 detik) lalu menampilkan dummy hasil surat lamaran di text area hasil, siap untuk saya ganti dengan pemanggilan API backend asli nanti (beri komentar // TODO: connect to backend AI endpoint di kode).

Hasil generate ditampilkan di editor teks yang bisa diedit manual, dengan tombol Copy, Download sebagai PDF/DOCX (UI saja), dan Simpan ke Riwayat.

Tambahkan tab "Riwayat Surat Lamaran" — list surat yang pernah digenerate (mock data), bisa dilihat ulang/dihapus.

5. Struktur Teknis

React + TypeScript + TailwindCSS + shadcn/ui components.

Routing dengan React Router (/, /login, /admin, /admin/projects, dst).

State management global (Context API atau Zustand) untuk data portfolio & auth, dengan struktur folder rapi (/components, /pages, /store, /types, /mock-data) agar mudah saya sambungkan ke REST API backend nanti.

Buat file types.ts yang mendefinisikan interface/type untuk semua data (Project, Skill, Experience, Testimonial, Message, CoverLetter) agar kontrak datanya jelas untuk integrasi backend.

Semua fungsi CRUD & AI generate dipisahkan dalam layer "service" (misal services/projectService.ts) yang isinya masih pakai mock/localStorage, supaya nanti saya tinggal ganti isi fungsinya jadi fetch() ke API backend tanpa mengubah komponen UI.

Tolong buat step-by-step: mulai dari landing page dulu, lalu admin login & dashboard, lalu fitur CRUD, terakhir fitur AI Cover Letter Generator.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e79122ee-7227-4a49-ae9f-3f03620c8c5d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
