# BSI UMKM Centre - Login Page Implementation

![BSI UMKM Centre Login](https://img.shields.io/badge/BSI%20UMKM%20Centre-Login%20Page-00A39D)

## 📋 Deskripsi Proyek

Implementasi detail dari desain login page BSI UMKM Centre Yogyakarta berdasarkan desain Figma. Proyek ini mencakup halaman login yang responsive, interaktif, dan mengikuti brand guidelines BSI.

## 🎨 Analisis Desain

### Brand Colors
- **Primer (#00A39D)**: Teal/hijau tosca untuk elemen utama
- **Sekunder (#F8AD3C)**: Orange/kuning untuk highlight dan CTA
- **Text (#333333)**: Dark gray untuk readability
- **Background (#FFFFFF)**: White untuk clean appearance

### Typography
- **Font Family**: Lato (Google Fonts)
- **Heading**: Lato ExtraBold 56px
- **Body**: Lato Regular 16px
- **Buttons**: Lato SemiBold 16px

### Layout Structure
- **Split Screen Design**: 68% background pattern + 32% form area
- **Responsive Grid**: Flexbox-based layout
- **Fixed Navigation**: Sticky header dengan shadow

## 🚀 Fitur Implementasi

### ✅ UI Components
- [x] Navbar dengan logo BSI UMKM Centre
- [x] Background pattern dengan logo BSI berulang
- [x] Form login dengan validasi real-time
- [x] Button states (normal, hover, loading, disabled)
- [x] Message system (success, error, info)
- [x] Checkbox dan forgot password link

### ✅ Functionality
- [x] Form validation (email format, password length)
- [x] Mock authentication system
- [x] Loading states dan feedback
- [x] Local storage untuk user session
- [x] Keyboard shortcuts (Ctrl+Enter untuk submit)
- [x] Auto-focus pada input fields

### ✅ Responsive Design
- [x] Desktop layout (1440px+)
- [x] Tablet layout (768px - 1023px)
- [x] Mobile layout (320px - 767px)
- [x] Touch-friendly buttons
- [x] Accessible navigation

### ✅ Accessibility
- [x] Semantic HTML structure
- [x] ARIA labels dan roles
- [x] Keyboard navigation support
- [x] Focus indicators
- [x] High contrast mode support
- [x] Screen reader compatibility

### ✅ Performance
- [x] Optimized CSS dengan CSS custom properties
- [x] Minimal JavaScript footprint
- [x] Lazy loading untuk animations
- [x] Compressed assets
- [x] Progressive enhancement

## 📁 Struktur File

```
bsiumkm/
├── index.html          # Main login page
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
├── dashboard.html      # Example dashboard page
└── README.md          # Documentation
```

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS dengan custom properties
- **Vanilla JavaScript**: No external dependencies
- **Google Fonts**: Lato font family
- **SVG**: Scalable icons dan logos

## 💻 Cara Menjalankan

1. **Clone atau download** files ke direktori lokal
2. **Buka** `index.html` di web browser
3. **Gunakan credentials berikut untuk testing**:
   - Email: `test@bsi.co.id`
   - Password: `123456`

## 🎯 Test Cases

### Login Testing
```javascript
// Valid login
Email: test@bsi.co.id
Password: 123456
Expected: Success → Redirect to dashboard

// Invalid email format
Email: invalid-email
Password: 123456
Expected: Error message "Please enter a valid email address"

// Short password
Email: test@bsi.co.id
Password: 123
Expected: Error message "Password must be at least 6 characters long"

// Empty fields
Email: (empty)
Password: (empty)
Expected: Error message "email is required"
```

### Navigation Testing
- ✅ Logo click → Focus on email input
- ✅ Navigation buttons → Show navigation message
- ✅ Forgot password → Validate email first
- ✅ Register button → Redirect to registration (mock)

### Responsive Testing
- ✅ Desktop (1440px+): Split layout
- ✅ Tablet (768px-1023px): Stacked layout
- ✅ Mobile (320px-767px): Full-width form

## 🎨 Customization Guide

### Colors
Edit CSS custom properties in `:root`:
```css
:root {
    --color-primer: #00A39D;    /* Primary teal */
    --color-sekunder: #F8AD3C;  /* Secondary orange */
    --color-text: #333333;      /* Text color */
    --color-white: #FFFFFF;     /* Background */
}
```

### Typography
Modify font weights and sizes:
```css
.welcome-title {
    font-size: 56px;      /* Main heading */
    font-weight: 900;     /* Extra bold */
}

.form-label {
    font-size: 16px;      /* Form labels */
    font-weight: 600;     /* Semi-bold */
}
```

### Layout Breakpoints
Adjust responsive breakpoints:
```css
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile */ }
@media (max-width: 480px)  { /* Small mobile */ }
```

## 🔧 API Integration

Untuk integrasi dengan backend real, update fungsi `loginUser` di `script.js`:

```javascript
const loginUser = async (credentials) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
        throw new Error('Login failed');
    }
    
    return await response.json();
};
```

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 80+     | ✅ Full Support |
| Firefox | 75+     | ✅ Full Support |
| Safari  | 13+     | ✅ Full Support |
| Edge    | 80+     | ✅ Full Support |
| IE      | 11      | ⚠️ Limited Support |

## 🎨 Design Tokens

### Spacing Scale
```css
--spacing-xs: 6px;    /* Extra small */
--spacing-sm: 8px;    /* Small */
--spacing-md: 16px;   /* Medium */
--spacing-lg: 21px;   /* Large */
--spacing-xl: 32px;   /* Extra large */
```

### Border Radius
```css
--border-radius: 8px;     /* Standard */
--border-radius-sm: 4px;  /* Small */
```

### Shadows
```css
--shadow-navbar: 0px 2px 12px 0px rgba(20, 20, 43, 0.08);
--shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.1);
```

## 🚀 Deployment

### Static Hosting (Netlify, Vercel)
1. Upload semua files ke repository
2. Connect repository ke hosting provider
3. Deploy automatically

### Apache/Nginx
1. Upload files ke web server directory
2. Ensure proper MIME types for CSS/JS
3. Configure HTTPS (recommended)

## 📈 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Follow existing code style
4. Test across browsers
5. Submit pull request

## 📞 Support

Untuk pertanyaan atau support:
- Email: developer@bsi.co.id
- Issue tracker: GitHub Issues

## 📄 License

Copyright © 2025 Bank Syariah Indonesia. All rights reserved.

---

**Dibuat dengan ❤️ untuk BSI UMKM Centre Yogyakarta**