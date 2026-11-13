# 🚀 Panduan Cepat Upload ke GitHub & Vercel
**MY LIFE — Personal Life Management System (Versi Final 1.0)**

Folder ini adalah **satu-satunya folder proyek versi final** yang bersih dari data demo dan siap diunggah ke repositori GitHub serta dideploy ke Vercel.

---

## 📌 Langkah 1: Upload ke GitHub

### Opsi A: Lewat Terminal (Paling Cepat)
1. Buka aplikasi **Terminal** di Mac Anda.
2. Masuk ke folder proyek ini:
   ```bash
   cd ~/Documents/MY-LIFE-APP
   ```
3. Buat repositori baru di [GitHub](https://github.com/new) (beri nama misalnya `my-life-app`, pilih tipe **Private**).
4. Hubungkan dan upload kode Anda dengan perintah berikut (ganti `<username>` dengan username GitHub Anda):
   ```bash
   git remote add origin https://github.com/<username>/my-life-app.git
   git push -u origin main
   ```

### Opsi B: Lewat GitHub Desktop
1. Buka aplikasi **GitHub Desktop**.
2. Pilih menu **File** > **Add Local Repository...**.
3. Pilih folder `~/Documents/MY-LIFE-APP`.
4. Klik **Publish repository** (pilih centang *Keep this code private* agar privat).

---

## 🌐 Langkah 2: Deploy ke Vercel (Gratis & Online 24/7)

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** > **"Project"**.
3. Di daftar repositori GitHub Anda, klik **"Import"** pada repositori `my-life-app`.
4. Pada bagian pengaturan proyek:
   - **Framework Preset:** Biarkan `Other` (karena konfigurasi `vercel.json` sudah tersedia otomatis di dalam proyek).
   - **Root Directory:** `./`
5. Klik **"Deploy"**.
6. Dalam hitungan 15 detik, aplikasi Anda sudah live dengan URL resmi (contoh: `https://my-life-app.vercel.app`) lengkap dengan HTTPS dan dukungan Progressive Web App (PWA) untuk iPhone/Android!

---

## 💾 Struktur Folder Proyek
- `index.html`: File antarmuka utama aplikasi web terpadu.
- `css/theme.css`: Styling Dark Cyber Luxury (hitam obsidian, border ungu & biru neon).
- `js/`: Script aplikasi, audio synthesizer, reactive store, dan komponen.
- `supabase/schema.sql`: Skema database PostgreSQL lengkap dengan Row Level Security.
- `manifest.webmanifest` & `sw.js`: PWA & Service Worker offline support.
- `vercel.json`: Konfigurasi resmi Vercel hosting.
- `Jalankan-Aplikasi.command`: Script klik ganda untuk membuka langsung di browser Mac.
