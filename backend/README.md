# BSI UMKM Centre Backend - Setup Guide

## 📋 Tech Stack

- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth + Custom JWT
- **E-Commerce:** WooCommerce REST API
- **Backend:** Node.js + Express.js

## 📋 Prerequisites

Sebelum menjalankan backend, pastikan Anda sudah memiliki:

1. **Node.js** (v16 atau lebih tinggi)
   - Download dari: https://nodejs.org/
   - Verifikasi: `node --version` dan `npm --version`

2. **Supabase Account** (Free tier available)
   - Daftar di: https://supabase.com/
   - Buat project baru
   - Dapatkan API keys dari Settings → API

3. **WooCommerce Store** (untuk e-commerce)
   - WordPress dengan WooCommerce plugin
   - Generate REST API keys

## 🚀 Cara Instalasi

### 1. Install Dependencies

```bash
cd backend
npm install
```

Dependencies yang akan terinstall:
- `express` - Web framework
- `@supabase/supabase-js` - Supabase client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-validator` - Input validation
- `validator` - Additional validators
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `nodemon` - Auto-restart (dev only)

### 2. Setup Environment Variables

Copy `.env.example` ke `.env` dan isi dengan nilai Anda:

```bash
cp .env.example .env
```

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# WooCommerce (Optional)
WOOCOMMERCE_URL=https://your-store.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx

# CORS
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5500
```

### 3. Setup Supabase Database

1. Buka Supabase Dashboard
2. Go to SQL Editor
3. Run migration script:

```sql
-- Copy content from: backend/migrations/001_create_users_table.sql
```

Atau jalankan file migration langsung di SQL Editor.

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
  "database": {
    "type": "Supabase (PostgreSQL)",
    "status": "Connected"
  }
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
