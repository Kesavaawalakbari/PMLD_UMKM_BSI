# BSI UMKM Centre - AI Coding Agent Guidelines

## Project Architecture

**BSI UMKM Centre Login System** - Modern vanilla HTML/CSS/JS implementation following exact Figma design specifications with Mask group.svg background pattern for Indonesian BSI bank UMKM branch.

### Core Structure
- **Split-screen layout**: 68:32 ratio (background pattern : login form)
- **Design system**: CSS custom properties in `:root` for brand consistency
- **Responsive grid**: Flexbox-based with mobile-first breakpoints (480px, 768px, 1024px)

### Key File Relationships
- `index.html` → `styles.css` → `script.js` (main login flow)
- `Logo BSI UMKM Centre.svg` → Referenced in navbar and background patterns
- `register.html`, `dashboard.html` → Additional pages sharing same design system

## Critical Design Patterns

### Brand Colors & Variables
```css
--color-primer: #00A39D    /* BSI Teal - primary interactions */
--color-sekunder: #F8AD3C  /* BSI Orange - secondary/highlights */
```
**Rule**: Always use CSS custom properties, never hardcoded colors except for Figma-specified button states.

### Button Implementation (Figma-Specific)
```css
/* Exact Figma specifications required */
width: 340px; height: 48px; padding: 14px 20px; gap: 10px;
border: 1px solid rgba(128, 128, 128, 0.5);
```
**Critical**: Login buttons MUST follow exact Figma hover states:
- Orange (#F8AD3C) → Light Orange (#FDECC8)
- Teal (#00A39D) → Light Teal (#C7FFF7)

### Logo Handling
- **Navbar logo**: External SVG file reference (`<img src="Logo BSI UMKM Centre.svg">`)
- **Main logo**: Official BSI UMKM Centre SVG positioned sesuai Figma design (`<img src="Logo BSI UMKM Centre.svg">`)
- **Logo positioning**: Absolute position (left: 198px, centered vertically) integrated dengan Break.svg background
- **Background patterns**: Mask group.svg with white background (#ffffff) as per Figma implementation  
- **Mask group.svg Integration**: Full-coverage background with proper masking and white base color
- **Never** use base64 encoding for main logo (performance)

## Development Workflows

### Testing Approach
```bash
# Local development (multiple methods)
start index.html                    # File protocol (simple)
python -m http.server 8000         # Python server
npx serve .                        # Node.js serve
# VS Code Live Server extension (recommended)
```

### Form Validation Pattern
```javascript
// Real-time validation with visual feedback
validateEmail(email) // → Border color changes + error states
validatePassword(password) // → Minimum 6 chars, visual indicators
```

## Project-Specific Conventions

### CSS Architecture
1. **Mobile-first responsive**: All breakpoints use `max-width`
2. **Mask group.svg Background**: Full-coverage pattern with white background (#ffffff) base
3. **CSS logical properties**: Use `margin-inline`, `padding-block` where applicable  
4. **Animation performance**: `transform` and `opacity` only for smooth animations
5. **Accessibility**: Always include `:focus-visible` states and `prefers-reduced-motion`

### Component Naming
- `.btn-{action}` for buttons (`btn-login`, `btn-register`)
- `.form-{element}` for form components (`form-input`, `form-label`)
- `.nav-{element}` for navigation (`nav-menu`, `nav-button`)

### Integration Points
- **Mock authentication**: Uses localStorage for session persistence
- **Multi-page flow**: index.html → dashboard.html (successful login)
- **Error handling**: Visual feedback via CSS classes (`.error`, `.success`)

## Critical Dependencies
- **Google Fonts**: Lato family (100,300,400,700,900 weights)
- **No external frameworks**: Vanilla implementation only
- **SVG assets**: All graphics are scalable vectors

## Performance Guidelines
- **CSS**: Use `will-change` sparingly, prefer `transform` for animations
- **JavaScript**: Event delegation for dynamic elements, debounced validation
- **Images**: SVG-first approach, optimize with SVGO for production

## Common Gotchas
- **Button hover states**: Must match exact Figma color specifications
- **Logo sizing**: Responsive scaling maintains aspect ratio via `height: auto`
- **Logo positioning**: Exact Figma coordinates (left: 198px) untuk desktop, responsive untuk mobile
- **Z-index layering**: Navbar (1000), logo (5), patterns (1), main content (10)
- **Form validation**: Indonesian language error messages required