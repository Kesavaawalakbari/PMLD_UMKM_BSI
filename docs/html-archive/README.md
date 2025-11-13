# HTML Archive - Historical Reference

## Overview
This directory contains archived HTML file sets that were evaluated but not chosen for production deployment.

## Decision Summary (January 2025)

After systematic comparison of three HTML file sets, **ROOT LEVEL (6 files)** was chosen for production deployment.

### Comparison Results

| Set | File Count | Total Size | Status | Reason |
|-----|------------|------------|--------|--------|
| **ROOT LEVEL** ✅ | 6 files | 65.5 KB | **PRODUCTION** | Most comprehensive, fully tested, production-ready |
| public-react-style | 2 files | 9.7 KB | ARCHIVED | Incomplete prototype, text-only logo |
| original-static-pages | 4 files | 29 KB | ARCHIVED | Missing homepage, partial implementation |

## Archived Sets

### 1. public-react-style/
- **Source**: `frontend/public/`
- **Created**: November 13, 2025
- **Files**: index.html, login.html
- **Description**: NEW React-style pages with text-based logo
- **Why Archived**: Only 2 files, incomplete site, no homepage/katalog/FAQ

### 2. original-static-pages/
- **Source**: `frontend/src/pages/`
- **Created**: October 30, 2025
- **Files**: cart.html, index.html, products.html, register.html
- **Description**: ORIGINAL static files with image logo references
- **Why Archived**: Missing landing page, references non-existent SVG files

## Production Set (ROOT LEVEL)

**Location**: Root directory (*.html)

**Files**:
- `landingpage.html` (15.8 KB) - Main homepage with SEO, JavaScript
- `katalog.html` (14.4 KB) - Product catalog with filters
- `faq.html` (12.6 KB) - FAQ page with accordion
- `product-detail.html` (12.5 KB) - Product detail view
- `register.html` (5.9 KB) - Registration form
- `login.html` (4.2 KB) - Login form
- `index.html` (new) - Redirect to landingpage.html

**Why Chosen**:
✅ Complete 6-page site structure  
✅ Fully tested with Playwright MCP (all functionality working)  
✅ Professional implementation (351-line landing page with full SEO)  
✅ Proper asset integration (assets/css/, assets/images/)  
✅ JavaScript functionality (scrollToSection, navigation, accordions)  
✅ Production-ready quality with polished UI  

**Testing Status**: All pages validated October 30, 2025
- Navigation working across all pages
- Forms functional (login, register)
- FAQ accordion working
- Katalog filters initialized
- Product detail display working

## Deployment Configuration

**Vercel Config**: `vercel.json`
```json
{
  "rewrites": [
    { "source": "/", "destination": "/landingpage.html" },
    { "source": "/login", "destination": "/login.html" },
    { "source": "/register", "destination": "/register.html" },
    { "source": "/katalog", "destination": "/katalog.html" },
    { "source": "/product-detail", "destination": "/product-detail.html" },
    { "source": "/faq", "destination": "/faq.html" }
  ]
}
```

**Excluded from Deployment**: `.vercelignore`
- `frontend/` (entire directory, including these archived files)
- `backend/`, `docs/`, `tests/`, `scripts/`

## Restoration

If you need to restore archived files for reference:

```powershell
# View archived public-react-style files
Get-ChildItem docs/html-archive/public-react-style/

# View archived original-static-pages files
Get-ChildItem docs/html-archive/original-static-pages/
```

**Do NOT restore these to production without re-evaluation**.

---

**Archive Date**: January 13, 2025  
**Decision By**: AI Analysis + Playwright Testing  
**Production URL**: https://pmld-umkm-bsi-chi.vercel.app/
