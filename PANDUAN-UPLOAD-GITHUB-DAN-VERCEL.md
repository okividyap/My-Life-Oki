# 🚀 Panduan Cepat Upload ke GitHub & Vercel
**MY LIFE — Personal Life Management System (Versi Final 1.0)**

Folder ini adalah **satu-satunya folder proyek versi final** yang bersih dari data demo dan siap diunggah ke repositori GitHub serta dideploy ke Vercel.

---

## ⚙️ Cara Memasukkan URL Supabase (Database Cloud)

Anda dapat memasukkan **Supabase Project URL** dan **Supabase Anon Key** dengan salah satu dari 2 cara mudah:

### 1. Cara 1: Lewat File `config.js` (Langsung di VS Code)
Buka file `config.js` (ada langsung di root folder proyek Anda di VS Code):
```javascript
window.MY_LIFE_CONFIG = {
  // Masukkan Supabase Project URL Anda di sini:
  SUPABASE_URL: "https://proyek-anda.supabase.co",

  // Masukkan Supabase Anon Public Key Anda di sini:
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  DEFAULT_TIMEZONE: "Asia/Makassar",
  APP_TITLE: "MY LIFE"
};
```
Simpan file (`Cmd + S`). Selesai!

### 2. Cara 2: Lewat Menu Pengaturan di Tampilan Web (Tanpa Buka Kode)
1. Buka aplikasi MY LIFE di Safari / Chrome.
2. Klik menu **Pengaturan** di sidebar sebelah kiri atau menu navigasi bawah.
3. Gulir ke bagian **Integrasi Database Supabase PostgreSQL**.
4. Tempel **Supabase Project URL** dan **Supabase Anon Public Key** di kolom yang tersedia.
5. Klik tombol **Simpan & Uji Koneksi Cloud**.

---

## 📌 Langkah 1: Upload ke GitHub

Repositori GitHub Anda sudah terhubung:
`https://github.com/okividyap/My-Life-Oki`

Untuk memperbarui commit atau mengunggah perubahan terbaru lewat Terminal:
```bash
cd ~/Documents/MY-LIFE-APP
git add .
git commit -m "feat: update config.js and clean data"
git push origin main
```

---

## 🌐 Langkah 2: Deploy ke Vercel (Gratis & Online 24/7)

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda (`okividyap`).
2. Klik tombol **"Add New..."** > **"Project"**.
3. Di daftar repositori GitHub Anda, klik **"Import"** pada repositori `my-life-app`.
4. Pada bagian pengaturan proyek:
   - **Framework Preset:** Biarkan `Other` (konfigurasi `vercel.json` sudah terpasang otomatis).
   - **Root Directory:** `./`
5. Klik tombol **"Deploy"**.
6. Dalam hitungan 15 detik, aplikasi Anda sudah live dengan URL resmi Vercel (contoh: `https://my-life-app.vercel.app`) lengkap dengan HTTPS dan dukungan Progressive Web App (PWA) untuk iPhone/Android!

---

## 💾 Struktur Folder Proyek
- `config.js`: File konfigurasi utama untuk mengisi Supabase URL & Anon Key.
- `index.html`: File antarmuka utama aplikasi web terpadu.
- `css/theme.css`: Styling Dark Cyber Luxury (hitam obsidian, border ungu & biru neon).
- `js/`: Script aplikasi, audio synthesizer, reactive store, config fallback, dan komponen.
- `supabase/schema.sql`: Skema database PostgreSQL lengkap dengan Row Level Security.
- `manifest.webmanifest` & `sw.js`: PWA & Service Worker offline support.
- `vercel.json`: Konfigurasi resmi Vercel hosting.
- `Jalankan-Aplikasi.command`: Script klik ganda untuk membuka langsung di browser Mac.
