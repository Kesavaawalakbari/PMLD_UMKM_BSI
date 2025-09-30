# BSI UMKM Centre Login Page - Server Configuration

## Local Development Server

### Option 1: Python HTTP Server (Recommended)
```bash
# Navigate to project directory
cd d:\bsiumkm

# Start Python server (Python 3)
python -m http.server 8000

# Start Python server (Python 2)
python -m SimpleHTTPServer 8000

# Access in browser
http://localhost:8000
```

### Option 2: Node.js Serve
```bash
# Install serve globally
npm install -g serve

# Navigate to project directory
cd d:\bsiumkm

# Start server
serve .

# Access in browser (usually http://localhost:5000)
```

### Option 3: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Production Deployment

### Static Hosting (Netlify/Vercel/GitHub Pages)
1. Upload all files to repository
2. Connect to hosting service
3. Deploy automatically
4. Configure custom domain if needed

### Apache Server Configuration
```apache
# .htaccess file for Apache
RewriteEngine On

# Redirect HTTP to HTTPS (if SSL enabled)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|ico)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

### Nginx Server Configuration
```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name bsi-umkm-centre.example.com;
    
    root /var/www/bsi-umkm-centre;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Handle SPA routing (if needed)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment Variables (for API integration)

Create `.env` file:
```env
# API Configuration
API_BASE_URL=https://api.bsi-umkm-centre.co.id
API_VERSION=v1
API_TIMEOUT=30000

# Authentication
JWT_SECRET=your-jwt-secret-key
SESSION_TIMEOUT=3600000

# Google Analytics (optional)
GA_TRACKING_ID=GA_MEASUREMENT_ID

# Error tracking (optional)
SENTRY_DSN=your-sentry-dsn

# Feature flags
ENABLE_REGISTRATION=true
ENABLE_FORGOT_PASSWORD=true
ENABLE_SOCIAL_LOGIN=false
```

## SSL Certificate Setup

### Let's Encrypt (Free SSL)
```bash
# Install certbot
sudo apt install certbot python3-certbot-apache

# Get certificate
sudo certbot --apache -d bsi-umkm-centre.example.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Performance Optimization

### Image Optimization
- Use WebP format for better compression
- Implement lazy loading for images
- Optimize SVG files

### CSS & JavaScript Optimization
- Minify CSS and JavaScript files
- Implement critical CSS inlining
- Use CSS Grid and Flexbox efficiently

### Font Loading Optimization
```html
<!-- Preload critical fonts -->
<link rel="preload" href="https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXiWtFCc.woff2" as="font" type="font/woff2" crossorigin>

<!-- Use font-display: swap for better performance -->
<style>
@font-face {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXiWtFCc.woff2') format('woff2');
}
</style>
```

## Security Considerations

### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    script-src 'self';
    img-src 'self' data: https:;
    connect-src 'self' https://api.bsi-umkm-centre.co.id;
">
```

### Input Validation & Sanitization
- Validate all form inputs on both client and server side
- Sanitize user inputs to prevent XSS attacks
- Use HTTPS for all communications
- Implement rate limiting for login attempts

## Monitoring & Analytics

### Performance Monitoring
```javascript
// Web Vitals tracking
function trackWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
            console.log('FCP:', entry.startTime);
        });
    }).observe({ entryTypes: ['paint'] });
    
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
}
```

### Error Tracking
```javascript
// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to error tracking service
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Send to error tracking service
});
```

## Testing Configuration

### Browser Testing
- Chrome DevTools for performance testing
- Firefox Developer Tools for accessibility testing
- Safari for iOS compatibility
- Edge for Windows compatibility

### Automated Testing (Optional)
```bash
# Install Playwright for browser testing
npm install @playwright/test

# Create test file: tests/login.spec.js
# Run tests
npx playwright test
```

## Backup & Version Control

### Git Configuration
```bash
# Initialize repository
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: BSI UMKM Centre Login Page"

# Add remote repository
git remote add origin https://github.com/bsi-umkm/login-page.git

# Push to repository
git push -u origin main
```

### Backup Strategy
1. Regular git commits and pushes
2. Database backups (if using backend)
3. Server configuration backups
4. SSL certificate backups

## Troubleshooting

### Common Issues
1. **CORS errors**: Configure server to allow cross-origin requests
2. **Font loading issues**: Check CSP and font preloading
3. **Mobile layout problems**: Test on real devices
4. **Performance issues**: Use browser DevTools to identify bottlenecks

### Debug Mode
Add `?debug=true` to URL for enhanced logging:
```javascript
const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
if (isDebugMode) {
    console.log('Debug mode enabled');
    // Additional debug logging
}
```