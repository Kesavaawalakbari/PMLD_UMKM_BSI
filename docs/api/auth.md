# BSI UMKM Centre - Authentication API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Health Check
Check if API is running and connected to database.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "BSI UMKM Centre API is running",
  "timestamp": "2025-10-01T12:00:00.000Z",
  "environment": "development",
  "database": "Connected"
}
```

---

### 2. Register User
Register a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "nama": "John Doe",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format, max 100 characters
- `nama`: Required, min 2 characters, max 100 characters, letters/spaces only
- `password`: Required, min 6 characters, max 50 characters, must contain combination of uppercase/lowercase/numbers
- `confirmPassword`: Required, must match password

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Selamat datang di BSI UMKM Centre.",
  "data": {
    "user": {
      "id": "66f1234567890abcdef12345",
      "email": "user@example.com",
      "nama": "John Doe",
      "role": "user",
      "isActive": true,
      "registeredAt": "2025-10-01T12:00:00.000Z",
      "lastLogin": "2025-10-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar. Silakan gunakan email lain atau login."
}
```

**Error Response (400 Validation Error):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Format email tidak valid"
    },
    {
      "field": "password",
      "message": "Password minimal 6 karakter"
    }
  ]
}
```

---

### 3. Login User
Authenticate user and get access token.

**Endpoint:** `POST /api/auth/login`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login berhasil! Selamat datang kembali.",
  "data": {
    "user": {
      "id": "66f1234567890abcdef12345",
      "email": "user@example.com",
      "nama": "John Doe",
      "role": "user",
      "isActive": true,
      "registeredAt": "2025-10-01T12:00:00.000Z",
      "lastLogin": "2025-10-01T12:05:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Email atau password salah. Silakan coba lagi."
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Akun Anda tidak aktif. Silakan hubungi administrator."
}
```

---

### 4. Get User Profile
Get current authenticated user profile.

**Endpoint:** `GET /api/auth/profile`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "66f1234567890abcdef12345",
      "email": "user@example.com",
      "nama": "John Doe",
      "role": "user",
      "isActive": true,
      "registeredAt": "2025-10-01T12:00:00.000Z",
      "lastLogin": "2025-10-01T12:05:00.000Z"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Anda belum login. Silakan login terlebih dahulu untuk mengakses resource ini."
}
```

**Error Response (401 Token Expired):**
```json
{
  "success": false,
  "message": "Token Anda sudah kadaluarsa. Silakan login kembali.",
  "expiredAt": "2025-10-08T12:00:00.000Z"
}
```

---

### 5. Update User Profile
Update current user profile information.

**Endpoint:** `PUT /api/auth/profile`

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "nama": "John Doe Updated"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile berhasil diupdate",
  "data": {
    "user": {
      "id": "66f1234567890abcdef12345",
      "email": "user@example.com",
      "nama": "John Doe Updated",
      "role": "user",
      "isActive": true,
      "registeredAt": "2025-10-01T12:00:00.000Z",
      "lastLogin": "2025-10-01T12:05:00.000Z"
    }
  }
}
```

---

### 6. Logout User
Logout current user (client should remove token).

**Endpoint:** `POST /api/auth/logout`

**Request Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

### Token Storage (Frontend)
Store the token in localStorage:

```javascript
// After successful login/register
localStorage.setItem('bsi_token', data.data.token);
localStorage.setItem('bsi_user', JSON.stringify(data.data.user));

// For authenticated requests
const token = localStorage.getItem('bsi_token');
fetch(API_URL, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// On logout
localStorage.removeItem('bsi_token');
localStorage.removeItem('bsi_user');
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation Error |
| 401 | Unauthorized - Invalid/Missing Token |
| 403 | Forbidden - Insufficient Permissions |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Example Usage with JavaScript Fetch

### Register
```javascript
const registerUser = async (email, nama, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        nama,
        password,
        confirmPassword: password
      })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('bsi_token', data.data.token);
      localStorage.setItem('bsi_user', JSON.stringify(data.data.user));
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
```

### Login
```javascript
const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('bsi_token', data.data.token);
      localStorage.setItem('bsi_user', JSON.stringify(data.data.user));
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

### Get Profile (Protected)
```javascript
const getProfile = async () => {
  try {
    const token = localStorage.getItem('bsi_token');
    
    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};
```

---

## Testing with Postman

### 1. Set Base URL
```
http://localhost:5000/api
```

### 2. Register User
- Method: `POST`
- URL: `/auth/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "nama": "Test User",
  "password": "Test123",
  "confirmPassword": "Test123"
}
```

### 3. Login User
- Method: `POST`
- URL: `/auth/login`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "Test123"
}
```

### 4. Get Profile (Copy token from login response)
- Method: `GET`
- URL: `/auth/profile`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {paste_your_token_here}`

---

## Notes

1. **Token Expiration**: Tokens expire after 7 days by default
2. **CORS**: Configured to allow requests from `http://127.0.0.1:5500` and `http://localhost:3000`
3. **Password Security**: Passwords are hashed with bcrypt (salt rounds: 12)
4. **MongoDB**: Ensure MongoDB is running on `mongodb://localhost:27017`

---

## Environment Variables

Make sure to set these in your `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bsi_umkm_centre
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://127.0.0.1:5500
CORS_ORIGIN=http://127.0.0.1:5500
```
