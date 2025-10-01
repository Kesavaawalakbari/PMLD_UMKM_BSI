# BSI UMKM Centre - Quick Start Guide

## ✅ Semua Perubahan Backend Telah Selesai!

### 📦 Yang Sudah Dibuat:

#### **Backend Structure:**
```
backend/
├── config/
│   ├── database.js              ✅ MongoDB connection
│   └── .env                     ✅ Environment config
├── controllers/
│   └── authController.js        ✅ Register, Login, Profile
├── middleware/
│   └── auth.js                  ✅ JWT verification
├── models/
│   └── User.js                  ✅ User schema dengan bcrypt
├── routes/
│   └── authRoutes.js            ✅ API routes dengan validasi
├── server.js                    ✅ Main server
├── package.json                 ✅ Dependencies updated
├── README.md                    ✅ Setup documentation
└── .gitignore                   ✅ Git ignore
```

#### **Frontend Integration:**
```
frontend/src/utils/
├── register.js                  ✅ Connect ke API register
└── script.js                    ✅ Connect ke API login
```

#### **Documentation:**
```
docs/api/
├── auth.md                      ✅ API Documentation
└── BSI_UMKM_API.postman_collection.json  ✅ Postman collection
```

---

## 🚀 Cara Menjalankan (Step by Step)

### 1️⃣ Install Node.js
Jika belum punya Node.js:
- Download: https://nodejs.org/ (pilih LTS version)
- Install dan restart terminal
- Verifikasi: `node --version` dan `npm --version`

### 2️⃣ Install MongoDB
Pilih salah satu:

**Opsi A - Local MongoDB:**
- Download: https://www.mongodb.com/try/download/community
- Install dan jalankan: `mongod`

**Opsi B - MongoDB Atlas (Cloud/Free):**
- Signup: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update `MONGODB_URI` di `.env`

### 3️⃣ Install Dependencies
```bash
cd backend
npm install
```

### 4️⃣ Jalankan MongoDB (jika local)
```bash
# Terminal baru
mongod
```

### 5️⃣ Jalankan Backend Server
```bash
# Terminal baru
cd backend
npm run dev
```

Server akan berjalan di: **http://localhost:5000**

### 6️⃣ Test Backend API
Buka browser: **http://localhost:5000/api/health**

Atau gunakan Postman:
- Import: `docs/api/BSI_UMKM_API.postman_collection.json`
- Test semua endpoint

### 7️⃣ Jalankan Frontend
Gunakan Live Server di VS Code atau:
```bash
cd frontend
# Buka index.html dengan Live Server
```

---

## 🎯 Test Flow

### 1. Register User
- Buka `register.html`
- Isi form dan submit
- Token akan tersimpan di localStorage
- Redirect ke login page

### 2. Login User
- Buka `index.html`
- Login dengan email/password yang tadi didaftarkan
- Token akan tersimpan di localStorage
- Redirect ke dashboard (jika ada)

### 3. Test dengan Postman
```
1. POST /api/auth/register
   Body: { email, nama, password, confirmPassword }

2. POST /api/auth/login
   Body: { email, password }
   → Copy token dari response

3. GET /api/auth/profile
   Header: Authorization: Bearer {token}
```

---

## 📝 API Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | ❌ | Check server status |
| `/api/auth/register` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/auth/profile` | GET | ✅ | Get user profile |
| `/api/auth/profile` | PUT | ✅ | Update profile |
| `/api/auth/logout` | POST | ✅ | Logout user |

---

## 🔐 Features Implemented

✅ **User Authentication**
- Register dengan validasi email, nama, password
- Login dengan JWT token
- Password hashing dengan bcrypt (salt rounds: 12)
- Token expiration (7 days)

✅ **Security**
- JWT authentication
- Password validation (min 6 chars, kombinasi huruf & angka)
- Email validation
- CORS protection
- Input sanitization dengan express-validator

✅ **Database**
- MongoDB dengan Mongoose ODM
- User model dengan schema validation
- Unique email constraint
- Timestamps (createdAt, updatedAt)
- Last login tracking

✅ **Error Handling**
- Comprehensive error messages (Bahasa Indonesia)
- Validation error details
- Graceful error responses
- MongoDB error handling

✅ **API Features**
- RESTful API design
- JSON responses
- Middleware authentication
- Role-based access (prepared for future)
- Request logging (development mode)

---

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Bcrypt.js
- Express Validator
- CORS

**Frontend:**
- Vanilla JavaScript
- Fetch API
- LocalStorage for token

---

## 📚 Next Steps (Optional Enhancements)

1. **Email Verification**
   - Kirim email verification saat register
   - Verify email endpoint

2. **Password Reset**
   - Forgot password endpoint
   - Reset password dengan token

3. **Refresh Token**
   - Implement refresh token mechanism
   - Auto refresh expired tokens

4. **User Roles & Permissions**
   - Admin dashboard
   - Role-based middleware (sudah ada)

5. **Profile Picture**
   - Upload avatar
   - Image storage (multer)

6. **Activity Logging**
   - User activity tracker
   - Login history

7. **Rate Limiting**
   - Prevent brute force attacks
   - Express rate limit

8. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - API tests

---

## 🐛 Troubleshooting

### Server tidak bisa start
```
Error: Cannot find module 'express'
→ Jalankan: npm install
```

### MongoDB connection error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
→ Pastikan MongoDB running: mongod
```

### CORS error di frontend
```
Access-Control-Allow-Origin error
→ Check FRONTEND_URL di .env
→ Pastikan Live Server port sesuai (5500)
```

### JWT error
```
secretOrPrivateKey must have a value
→ Check JWT_SECRET di .env
```

---

## 📞 Support

Dokumentasi lengkap:
- Backend setup: `backend/README.md`
- API docs: `docs/api/auth.md`
- Postman collection: `docs/api/BSI_UMKM_API.postman_collection.json`

---

## 🎉 Selesai!

Backend sudah **100% siap** untuk:
✅ Handle register dari `register.html`
✅ Handle login dari `index.html`
✅ Protect routes dengan JWT
✅ Validasi input
✅ Error handling
✅ Database integration

**Happy Coding! 🚀**
