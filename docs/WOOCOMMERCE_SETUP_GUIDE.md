# WooCommerce Integration Configuration Guide
# BSI UMKM Centre

## Environment Variables Setup

### Frontend Configuration
Create a `.env` file in the frontend root directory:

```env
# WooCommerce Store URL
VITE_STORE_URL=https://umkmbsi.com

# WooCommerce REST API Credentials
# Generate these from WordPress Admin -> WooCommerce -> Settings -> Advanced -> REST API
VITE_WC_CONSUMER_KEY=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_WC_CONSUMER_SECRET=cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Optional: API Version (default: v3)
VITE_WC_API_VERSION=v3
VITE_WC_STORE_API_VERSION=v1
```

### Required WordPress Plugins

1. **WooCommerce** (latest version)
   - Core e-commerce functionality
   - Download: https://wordpress.org/plugins/woocommerce/

2. **JWT Authentication for WP-API**
   - Enables token-based authentication
   - Download: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
   - Configuration: Add to wp-config.php:
   ```php
   define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```

3. **WooCommerce REST API** (included in WooCommerce core)
   - Already included with WooCommerce
   - Enable in: WooCommerce -> Settings -> Advanced -> REST API

### CORS Configuration

Add to WordPress `.htaccess` or configure in Apache/Nginx:

#### Apache (.htaccess):
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
</IfModule>
```

#### Nginx:
```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
```

### Generate WooCommerce API Keys

1. Login to WordPress Admin
2. Navigate to: **WooCommerce → Settings → Advanced → REST API**
3. Click **Add Key**
4. Fill in:
   - Description: "BSI UMKM Centre Frontend"
   - User: Select admin user
   - Permissions: Read/Write
5. Click **Generate API Key**
6. **IMPORTANT**: Copy Consumer Key and Consumer Secret immediately
7. Add to `.env` file

### WordPress Configuration

Add to `wp-config.php`:

```php
// JWT Authentication Secret Key
define('JWT_AUTH_SECRET_KEY', 'your-super-secret-key-change-this');
define('JWT_AUTH_CORS_ENABLE', true);

// Enable CORS for REST API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

// WooCommerce Settings
define('WC_ADMIN_DISABLED', false); // Enable WooCommerce Admin
```

### Frontend Build Configuration

For development with Vite, create `vite.config.js`:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/wp-json': {
        target: process.env.VITE_STORE_URL,
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    'process.env': process.env
  }
});
```

### Testing API Connection

Use this test script (create `test-api.html`):

```html
<!DOCTYPE html>
<html>
<head>
    <title>API Connection Test</title>
</head>
<body>
    <h1>WooCommerce API Test</h1>
    <button onclick="testConnection()">Test Connection</button>
    <pre id="result"></pre>
    
    <script>
        async function testConnection() {
            const result = document.getElementById('result');
            result.textContent = 'Testing...';
            
            try {
                // Test Store API (public)
                const response = await fetch('https://umkmbsi.com/wp-json/wc/store/v1/products');
                const data = await response.json();
                result.textContent = JSON.stringify(data, null, 2);
                console.log('Success!', data);
            } catch (error) {
                result.textContent = 'Error: ' + error.message;
                console.error('Error:', error);
            }
        }
    </script>
</body>
</html>
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. Add `.env` to `.gitignore`:
   ```
   .env
   .env.local
   .env.production
   ```

3. **Use different keys for production and development**

4. **Rotate API keys regularly** (every 3-6 months)

5. **Use HTTPS only** in production

6. **Implement rate limiting** on WordPress server

### Deployment Checklist

- [ ] WordPress installed and configured
- [ ] WooCommerce plugin installed and activated
- [ ] JWT Authentication plugin installed and configured
- [ ] API keys generated
- [ ] CORS headers configured
- [ ] SSL certificate installed (HTTPS)
- [ ] Environment variables set in hosting
- [ ] Test API connections
- [ ] Create sample products in WooCommerce
- [ ] Configure payment gateways (Midtrans/Xendit)
- [ ] Set up shipping zones and methods
- [ ] Configure tax settings (if applicable)

### Troubleshooting

#### "CORS Error"
- Check CORS headers in WordPress
- Verify JWT_AUTH_CORS_ENABLE is true
- Clear browser cache

#### "401 Unauthorized"
- Verify API keys are correct
- Check user permissions
- Ensure JWT secret key is set

#### "404 Not Found"
- Verify WordPress permalinks are set to "Post name"
- Check WooCommerce REST API is enabled
- Ensure plugin versions are compatible

#### "Failed to fetch"
- Check STORE_URL is correct (no trailing slash)
- Verify WordPress site is accessible
- Check network/firewall settings

### Support Resources

- WooCommerce REST API Docs: https://woocommerce.github.io/woocommerce-rest-api-docs/
- JWT Authentication: https://github.com/Tmeister/wp-api-jwt-auth
- WordPress REST API: https://developer.wordpress.org/rest-api/
- BSI UMKM Centre Support: support@umkmbsi.com

---

**Last Updated**: January 2025  
**Version**: 1.0.0
