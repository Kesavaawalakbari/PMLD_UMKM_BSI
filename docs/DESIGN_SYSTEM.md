# BSI UMKM Center - Design System Documentation

> Last Updated: November 4, 2025
> Based on Figma Design: CEkrskj1KeNmhHfC6Wro42 (Node 891:2689)

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-teal: #00A39D;        /* Main brand color - buttons, links, highlights */
--primary-teal-dark: #008E84;   /* Hover states, active elements */
--secondary-orange: #F8AD3C;    /* Accent color - highlights, CTAs */
--secondary-orange-light: #F9BD50; /* Secondary accent */
```

### Status Colors
```css
--success: #04C8BC;             /* Success messages, positive indicators */
--warning: #F9BD50;             /* Warning states */
--error: #E74C3C;               /* Error states */
--info: #3498DB;                /* Info messages */
```

### Neutral Colors
```css
--white: #FFFFFF;
--black: #222222;
--gray-50: #F8F9FA;             /* Backgrounds */
--gray-100: #E9ECEF;            /* Borders, dividers */
--gray-200: #DEE2E6;
--gray-300: #CED4DA;
--gray-400: #ADB5BD;
--gray-500: #6C757D;            /* Secondary text */
--gray-600: #495057;
--gray-700: #343A40;
--gray-800: #212529;
--gray-900: #0F1419;
```

### Text Colors
```css
--text-primary: #2C3E50;        /* Headings, important text */
--text-secondary: #7F8C8D;      /* Body text, descriptions */
--text-muted: #6C757D;          /* Less important text */
--text-light: #95A5A6;          /* Placeholder, disabled */
```

### Background Colors
```css
--bg-primary: #FFFFFF;
--bg-secondary: #F8F9FA;
--bg-tertiary: #E8F4F3;
--bg-teal-light: #EFFEFC;
```

---

## 📝 Typography

### Font Family
```css
--font-family-primary: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: 'Monaco', 'Courier New', monospace;
```

### Font Sizes
```css
--font-size-xs: 12px;           /* Small labels, captions */
--font-size-sm: 14px;           /* Body text, form inputs */
--font-size-base: 16px;         /* Default body text */
--font-size-lg: 18px;           /* Large body text */
--font-size-xl: 20px;           /* Small headings */
--font-size-2xl: 24px;          /* Subheadings */
--font-size-3xl: 32px;          /* Page headings */
--font-size-4xl: 48px;          /* Hero headings */
--font-size-5xl: 54px;          /* Large hero text */
```

### Font Weights
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Line Heights
```css
--line-height-tight: 1.2;       /* Headings */
--line-height-normal: 1.5;      /* Body text */
--line-height-relaxed: 1.6;     /* Comfortable reading */
--line-height-loose: 2;         /* Spacious text */
```

### Typography Classes
```css
.h1 { font-size: 48px; font-weight: 700; line-height: 1.2; }
.h2 { font-size: 32px; font-weight: 600; line-height: 1.3; }
.h3 { font-size: 28px; font-weight: 600; line-height: 1.3; }
.h4 { font-size: 22px; font-weight: 600; line-height: 1.4; }
.body-lg { font-size: 18px; line-height: 1.6; }
.body { font-size: 16px; line-height: 1.6; }
.body-sm { font-size: 14px; line-height: 1.5; }
.caption { font-size: 12px; line-height: 1.4; }
```

---

## 📏 Spacing System

### Base Unit: 4px

```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Component Spacing
- **Card Padding**: 24px (mobile), 32px (desktop)
- **Section Padding**: 40px (mobile), 60px (tablet), 80px (desktop)
- **Gap Between Items**: 16px (small), 24px (medium), 32px (large)

---

## 🎯 Border Radius

```css
--radius-sm: 4px;               /* Small elements */
--radius-base: 8px;             /* Buttons, inputs */
--radius-md: 12px;              /* Cards */
--radius-lg: 16px;              /* Large cards */
--radius-xl: 20px;              /* Hero sections */
--radius-2xl: 24px;             /* Modal dialogs */
--radius-full: 9999px;          /* Pills, badges, avatars */
```

---

## 🌑 Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-base: 0 4px 8px rgba(0, 0, 0, 0.1);
--shadow-md: 0 8px 16px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.2);
--shadow-2xl: 0 30px 60px rgba(0, 163, 157, 0.15);
```

---

## 📐 Layout & Grid

### Container Widths
```css
--container-xs: 480px;
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1200px;
--container-2xl: 1440px;
```

### Dashboard Layout
```css
--sidebar-width: 312px;         /* Fixed sidebar width */
--topbar-height: 80px;          /* Header height */
--content-max-width: 1348px;    /* Main content area */
```

### Grid Columns
```css
--grid-cols-1: 1;
--grid-cols-2: 2;
--grid-cols-3: 3;
--grid-cols-4: 4;
--grid-cols-6: 6;
--grid-cols-12: 12;
```

---

## 📱 Responsive Breakpoints

```css
--breakpoint-xs: 480px;         /* Small mobile */
--breakpoint-sm: 640px;         /* Mobile */
--breakpoint-md: 768px;         /* Tablet */
--breakpoint-lg: 1024px;        /* Desktop */
--breakpoint-xl: 1280px;        /* Large desktop */
--breakpoint-2xl: 1440px;       /* Extra large */
```

### Media Query Usage
```css
/* Mobile First Approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

---

## 🎭 Z-Index Layers

```css
--z-background: -1;
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-fixed: 30;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-popover: 60;
--z-tooltip: 70;
```

---

## ⚡ Transitions & Animations

```css
--transition-fast: 150ms ease;
--transition-base: 300ms ease;
--transition-slow: 500ms ease;
--transition-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## 🧩 Component Patterns

### Button Sizes
```css
--btn-height-sm: 32px;
--btn-height-base: 40px;
--btn-height-lg: 48px;
--btn-padding-x-sm: 12px;
--btn-padding-x-base: 20px;
--btn-padding-x-lg: 32px;
```

### Input Sizes
```css
--input-height-sm: 32px;
--input-height-base: 40px;
--input-height-lg: 48px;
--input-padding-x: 16px;
--input-border-width: 2px;
```

### Card Specifications
```css
--card-padding: 24px;
--card-radius: 12px;
--card-shadow: var(--shadow-base);
--card-border: 1px solid var(--gray-100);
```

---

## 🎨 Component Color Schemes

### Navigation
```css
--nav-bg: #FFFFFF;
--nav-text: var(--primary-teal);
--nav-text-hover: var(--success);
--nav-active-bg: var(--bg-teal-light);
--nav-active-text: var(--primary-teal);
```

### Sidebar
```css
--sidebar-bg: #FFFFFF;
--sidebar-border: var(--gray-100);
--sidebar-item-hover: var(--gray-50);
--sidebar-item-active: var(--primary-teal);
--sidebar-icon: var(--gray-500);
```

### Dashboard Cards
```css
--card-bg: #FFFFFF;
--card-border: var(--gray-100);
--card-header-text: var(--text-primary);
--card-value-text: var(--primary-teal);
--card-meta-text: var(--text-secondary);
```

---

## 📊 Data Visualization Colors

### Chart Colors
```css
--chart-primary: #00A39D;       /* Desktop */
--chart-secondary: #1E3A5F;     /* Mobile */
--chart-tertiary: #F39C12;      /* Tablet */
--chart-quaternary: #E74C3C;    /* Unknown */
--chart-success: #04C8BC;
--chart-warning: #F9BD50;
```

---

## ♿ Accessibility

### Focus States
```css
--focus-ring: 0 0 0 3px rgba(0, 163, 157, 0.3);
--focus-ring-offset: 2px;
```

### Contrast Ratios
- **Normal Text**: Minimum 4.5:1
- **Large Text**: Minimum 3:1
- **Interactive Elements**: Minimum 3:1

---

## 📦 Component Library

### Available Components
1. **Navigation**
   - Sidebar
   - Top Bar
   - Mobile Menu

2. **Data Display**
   - Statistics Cards
   - Data Tables
   - Charts (Donut, Line, Bar)

3. **Forms**
   - Inputs
   - Dropdowns
   - Checkboxes
   - Buttons

4. **Feedback**
   - Badges
   - Notifications
   - Tooltips
   - Loading States

5. **Layout**
   - Container
   - Grid
   - Flex
   - Card

---

## 🔄 Design Tokens Usage

### CSS Variables Implementation
All design tokens are available as CSS custom properties:

```css
:root {
  /* Colors */
  --primary: var(--primary-teal);
  --secondary: var(--secondary-orange);
  
  /* Typography */
  --font-body: var(--font-family-primary);
  
  /* Spacing */
  --spacing-unit: 4px;
  
  /* Layout */
  --container-width: var(--container-xl);
}
```

---

## 📚 Resources

- **Figma Design**: [BSI-UC-Project](https://www.figma.com/design/CEkrskj1KeNmhHfC6Wro42/)
- **Font**: [Google Fonts - Lato](https://fonts.google.com/specimen/Lato)
- **Icons**: Font Awesome 6.4.0
- **Charts**: Chart.js 4.x

---

*This design system ensures consistency across all pages and components of the BSI UMKM Center platform.*
