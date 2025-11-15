# PMLD BSI UMKM Dashboard

A React + TypeScript admin dashboard for managing UMKM (Usaha Mikro, Kecil, dan Menengah) operations with BSI Bank integration.

## Features

- **Dashboard**: Overview of key metrics and statistics
- **Product Management**: Add, edit, and manage UMKM products
- **Finance Management**: Track financial transactions and disbursements
- **UMKM Management**: Manage UMKM businesses and applications
- **User Management**: Manage users with sub-pages for:
  - Sales (Penjualan)
  - Orders (Pesanan)
  - Shipping (Pengiriman)
  - User List
- **Settings**: Application configuration
- **Help (Bantuan)**: User assistance and documentation

## Tech Stack

- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool and dev server
- **Tailwind CSS** (via CDN) - Styling

## Project Structure

```
├── App.tsx                 # Main application component
├── index.tsx              # Application entry point
├── index.html             # HTML template
├── components/            # Reusable components
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── DonutChart.tsx
│   ├── ErrorBoundary.tsx
│   ├── ToggleSwitch.tsx
│   ├── icons/
│   └── modals/
├── pages/                 # Page components
│   ├── Dashboard.tsx
│   ├── ManageProducts.tsx
│   ├── ManageFinance.tsx
│   ├── ManageUmkm.tsx
│   ├── ManageUsers.tsx
│   ├── Settings.tsx
│   ├── Bantuan.tsx
│   └── user/             # User management sub-pages
├── context/              # React context providers
│   └── ToastContext.tsx
├── assets/               # Static assets
│   ├── Shapes.tsx
│   └── img/
├── types.ts              # TypeScript type definitions
└── vite.config.ts        # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kesavaawalakbari/PMLD_UMKM_BSI.git
cd PMLD_UMKM_BSI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Development

- The app uses React 18 with TypeScript for type safety
- Vite provides fast HMR (Hot Module Replacement) during development
- Tailwind CSS is loaded via CDN for rapid styling
- Toast notifications are managed through React Context
- Error boundaries catch and display runtime errors

## Contributing

1. Create a feature branch from `master`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Add your license here]

## Contact

For questions or support, please contact the development team.
