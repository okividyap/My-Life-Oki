/**
 * ============================================================================
 * MY LIFE — Personal Life Management System (Versi Final 1.0)
 * File: config.js (Konfigurasi Utama Proyek)
 *
 * CARA MEMASUKKAN SUPABASE PROJECT URL & ANON KEY:
 * ----------------------------------------------------------------------------
 * 1. CARA 1 (Langsung di file ini):
 *    Isi variabel SUPABASE_URL dan SUPABASE_ANON_KEY di bawah ini.
 *    Contoh:
 *      SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co",
 *      SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *
 * 2. CARA 2 (Melalui Tampilan Web Browser / Tanpa Koding):
 *    - Buka aplikasi MY LIFE di Safari / Chrome.
 *    - Buka menu "Pengaturan" di sidebar / navigasi bawah.
 *    - Gulir ke bagian "Integrasi Database Supabase PostgreSQL".
 *    - Masukkan Supabase Project URL & Anon Key di kolom yang tersedia.
 *    - Klik tombol "Simpan & Uji Koneksi Cloud".
 *
 * CATATAN PENTING:
 * - Gunakan Anon / Public Key (bukan service_role secret key).
 * - Biarkan kosong jika ingin menggunakan mode offline (LocalStorage murni).
 * ============================================================================
 */

window.MY_LIFE_CONFIG = {
  // Masukkan Supabase Project URL Anda di sini (misal: "https://xxx.supabase.co")
  SUPABASE_URL: "",

  // Masukkan Supabase Anon Public Key Anda di sini
  SUPABASE_ANON_KEY: "",

  // Zona Waktu Default Sistem Operasional (WITA / UTC+8)
  DEFAULT_TIMEZONE: "Asia/Makassar",

  // Judul Aplikasi
  APP_TITLE: "MY LIFE"
};
