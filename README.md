# MY LIFE — Personal Life Management System

**MY LIFE** adalah aplikasi web pribadi terpadu untuk mengelola seluruh aspek kehidupan sehari-hari dalam satu antarmuka modern, aman, dan responsif. Dirancang dengan tema **Dark Cyber Luxury** (latar hitam pekat dengan aksen tepi menyala ungu muda & biru neon), sistem ini mendukung penuh zona waktu **Asia/Makassar (WITA, UTC+8)**.

---

## 🌟 Fitur Utama (15 Modul Sesuai PRD)

1. **Dashboard:**
   - Sapaan cerdas waktu (Pagi, Siang, Sore, Malam).
   - Jam digital real-time WITA dan tanggal Indonesia.
   - Ringkasan total saldo, pemasukan, pengeluaran, dan sisa anggaran.
   - Widget tugas kuliah prioritas tinggi dengan checkbox selesai.
   - Widget jadwal dan alarm terdekat dengan hitung mundur.
   - Checklist rutinitas dan habit hari ini.
   - Jadwal 4 waktu makan dan ringkasan progres target.
   - Tombol aksi cepat: `+ Transaksi`, `+ Tugas Kuliah`, `+ Pengingat`.

2. **Keuangan Pribadi:**
   - Pencatatan pemasukan, pengeluaran, dan anggaran bulanan.
   - Pos tabungan (*Savings Goals*) dengan target nominal dan tenggat waktu.
   - Filter transaksi berdasarkan jenis, kategori, dan pencarian kata kunci.
   - Tombol ekspor data transaksi ke file format CSV.

3. **Manajemen Kuliah:**
   - Pengelolaan daftar mata kuliah, SKS, dosen, ruang kelas, dan jadwal mingguan.
   - Manajemen tugas kuliah dengan tenggat waktu jam WITA, prioritas, status, catatan, dan link.
   - Jadwal ujian UTS / UAS.

4. **Kalender:**
   - Tampilan visual bulanan dengan penanda titik acara.
   - Daftar agenda terperinci dengan jam, lokasi, dan catatan.
   - Tambah, edit, dan hapus jadwal acara.

5. **Alarm & Pengingat (WITA):**
   - Live WITA Clock & Active Watcher otomatis.
   - 10 jadwal rutin harian bawaan sesuai PRD (Bangun tidur, Sarapan, Belajar, dll.).
   - Sintesis nada alarm melodi dengan Web Audio API tanpa butuh file MP3 eksternal.
   - Modal interaktif saat alarm berbunyi dengan tombol **Selesai** dan **Tunda (Snooze 10 Menit)**.

6. **Jadwal Makan & Minum:**
   - 4 Waktu makan: Sarapan (07:00), Makan Siang (12:00), Camilan Sore (15:00), Makan Malam (18:00).
   - Catatan kalori dan status sudah makan / belum.
   - Pelacak hidrasi air (*Water Intake*) dengan visual bar cairan dan tombol cepat (+250ml, +500ml).

7. **Rutinitas Harian & Habit Tracker:**
   - Pelacak kebiasaan dengan penghitung streak beruntun (🔥).
   - Checklist harian dan target hari mingguan.

8. **Kesehatan & Olahraga:**
   - Catatan berat badan terkini, target berat ideal, dan perhitungan BMI otomatis.
   - Log sesi workout (Gym, Jogging, Renang, dll.) beserta durasi dan kalori terbakar.

9. **Catatan Pribadi:**
   - Kategori: Kuliah, Ide & Proyek, Jurnal Harian, Pribadi.
   - Fitur sematkan catatan penting (Pinned 📌).

10. **Target & Impian:**
    - Kategori: Jangka Pendek (< 6 Bulan), Jangka Panjang (1 - 3 Tahun), Impian Masa Depan.
    - Bar progres visual (0% - 100%) dengan tombol cepat `+10%`.

11. **Daftar Belanja:**
    - Estimasi harga dan jumlah barang.
    - Tombol integrasi: **"Ke Finansial"** untuk langsung memindahkan belanjaan ke pengeluaran.

12. **Dokumen Pribadi:**
    - Brankas metadata dokumen (KTM, KTP, Sertifikat TOEFL, Kontrak Kost).
    - Status masa berlaku dan simulasi unduh file aman.

13. **Produktivitas & Pomodoro:**
    - Timer Pomodoro 3 mode: Fokus (25m), Istirahat Pendek (5m), Istirahat Panjang (15m).
    - Generator suara ambiens relaksasi (Suara Hujan & Pink Noise).

14. **Laporan & Analitik:**
    - Rekapitulasi finansial, kelulusan tugas, dan konsistensi rutinitas.
    - Dukungan cetak halaman / simpan sebagai PDF.

15. **Pengaturan & Keamanan:**
    - Profil pemilik akun (Nama, Panggilan, Kampus, Bio).
    - Kunci Master PIN 6-digit (Default: `123456`).
    - Izin notifikasi browser (*Web Push*).
    - Konfigurasi Supabase PostgreSQL Cloud Sync & unduh skema SQL.
    - Ekspor Cadangan Lengkap (.json) & Pulihkan Data.

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Klik Ganda Langsung (Mac)
Cukup klik ganda file **`Jalankan-Aplikasi.command`** pada folder aplikasi, dan browser Anda akan langsung membuka antarmuka aplikasi.

### Opsi 2: Buka File HTML Langsung
Klik ganda file **`index.html`** di browser Chrome, Safari, atau Firefox. Seluruh script dan vendor SDK sudah tersedia secara lokal (100% offline-ready).

### Opsi 3: Deploy ke Vercel (Produksi)
1. Unggah folder proyek ini ke repositori GitHub pribadi Anda.
2. Buka [Vercel](https://vercel.com) dan impor repositori.
3. Vercel akan otomatis mengenali konfigurasi `vercel.json` dan mempublikasikan aplikasi web Anda dalam hitungan detik.

---

## 🛡️ Database Supabase PostgreSQL
Skema SQL lengkap dengan aturan *Row Level Security (RLS)* dan indeks performa tersedia pada folder `supabase/schema.sql`. Anda dapat mengeksekusinya di Supabase SQL Editor untuk menghubungkan database cloud.
