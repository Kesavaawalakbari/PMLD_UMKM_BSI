# BSI UMKM Centre Backend - Setup Guide

## 📋 Prerequisites

Sebelum menjalankan backend, pastikan Anda sudah menginstall:

1. **Node.js** (v16 atau lebih tinggi)
   - Download dari: https://nodejs.org/
   - Verifikasi: `node --version` dan `npm --version`

2. **MongoDB** (Community Edition)
   - Download dari: https://www.mongodb.com/try/download/community
   - Atau gunakan MongoDB Atlas (cloud database)
   - Verifikasi: `mongod --version`

3. **Git** (optional, untuk version control)
   - Download dari: https://git-scm.com/

## 🚀 Cara Instalasi

### 1. Install Dependencies

```bash
cd backend
npm install
```

Dependencies yang akan terinstall:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-validator` - Input validation
- `validator` - Additional validators
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `nodemon` - Auto-restart (dev only)

### 2. Setup Environment Variables

File `.env` sudah dibuat dengan konfigurasi default:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bsi_umkm_centre
JWT_SECRET=bsi-umkm-centre-super-secret-key-change-in-production-2025
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://127.0.0.1:5500
CORS_ORIGIN=http://127.0.0.1:5500
```

**⚠️ PENTING:** Ubah `JWT_SECRET` di production!

### 3. Jalankan MongoDB

**Opsi A: Local MongoDB**
```bash
# Windows
mongod

# Mac/Linux
sudo mongod
```

**Opsi B: MongoDB Atlas (Cloud)**
1. Buat account di https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier)
3. Get connection string
4. Update `MONGODB_URI` di `.env`

### 4. Jalankan Server

**Development Mode (dengan auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di: `http://localhost:5000`

## 📝 Testing API

### Menggunakan Browser
Buka: `http://localhost:5000/api/health`

Response:
```json
{
  "success": true,
  "message": "BSI UMKM Centre API is running",
  "database": "Connected"
}
```

### Menggunakan Postman atau Thunder Client

**1. Register User**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "nama": "Test User",
  "password": "Test123",
  "confirmPassword": "Test123"
}
```

**2. Login User**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123"
}
```

**3. Get Profile (gunakan token dari response login)**
```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🗂️ Struktur Project

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── .env                 # Environment variables
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   └── auth.js             # JWT verification
├── models/
│   └── User.js             # User schema
├── routes/
│   └── authRoutes.js       # API routes
├── .env                    # Environment config
├── .env.example            # Example env file
├── package.json            # Dependencies
└── server.js              # Main server file
```

## 🔐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

Dokumentasi lengkap: `docs/api/auth.md`

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solusi:** Pastikan MongoDB sedang berjalan
```bash
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solusi:** Ubah PORT di `.env` atau kill process yang menggunakan port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### npm not found
```
npm : The term 'npm' is not recognized
```
**Solusi:** Install Node.js dari https://nodejs.org/

### JWT Token Error
```
Error: secretOrPrivateKey must have a value
```
**Solusi:** Pastikan `JWT_SECRET` sudah di-set di `.env`

## 🌐 Frontend Integration

Frontend sudah dikonfigurasi untuk connect ke backend:

- `frontend/src/utils/register.js` - Registrasi user
- `frontend/src/utils/script.js` - Login user

API URL: `http://localhost:5000/api`

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Support

Jika ada masalah atau pertanyaan:
1. Check dokumentasi API: `docs/api/auth.md`
2. Check logs di terminal
3. Check MongoDB connection
4. Verify environment variables

## 📄 License

Private - BSI UMKM Centre Project
