# PANDUAN KOLABORASI PROJECT BSI UMKM CENTRE

## Informasi Repository

- **Link Repository:** https://github.com/Kesavaawalakbari/PMLD_UMKM_BSI
- **Branch Utama:** `integration/admin-merge`
- **Project:** BSI UMKM Centre - KONEK System

---

## LANGKAH 1: Persiapan (Install Software yang Dibutuhkan)

### 1.1 Install Git
1. Download Git dari https://git-scm.com/downloads
2. Install dengan pengaturan default (klik Next terus)
3. Setelah selesai, buka **Command Prompt** atau **PowerShell**
4. Ketik untuk verifikasi:
   ```
   git --version
   ```
   Jika muncul versi git, berarti berhasil

### 1.2 Install Node.js
1. Download Node.js dari https://nodejs.org/ (pilih versi LTS)
2. Install dengan pengaturan default
3. Verifikasi dengan:
   ```
   node --version
   npm --version
   ```

### 1.3 Install Visual Studio Code (Recommended)
1. Download dari https://code.visualstudio.com/
2. Install dengan pengaturan default
3. Buka VS Code

---

## LANGKAH 2: Clone Repository ke Laptop

### 2.1 Buka Terminal/Command Prompt
- Di Windows: Tekan `Win + R`, ketik `cmd`, tekan Enter
- Atau buka PowerShell

### 2.2 Pilih Folder untuk Menyimpan Project
```bash
cd D:\Projects
```
(Ganti `D:\Projects` dengan folder yang kamu inginkan)

### 2.3 Clone Repository
```bash
git clone https://github.com/Kesavaawalakbari/PMLD_UMKM_BSI.git
```

### 2.4 Masuk ke Folder Project
```bash
cd PMLD_UMKM_BSI
```

### 2.5 Pindah ke Branch yang Benar
```bash
git checkout integration/admin-merge
```

---

## LANGKAH 3: Install Dependencies

### 3.1 Install Dependencies Backend
```bash
cd backend
npm install
cd ..
```

### 3.2 Install Dependencies Admin Panel
```bash
cd admin
npm install
cd ..
```

### 3.3 Install Dependencies Frontend (jika ada)
```bash
cd frontend
npm install
cd ..
```

---

## LANGKAH 4: Buka Project di VS Code

```bash
code .
```

Atau buka VS Code manual, lalu:
1. Klik **File** > **Open Folder**
2. Pilih folder `PMLD_UMKM_BSI`

---

## LANGKAH 5: Menjalankan Project

### 5.1 Menjalankan Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend akan berjalan di `http://localhost:5000`

### 5.2 Menjalankan Admin Panel (Terminal 2)
Buka terminal baru di VS Code (`Ctrl + Shift + ~`)
```bash
cd admin
npm run dev
```
Admin panel akan berjalan di `http://localhost:5173`

### 5.3 Melihat Landing Page
Buka file `public/index.html` langsung di browser
Atau gunakan Live Server extension di VS Code

---

## LANGKAH 6: Cara Melakukan Edit/Revisi

### 6.1 Sebelum Mulai Edit, Tarik Update Terbaru
```bash
git pull origin integration/admin-merge
```

### 6.2 Buat Branch Baru untuk Revisi (Recommended)
```bash
git checkout -b revisi/nama-fitur
```
Contoh: `git checkout -b revisi/fix-footer`

### 6.3 Lakukan Edit pada File yang Diinginkan
Edit file menggunakan VS Code

### 6.4 Simpan Perubahan ke Git
```bash
git add .
git commit -m "deskripsi perubahan yang dilakukan"
```
Contoh: `git commit -m "fix: perbaiki tampilan footer mobile"`

### 6.5 Push ke GitHub
```bash
git push origin nama-branch-kamu
```
Contoh: `git push origin revisi/fix-footer`

---

## LANGKAH 7: Membuat Pull Request

1. Buka https://github.com/Kesavaawalakbari/PMLD_UMKM_BSI
2. Akan muncul notifikasi untuk membuat Pull Request
3. Klik **Compare & pull request**
4. Isi deskripsi perubahan yang dilakukan
5. Klik **Create pull request**
6. Tunggu review dan approval

---

## LANGKAH 8: Deployment ke Vercel

### 8.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 8.2 Login ke Vercel
```bash
vercel login
```
- Pilih metode login (GitHub/Email)
- Ikuti instruksi di browser

### 8.3 Deploy ke Production
Pastikan sudah di folder project utama (`PMLD_UMKM_BSI`):
```bash
vercel --prod
```

### 8.4 Verifikasi Deployment
- Setelah deploy selesai, akan muncul URL production
- Buka URL tersebut di browser untuk memastikan perubahan sudah live

### Catatan Penting:
- **Selalu commit dan push dulu** sebelum deploy
- Deploy hanya setelah perubahan sudah di-review/approve
- URL Production: https://pmld-umkm-bsi.vercel.app (atau sesuai konfigurasi)

---

## STRUKTUR PROJECT

```
PMLD_UMKM_BSI/
├── admin/              <- Admin Panel (React + TypeScript)
│   ├── components/     <- Komponen UI
│   ├── pages/          <- Halaman admin
│   ├── context/        <- State management
│   └── utils/          <- API utilities
│
├── backend/            <- Backend API (Express.js)
│   ├── controllers/    <- Logic API
│   ├── models/         <- Database models
│   ├── routes/         <- API endpoints
│   └── migrations/     <- Database schema
│
├── public/             <- Landing Page (HTML statis)
│   ├── index.html      <- Homepage
│   ├── login.html      <- Halaman login
│   ├── katalog.html    <- Katalog produk
│   └── assets/         <- Gambar & CSS
│
├── docs/               <- Dokumentasi
│   ├── API_LIST.txt    <- Daftar semua API
│   └── KONEK_IMPLEMENTATION_SUMMARY.md
│
└── frontend/           <- Frontend tambahan (jika ada)
```

---

## FILE PENTING YANG PERLU DIKETAHUI

| File | Fungsi |
|------|--------|
| `public/index.html` | Landing page utama |
| `public/login.html` | Halaman login |
| `admin/App.tsx` | Entry point admin panel |
| `admin/components/Sidebar.tsx` | Navigasi sidebar admin |
| `backend/server.js` | Entry point backend |
| `docs/API_LIST.txt` | Daftar semua API endpoint |

---

## DOKUMENTASI API

Lihat file `docs/API_LIST.txt` untuk daftar lengkap API endpoint.

---

## TROUBLESHOOTING

### Error: "npm not found"
- Pastikan Node.js sudah terinstall
- Restart terminal setelah install

### Error: "git not found"
- Pastikan Git sudah terinstall
- Restart terminal setelah install

### Error: Port sudah digunakan
- Matikan proses yang menggunakan port tersebut
- Atau ganti port di file konfigurasi

### Error saat npm install
```bash
npm cache clean --force
npm install
```

---

## KONTAK

Jika ada pertanyaan, hubungi tim melalui:
- Repository Issues: https://github.com/Kesavaawalakbari/PMLD_UMKM_BSI/issues

---

*Dokumen ini terakhir diupdate: 3 Desember 2025*
