# 🏦 PMLD UMKM BSI - Platform Management System

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Backend](https://img.shields.io/badge/backend-complete-green.svg)]()
[![Frontend](https://img.shields.io/badge/frontend-in--progress-yellow.svg)]()
[![License](https://img.shields.io/badge/license-Private-red.svg)]()

Platform manajemen UMKM (Usaha Mikro, Kecil, dan Menengah) untuk BSI (Bank Syariah Indonesia) dengan sistem authentication lengkap dan database integration.

---

## 🎉 Latest Update (1 Oktober 2025)

### ✅ Backend Authentication System - COMPLETED

Backend authentication system telah selesai diimplementasikan dengan fitur lengkap:

- ✅ User Registration dengan validasi
- ✅ User Login dengan JWT token
- ✅ Password hashing dengan bcrypt
- ✅ Protected routes dengan middleware
- ✅ MongoDB database integration
- ✅ Complete API documentation
- ✅ Frontend integration (register.html & index.html)
- ✅ Error handling dalam Bahasa Indonesia

**📚 Dokumentasi Lengkap:**
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [SUMMARY.md](SUMMARY.md) - Ringkasan perubahan
- [CHANGELOG.md](CHANGELOG.md) - Detailed changelog (12,000+ lines)
- [backend/README.md](backend/README.md) - Backend setup guide
- [docs/api/auth.md](docs/api/auth.md) - API documentation

---

## 🚀 Quick Start

### Prerequisites
1. Node.js (v16+) - [Download](https://nodejs.org/)
2. MongoDB - [Download](https://www.mongodb.com/try/download/community) atau gunakan [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Kesavaawalakbari/PMLD_UMKM_BSI.git
cd PMLD_UMKM_BSI

# 2. Install backend dependencies
cd backend
npm install

# 3. Setup environment (sudah ada .env default)
# Atau copy dari .env.example jika perlu
cp .env.example .env

# 4. Jalankan MongoDB (jika local)
mongod

# 5. Jalankan backend server
npm run dev

# Server berjalan di http://localhost:5000
```

### Test Backend
```bash
# Browser
http://localhost:5000/api/health

# Expected response:
{
  "success": true,
  "message": "BSI UMKM Centre API is running",
  "database": "Connected"
}
```

### Run Frontend
```bash
# Buka dengan Live Server di VS Code
# Atau buka file langsung di browser:
frontend/src/pages/index.html (Login)
frontend/src/pages/register.html (Register)
```

---

## 📦 Tech Stack

### Backend
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcrypt.js, express-validator, CORS
- **Development:** nodemon

### Frontend
- **Language:** Vanilla JavaScript (ES6+)
- **API Client:** Fetch API
- **Storage:** LocalStorage

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ | Health check |
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/profile` | ✅ | Get profile |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| POST | `/api/auth/logout` | ✅ | Logout user |

**Auth Required (✅):** Perlu JWT token di header `Authorization: Bearer {token}`

📖 **Complete API Docs:** [docs/api/auth.md](docs/api/auth.md)

---

## 📁 Struktur Folder Proyek

Proyek ini menggunakan struktur folder yang terorganisir untuk memisahkan tanggung jawab antara tim Frontend, Backend, dan DevOps. Berikut adalah penjelasan detail setiap folder:

### 📁 Root Level
- **`.git/`**: Folder sistem Git untuk kontrol versi.
- **`.github/`**: Konfigurasi GitHub, termasuk instruksi untuk AI assistants dan workflows CI/CD.
- **`README.md`**: Dokumentasi utama proyek (file ini).

### 📁 `frontend/`
Folder untuk kode frontend 
- **`src/`**: Kode sumber utama frontend.
  - **`components/`**: Komponen UI yang dapat digunakan ulang (button, modal, form, dll.).
  - **`pages/`**: Komponen halaman lengkap (login, dashboard, landing page, dll.).
  - **`assets/`**: File statis seperti gambar, ikon, font, dan stylesheet.
  - **`utils/`**: Fungsi helper, konstanta, dan utilitas umum.

### 📁 `backend/`
Folder untuk kode backend (Node.js, Python, Java, dll.).
- **`controllers/`**: Handler logika bisnis untuk setiap endpoint API.
- **`models/`**: Definisi model data, schema database, dan validasi.
- **`routes/`**: Definisi rute API dan endpoint.
- **`middleware/`**: Middleware kustom untuk autentikasi, logging, error handling.
- **`config/`**: File konfigurasi aplikasi (database, environment variables, dll.).

### 📁 `docs/`
Dokumentasi proyek.
- **`api/`**: Dokumentasi API endpoints, contoh request/response.

### 📁 `scripts/`
Script otomasi dan utility.
- **`deploy/`**: Script untuk deployment dan provisioning infrastruktur.

### 📁 `tests/`
Test suite untuk memastikan kualitas kode.
- **`unit/`**: Test unit untuk fungsi individual.
- **`integration/`**: Test integrasi untuk interaksi antar komponen.

### 📋 Panduan Penggunaan Struktur Folder

**Untuk Tim Frontend:**
- Letakkan komponen baru di `frontend/src/components/`
- Halaman baru di `frontend/src/pages/`
- Asset statis di `frontend/src/assets/`

**Untuk Tim Backend:**
- Controller baru di `backend/controllers/`
- Model database di `backend/models/`
- Rute API di `backend/routes/`

**Untuk Tim DevOps:**
- Script deployment di `scripts/deploy/`
- Dokumentasi infrastruktur di `docs/`

Struktur ini memungkinkan tim bekerja paralel tanpa konflik, memudahkan maintenance, dan mendukung skalabilitas proyek UMKM BSI.

## Alur Kerja Kolaborasi Tim

### Gambaran Umum
Dokumen ini menguraikan bagaimana tim Backend (BE), Frontend (FE), dan DevOps berkolaborasi untuk mengintegrasikan perubahan melalui GitHub. Tujuannya adalah untuk memastikan pengembangan, pengujian, dan penerapan fitur yang lancar untuk proyek PMLD_UMKM_BSI, dengan fokus pada pengelolaan UMKM (usaha kecil menengah) dalam konteks BSI (Bank Syariah Indonesia).

### Prinsip Utama
- **Strategi Branching**: Gunakan Git Flow atau serupa dengan branch fitur, develop, dan main.
- **Pull Requests (PRs)**: Semua perubahan harus melalui PR untuk review.
- **Continuous Integration (CI)**: Tes dan build otomatis pada PR.
- **Komunikasi**: Sinkronisasi rutin dan penggunaan GitHub issues/projects untuk pelacakan.

### Langkah-Langkah Alur Kerja

1. **Perencanaan dan Pembuatan Issue**:
   - Buat issue GitHub untuk fitur baru, bug, atau tugas.
   - Tetapkan issue ke tim yang sesuai (BE, FE, DevOps).
   - Gunakan label untuk mengkategorikan (misalnya `backend`, `frontend`, `devops`, `integration`).

2. **Pengembangan Fitur**:
   - **Tim Backend**: Kembangkan endpoint API, perubahan database, dan logika bisnis pada branch fitur (misalnya `feature/be-user-auth`).
   - **Tim Frontend**: Implementasikan perubahan UI/UX, integrasikan dengan API BE pada branch fitur (misalnya `feature/fe-dashboard`).
   - **Tim DevOps**: Siapkan perubahan infrastruktur, pipeline CI/CD, atau skrip penerapan pada branch fitur (misalnya `feature/devops-ci-setup`).
   - Tim melakukan commit secara teratur dan push ke branch mereka.

3. **Review Kode dan Pull Requests**:
   - Buka PR yang menargetkan branch `develop` (atau `main` jika menggunakan trunk-based).
   - Minta review dari anggota tim lintas:
     - BE review FE untuk penggunaan API.
     - FE review BE untuk perubahan endpoint.
     - DevOps review semua untuk dampak penerapan.
   - Tanggapi umpan balik, selesaikan konflik, dan pastikan tes lulus.

4. **Integrasi dan Pengujian**:
   - Setelah disetujui, gabungkan PR ke `develop`.
   - Jalankan tes integrasi, tes end-to-end, dan penerapan staging.
   - DevOps menangani penerapan otomatis ke lingkungan staging.

5. **Rilis ke Produksi**:
   - Buat branch rilis dari `develop` untuk pengujian akhir.
   - Gabungkan ke `main` setelah persetujuan QA.
   - DevOps menerapkan ke produksi dengan rencana rollback.

6. **Pemantauan dan Umpan Balik**:
   - Pantau produksi untuk masalah.
   - Gunakan GitHub releases untuk versioning.
   - Rapat retrospektif untuk meningkatkan proses.

### Alat dan Praktik Terbaik
- **Kontrol Versi**: Git dengan GitHub.
- **CI/CD**: Gunakan GitHub Actions atau serupa untuk build, tes, dan penerapan otomatis.
- **Pengujian**: Tes unit untuk BE/FE, tes integrasi untuk fitur gabungan.
- **Dokumentasi**: Perbarui dokumen API, README, dan wiki sesuai kebutuhan.
- **Keamanan**: Pemindaian keamanan rutin, pembaruan dependensi.

### Saluran Komunikasi
- GitHub Issues/PRs untuk diskusi teknis.
- Slack/Teams untuk komunikasi harian.
- Standup mingguan untuk menyelaraskan tim.

Dengan mengikuti alur kerja ini, tim memastikan rilis terintegrasi berkualitas tinggi sambil meminimalkan konflik dan downtime.

## � Simulasi Sistem Pull Request

Berikut adalah simulasi lengkap bagaimana Pull Request bekerja dalam proyek ini, dari mulai coding hingga merge:

### 📋 Contoh Skenario: Tim FE Buat Fitur Login

#### **Tahap 1: Persiapan (Planning)**
```
Tim FE: "Kita perlu bikin halaman login untuk UMKM"
Product Owner: "Ok, prioritas tinggi"
→ Buat GitHub Issue: "Implementasi halaman login untuk UMKM"
→ Assign ke FE Developer
→ Label: frontend, high-priority
```

#### **Tahap 2: Development**
```bash
# 1. Checkout branch baru
git checkout -b fe/login

# 2. Coding fitur login
# Buat file: frontend/src/pages/LoginPage.jsx
# Buat komponen: frontend/src/components/LoginForm.jsx

# 3. Commit berkala
git add frontend/src/pages/LoginPage.jsx
git commit -m "feat: create login page component"

git add frontend/src/components/LoginForm.jsx  
git commit -m "feat: add login form with validation"

# 4. Push ke GitHub
git push -u origin fe/login
```

#### **Tahap 3: Buat Pull Request**
```
Di GitHub:
1. Pergi ke repository
2. Klik "Pull requests" → "New pull request"
3. Base branch: develop
4. Compare branch: fe/login
5. Title: "feat: implement login page for UMKM users"
6. Description:
   ```
   ## Changes
   - Added LoginPage component
   - Added LoginForm component with validation
   - Responsive design for mobile

   ## Testing
   - Unit tests for form validation
   - Manual testing on different browsers

   ## Screenshots
   [Attach screenshots]

   Closes #123
   ```

7. Klik "Create pull request"
```

#### **Tahap 4: CI/CD Otomatis Berjalan**
```
GitHub Actions akan otomatis:
✅ Checkout code
✅ Setup Node.js 18
✅ Install dependencies (npm ci)
✅ Run linting (npm run lint)
✅ Run tests (npm test)
✅ Build aplikasi (npm run build)

Jika semua pass: Status "✅ Checks passed"
Jika ada error: Status "❌ Checks failed" + laporan detail
```

#### **Tahap 5: Code Review**
```
Reviewer (BE Developer):
- Lihat perubahan di tab "Files changed"
- Comment: "API endpoint nya udah ready belum?"
- Request changes: "Tambah error handling untuk network error"

FE Developer:
- Tanggapi comment: "API endpoint /auth/login udah siap"
- Push perbaikan: "fix: add network error handling"
- CI/CD jalan lagi otomatis

Reviewer: ✅ Approve
```

#### **Tahap 6: Merge ke Develop**
```
Setelah approved:
1. Klik "Merge pull request"
2. Pilih "Squash and merge" 
3. Commit message: "feat: implement login page for UMKM users (#456)"
4. Delete branch fe/login
5. Branch otomatis terhapus dari remote
```

#### **Tahap 7: Deploy Staging (Otomatis)**
```
Karena merge ke develop:
- GitHub Actions deploy-staging job jalan
- Deploy ke staging environment
- QA Team test di staging
- Jika ok, siap release ke production
```

### 🎯 Status PR di GitHub

| Status | Icon | Meaning |
|--------|------|---------|
| 🟢 Open | Belum direview | |
| 🟡 Draft | Masih WIP | |
| 🔄 Review required | Menunggu review | |
| ✅ Approved | Siap merge | |
| ❌ Changes requested | Perlu perbaikan | |
| 🔒 Merged | Sudah digabung | |
| ❎ Closed | Ditutup tanpa merge | |

### 📊 CI/CD Status di PR

```
✅ All checks have passed
- test (pull_request) ✅ Successful
- lint (pull_request) ✅ Successful  
- build (pull_request) ✅ Successful
```

### 🚨 Jika CI/CD Gagal

```bash
# 1. Lihat laporan error di tab "Checks"
# 2. Klik "Details" untuk log lengkap
# 3. Perbaiki error lokal
# 4. Push perbaikan
# 5. CI/CD jalan otomatis lagi
```

### 💡 Best Practices PR

- **Judul jelas**: "feat/fix/docs: what changed"
- **Deskripsi detail**: Apa, mengapa, bagaimana test
- **Link issue**: "Closes #123"
- **Screenshot**: Untuk UI changes
- **Assignee**: Orang yang bertanggung jawab
- **Labels**: frontend, backend, bug, enhancement
- **Milestone**: Sprint atau version target

Dengan sistem PR + CI/CD ini, setiap perubahan ter-track, ter-test, dan ter-review sebelum masuk production! 🎉

## �📚 Panduan Langkah-demi-Langkah Git untuk Pemula

### 1. **Clone Repository** (Awal Proyek)
```bash
# Clone repo ke komputer lokal
git clone https://github.com/Kesavaawalakbari/PMLD_UMKM_BSI.git
cd PMLD_UMKM_BSI
```
**Gunanya**: Mendownload seluruh proyek dari GitHub ke komputer kamu untuk pertama kali.

---

### 2. **Buat Branch Baru** (Sebelum Mulai Coding)
```bash
# Cek branch saat ini
git branch
# Buat branch baru untuk fitur
git checkout -b feature/login-user-fe
```
**Gunanya**: Membuat "ruang kerja" terpisah agar tidak ganggu code orang lain. FE buat branch dengan akhiran `-fe`, BE dengan `-be`.

---

### 3. **Status & Perubahan** (Sebelum Save)
```bash
# Lihat file apa saja yang berubah
git status
# Lihat detail perubahan (baris yang ditambah/dihapus)
git diff
```
**Gunanya**: Mengecek pekerjaan yang sudah dilakukan sebelum menyimpannya.

---

### 4. **git add** (Stage Perubahan)
```bash
# Tambahkan SEMUA file yang berubah
git add .
# ATAU tambahkan file tertentu saja
git add index.html src/components/header.js
```
**Gunanya**: Memilih file-file mana yang akan "disimpan" dalam commit. Seperti memilih barang yang akan dimasukkan ke kotak.

---

### 5. **git commit** (Save Perubahan Lokal)
```bash
# Simpan perubahan dengan pesan deskriptif
git commit -m "feat: create login page UI with responsive design"
```
**Gunanya**: Menyimpan snapshot perubahan ke repository lokal. Pesan harus jelas menjelaskan **apa yang dilakukan** dan **mengapa**.

**Format pesan commit yang baik**:
- `feat:` untuk fitur baru
- `fix:` untuk perbaikan bug
- `docs:` untuk dokumentasi
- `style:` untuk formatting
- `refactor:` untuk refaktor code

---

### 6. **git pull** (Ambil Perubahan Terbaru)
```bash
# Sebelum push, selalu ambil perubahan terbaru
git pull origin develop
```
**Gunanya**: Mendownload perubahan terbaru dari repository agar code kamu sync dengan tim. **WAJIB dilakukan sebelum push** untuk menghindari konflik.

---

### 7. **git push** (Upload ke GitHub)
```bash
# Push branch pertama kali
git push -u origin feature/login-user-fe
# Push selanjutnya
git push
```
**Gunanya**: Mengupload perubahan dari komputer lokal ke GitHub agar bisa dilihat/direview tim.

---

## 🔄 Workflow Harian yang Aman

### **Setiap Hari Kerja:**
```bash
# 1. Pastikan kamu di branch yang benar
git branch

# 2. Simpan kerjaan yang belum selesai (opsional)
git add .
git commit -m "WIP: work in progress"

# 3. Pindah ke branch develop
git checkout develop

# 4. Ambil perubahan terbaru
git pull origin develop

# 5. Kembali ke branch feature
git checkout feature/login-user-fe

# 6. Update branch feature dengan perubahan terbaru
git merge develop
# atau
git rebase develop

# 7. Lanjut coding...
```

### **Setelah Selesai Fitur:**
```bash
# 1. Commit semua perubahan final
git add .
git commit -m "feat: complete login feature with validation"

# 2. Pull terakhir untuk pastikan tidak ada konflik
git pull origin develop

# 3. Push ke GitHub
git push

# 4. Buat Pull Request di GitHub
# 5. Minta review ke teman tim
# 6. Setelah disetujui, merge ke develop
```

## ⚠️ Tips Penting untuk FE/BE

### **Untuk Frontend Developer:**
```bash
# Kerja di branch terpisah untuk FE
git checkout -b feature/homepage-fe

# Hanya commit file FE yang relevan
git add src/components/ src/pages/ public/images/
git commit -m "feat: create homepage layout and components"
```

### **Untuk Backend Developer:**
```bash
# Kerja di branch terpisah untuk BE  
git checkout -b feature/auth-api-be

# Commit file BE yang relevan
git add controllers/ models/ routes/ middleware/
git commit -m "feat: add user authentication API"
```

## 🚨 Saat Terjadi Konflik

Jika `git pull` menunjukkan konflik:
```bash
# Buka file yang konflik, cari tanda:
<<<<<<< HEAD
# Code versi kamu
=======
# Code versi remote
>>>>>>> branch-name

# Edit manual: pilih mana yang dipertahankan
# Hapus tanda <<<<<<<, =======, >>>>>>>

# Setelah selesai:
git add nama_file.js
git commit -m "resolve merge conflict"
git push
```

## 📋 Checklist Sebelum Push
- [ ] `git status` - cek file yang berubah
- [ ] `git diff` - review perubahan
- [ ] `git pull origin develop` - update dengan kode terbaru
- [ ] Test code masih bekerja
- [ ] `git push` - upload ke GitHub

Dengan mengikuti langkah-langkah ini secara disiplin, tim FE dan BE bisa bekerja paralel tanpa takut menimpa pekerjaan masing-masing! 🚀
wokaii
