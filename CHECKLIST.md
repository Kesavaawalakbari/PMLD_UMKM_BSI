# ✅ CHECKLIST - Setup & Testing Backend BSI UMKM

**Last Updated:** 1 Oktober 2025

---

## 📋 Pre-Installation Checklist

### System Requirements
- [ ] Windows/Mac/Linux OS
- [ ] Terminal/Command Prompt access
- [ ] Internet connection (untuk download)
- [ ] Text editor (VS Code recommended)

---

## 🔧 Installation Checklist

### 1️⃣ Install Node.js
- [ ] Download Node.js LTS dari https://nodejs.org/
- [ ] Install Node.js (next, next, finish)
- [ ] Restart terminal/command prompt
- [ ] Verify installation:
  ```bash
  node --version
  # Expected: v16.x.x atau lebih tinggi
  
  npm --version
  # Expected: 8.x.x atau lebih tinggi
  ```
- [ ] Jika muncul "npm is not recognized", restart computer

### 2️⃣ Install MongoDB

**Option A - Local MongoDB (Recommended untuk Development):**
- [ ] Download MongoDB Community dari https://www.mongodb.com/try/download/community
- [ ] Install MongoDB (default settings OK)
- [ ] Tambahkan MongoDB ke PATH (biasanya otomatis)
- [ ] Verify installation:
  ```bash
  mongod --version
  # Expected: db version v6.x.x atau v7.x.x
  ```
- [ ] Create data directory (jika belum ada):
  ```bash
  # Windows
  md C:\data\db
  
  # Mac/Linux
  sudo mkdir -p /data/db
  sudo chown -R `id -un` /data/db
  ```

**Option B - MongoDB Atlas (Cloud, Gratis untuk 512MB):**
- [ ] Signup di https://www.mongodb.com/cloud/atlas
- [ ] Create free cluster (M0 Sandbox - Free)
- [ ] Create database user (username + password)
- [ ] Whitelist IP (0.0.0.0/0 untuk allow all - development only)
- [ ] Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
- [ ] Update `MONGODB_URI` di file `.env`

### 3️⃣ Install Git (Optional, untuk Version Control)
- [ ] Download dari https://git-scm.com/
- [ ] Install dengan default settings
- [ ] Verify:
  ```bash
  git --version
  # Expected: git version 2.x.x
  ```

---

## 📦 Backend Setup Checklist

### 1️⃣ Navigate to Backend Directory
```bash
cd backend
```
- [ ] Current directory sekarang: `.../PMLD_UMKM_BSI/backend`

### 2️⃣ Install Dependencies
```bash
npm install
```
- [ ] Wait sampai selesai (1-3 menit)
- [ ] Check folder `node_modules` muncul
- [ ] Check file `package-lock.json` muncul
- [ ] No error messages (warnings OK)

**Expected output:**
```
added 180 packages, and audited 181 packages in 45s
found 0 vulnerabilities
```

### 3️⃣ Verify Dependencies Installed
- [ ] Check `node_modules/express` exists
- [ ] Check `node_modules/mongoose` exists
- [ ] Check `node_modules/bcryptjs` exists
- [ ] Check `node_modules/jsonwebtoken` exists

### 4️⃣ Check Environment Configuration
- [ ] File `.env` ada di folder `backend/`
- [ ] Open `.env` dan verify:
  ```env
  PORT=5000 ✅
  NODE_ENV=development ✅
  MONGODB_URI=mongodb://localhost:27017/bsi_umkm_centre ✅
  JWT_SECRET=(ada value) ✅
  JWT_EXPIRES_IN=7d ✅
  FRONTEND_URL=http://127.0.0.1:5500 ✅
  ```
- [ ] Jika pakai MongoDB Atlas, update `MONGODB_URI` dengan connection string dari Atlas
- [ ] **PENTING:** Jangan commit file `.env` ke Git!

---

## 🚀 Running Backend Checklist

### 1️⃣ Start MongoDB (Jika Local)

**Terminal 1 (untuk MongoDB):**
```bash
mongod
```
- [ ] MongoDB service running
- [ ] Port 27017 listening
- [ ] Message: "Waiting for connections"
- [ ] **JANGAN TUTUP TERMINAL INI** (biarkan running)

**Troubleshooting:**
- Error "data directory not found"?
  ```bash
  # Windows
  md C:\data\db
  
  # Mac/Linux
  sudo mkdir -p /data/db
  ```
- Port 27017 already in use?
  ```bash
  # Windows
  netstat -ano | findstr :27017
  taskkill /PID <PID> /F
  ```

### 2️⃣ Start Backend Server

**Terminal 2 (untuk Backend Server):**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
═══════════════════════════════════════════════════════════
🚀 BSI UMKM Centre API Server
═══════════════════════════════════════════════════════════
📍 Server running on: http://localhost:5000
🌍 Environment: development
📅 Started at: 1 Oktober 2025, 14:30:00
═══════════════════════════════════════════════════════════

✅ MongoDB Connected: localhost
📦 Database: bsi_umkm_centre

Available endpoints:
  ✓ GET  http://localhost:5000/api/health
  ✓ POST http://localhost:5000/api/auth/register
  ✓ POST http://localhost:5000/api/auth/login
  ✓ GET  http://localhost:5000/api/auth/profile
```

**Checklist:**
- [ ] No error messages
- [ ] "MongoDB Connected" appears
- [ ] "Server running on: http://localhost:5000" appears
- [ ] All endpoints listed
- [ ] **JANGAN TUTUP TERMINAL INI** (biarkan running)

**Common Errors:**
- "MongoDB connection error"? → Check MongoDB running di Terminal 1
- "Port 5000 already in use"? → Change `PORT` di `.env` atau kill process
- "Cannot find module"? → Run `npm install` lagi

---

## 🧪 Testing Backend Checklist

### 1️⃣ Health Check Test (Browser)

**Browser:**
- [ ] Open browser (Chrome, Firefox, Edge)
- [ ] Navigate to: `http://localhost:5000/api/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "BSI UMKM Centre API is running",
  "timestamp": "2025-10-01T07:30:00.000Z",
  "environment": "development",
  "database": "Connected"
}
```

- [ ] `success: true` ✅
- [ ] `database: "Connected"` ✅

**If "database": "Disconnected":**
- MongoDB tidak running → Start MongoDB di Terminal 1
- Wrong `MONGODB_URI` di `.env` → Check connection string

### 2️⃣ Register Test (Postman/Thunder Client)

**Install Testing Tool (pilih salah satu):**
- [ ] Postman: https://www.postman.com/downloads/
- [ ] Thunder Client: VS Code extension (recommended)
- [ ] Insomnia: https://insomnia.rest/download

**Test Register:**
```
Method: POST
URL: http://localhost:5000/api/auth/register
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "test@example.com",
  "nama": "Test User",
  "password": "Test123",
  "confirmPassword": "Test123"
}
```

**Expected Response (Status 201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Selamat datang di BSI UMKM Centre.",
  "data": {
    "user": {
      "id": "66f1234567890abcdef12345",
      "email": "test@example.com",
      "nama": "Test User",
      "role": "user",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Checklist:**
- [ ] Status code: 201 Created
- [ ] `success: true`
- [ ] `user` object present
- [ ] `token` present (long string)
- [ ] Copy token untuk next test

**Test Duplicate Email (harus error):**
```
Same request as above
Expected: Status 400, "Email sudah terdaftar"
```
- [ ] Status code: 400
- [ ] Error message displayed

### 3️⃣ Login Test

**Test Login:**
```
Method: POST
URL: http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "test@example.com",
  "password": "Test123"
}
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "message": "Login berhasil! Selamat datang kembali.",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Checklist:**
- [ ] Status code: 200 OK
- [ ] `success: true`
- [ ] Token received
- [ ] Copy token untuk next test

**Test Wrong Password (harus error):**
```
Same request, tapi password: "WrongPassword"
Expected: Status 401, "Email atau password salah"
```
- [ ] Status code: 401
- [ ] Error message displayed

### 4️⃣ Get Profile Test (Protected Route)

**Test Get Profile:**
```
Method: GET
URL: http://localhost:5000/api/auth/profile
Headers:
  Content-Type: application/json
  Authorization: Bearer {paste_token_here}
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "66f1234567890abcdef12345",
      "email": "test@example.com",
      "nama": "Test User",
      "role": "user"
    }
  }
}
```

**Checklist:**
- [ ] Status code: 200 OK
- [ ] User data displayed
- [ ] Password NOT in response (security ✅)

**Test Without Token (harus error):**
```
Same request, tapi TIDAK ada Authorization header
Expected: Status 401, "Anda belum login"
```
- [ ] Status code: 401
- [ ] Error message displayed

**Test With Invalid Token (harus error):**
```
Authorization: Bearer invalidtoken123
Expected: Status 401, "Token tidak valid"
```
- [ ] Status code: 401
- [ ] Error message displayed

### 5️⃣ Update Profile Test

**Test Update Profile:**
```
Method: PUT
URL: http://localhost:5000/api/auth/profile
Headers:
  Content-Type: application/json
  Authorization: Bearer {paste_token_here}
Body (JSON):
{
  "nama": "Updated Name"
}
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "message": "Profile berhasil diupdate",
  "data": {
    "user": {
      "nama": "Updated Name",
      ...
    }
  }
}
```

**Checklist:**
- [ ] Status code: 200 OK
- [ ] Nama berhasil diupdate
- [ ] New name displayed

---

## 🌐 Frontend Integration Checklist

### 1️⃣ Setup Live Server (VS Code)

- [ ] Install "Live Server" extension di VS Code
- [ ] Klik kanan `frontend/src/pages/index.html`
- [ ] Select "Open with Live Server"
- [ ] Browser akan open di `http://127.0.0.1:5500` atau `http://localhost:5500`

**Verify:**
- [ ] Login page tampil
- [ ] No console errors (F12 → Console tab)

### 2️⃣ Test Register Flow

**Steps:**
1. [ ] Navigate to `register.html` (atau klik link "Daftar sekarang" di login page)
2. [ ] Fill form:
   - Email: `newuser@test.com`
   - Nama: `New User`
   - Password: `Test123`
   - Confirm Password: `Test123`
3. [ ] Click "Daftar sekarang"
4. [ ] Wait for response

**Expected Result:**
- [ ] Success message: "Registrasi berhasil!"
- [ ] Redirect to `index.html` (login page) after 2 seconds
- [ ] Check browser console (F12): no errors
- [ ] Check localStorage (F12 → Application → Local Storage):
  - `bsi_token` exists ✅
  - `bsi_user` exists ✅

**Terminal Check:**
- [ ] Backend terminal shows: `✅ New user registered: newuser@test.com`

### 3️⃣ Test Login Flow

**Steps:**
1. [ ] On `index.html` (login page)
2. [ ] Fill form:
   - Email: `newuser@test.com`
   - Password: `Test123`
3. [ ] Click "Login sekarang!"
4. [ ] Wait for response

**Expected Result:**
- [ ] Success message: "Login berhasil!"
- [ ] Token stored in localStorage
- [ ] Redirect to `dashboard.html` (atau show alert jika dashboard belum ada)

**Terminal Check:**
- [ ] Backend terminal shows: `✅ User logged in: newuser@test.com`

### 4️⃣ Check Database (MongoDB)

**Option A - Compass (GUI):**
- [ ] Download MongoDB Compass: https://www.mongodb.com/products/compass
- [ ] Connect to `mongodb://localhost:27017`
- [ ] Database `bsi_umkm_centre` exists
- [ ] Collection `users` exists
- [ ] User documents present
- [ ] Password is HASHED (not plain text) ✅

**Option B - Mongo Shell:**
```bash
mongosh
use bsi_umkm_centre
db.users.find().pretty()
```
- [ ] Users displayed
- [ ] Email matches registered email
- [ ] Password is hashed

---

## 🐛 Troubleshooting Checklist

### Backend Won't Start
- [ ] MongoDB running? → Check Terminal 1
- [ ] Port 5000 free? → Check `netstat -ano | findstr :5000`
- [ ] Dependencies installed? → Run `npm install`
- [ ] .env file exists? → Check `backend/.env`
- [ ] Node.js installed? → Check `node --version`

### Can't Connect to MongoDB
- [ ] MongoDB service running?
- [ ] Correct URI in `.env`?
- [ ] Network connection OK?
- [ ] Firewall blocking port 27017?

### Frontend Not Connecting to Backend
- [ ] Backend server running?
- [ ] CORS settings correct in `.env`?
- [ ] Frontend URL matches `FRONTEND_URL` in `.env`?
- [ ] Check browser console for errors (F12)

### JWT Token Issues
- [ ] Token exists in localStorage?
- [ ] Token not expired? (7 days default)
- [ ] JWT_SECRET set in `.env`?
- [ ] Authorization header format: `Bearer {token}`

### Registration/Login Errors
- [ ] Email format valid?
- [ ] Password min 6 characters?
- [ ] All fields filled?
- [ ] Network connection OK?
- [ ] Check backend terminal for error logs

---

## ✅ Final Verification Checklist

### Backend
- [ ] ✅ Server starts without errors
- [ ] ✅ MongoDB connected
- [ ] ✅ Health check returns success
- [ ] ✅ Register endpoint works
- [ ] ✅ Login endpoint works
- [ ] ✅ Get profile endpoint works (with token)
- [ ] ✅ Update profile endpoint works (with token)
- [ ] ✅ Password is hashed in database
- [ ] ✅ JWT token generated correctly
- [ ] ✅ Protected routes require token

### Frontend
- [ ] ✅ Register page loads
- [ ] ✅ Register form validates inputs
- [ ] ✅ Register successfully creates user
- [ ] ✅ Token stored in localStorage after register
- [ ] ✅ Login page loads
- [ ] ✅ Login form validates inputs
- [ ] ✅ Login successfully authenticates user
- [ ] ✅ Token stored in localStorage after login
- [ ] ✅ No console errors

### Database
- [ ] ✅ Database `bsi_umkm_centre` created
- [ ] ✅ Collection `users` created
- [ ] ✅ User documents have correct schema
- [ ] ✅ Passwords are hashed (not plain text)
- [ ] ✅ Email uniqueness enforced
- [ ] ✅ Timestamps (createdAt, updatedAt) present

### Security
- [ ] ✅ Passwords hashed with bcrypt
- [ ] ✅ JWT token has expiration
- [ ] ✅ Protected routes require authentication
- [ ] ✅ Input validation working
- [ ] ✅ CORS configured correctly
- [ ] ✅ .env file not committed to Git

---

## 🎉 Success Criteria

**All systems GO when:**
- ✅ Backend server running
- ✅ MongoDB connected
- ✅ All API endpoints working
- ✅ Frontend can register users
- ✅ Frontend can login users
- ✅ Tokens generated and stored
- ✅ Database has user records
- ✅ No console errors
- ✅ No server errors

---

## 📚 Next Steps After Setup

1. [ ] Read API documentation: `docs/api/auth.md`
2. [ ] Explore code structure
3. [ ] Try adding new features
4. [ ] Deploy to production (after production checklist)
5. [ ] Add more endpoints (products, transactions, etc.)

---

## 🆘 Need Help?

**Documentation:**
- Quick Start: `QUICKSTART.md`
- Summary: `SUMMARY.md`
- Detailed Changelog: `CHANGELOG.md`
- Backend Guide: `backend/README.md`
- API Docs: `docs/api/auth.md`

**Common Issues:**
- Check troubleshooting section above
- Check backend terminal for error logs
- Check browser console for frontend errors
- Verify all prerequisites installed

---

**Status:** ✅ Ready for Development  
**Last Verified:** 1 Oktober 2025

_Happy Coding! 🚀_
