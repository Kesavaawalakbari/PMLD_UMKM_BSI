-- ============================================
-- BSI UMKM Centre - Supabase Database Schema
-- Migration: 001_create_users_table.sql
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- Stores user profile information
-- Linked to Supabase Auth
-- ============================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed password for custom auth validation
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Service role can do everything (for backend)
CREATE POLICY "Service role has full access"
ON public.users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- TRIGGER: Update updated_at on changes
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- UMKM TABLE (for future use)
-- Stores UMKM business information
-- ============================================

CREATE TABLE IF NOT EXISTS public.umkm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nama_usaha VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    kategori VARCHAR(100),
    alamat TEXT,
    kota VARCHAR(100),
    provinsi VARCHAR(100),
    kode_pos VARCHAR(10),
    telepon VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    banner_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on umkm table
ALTER TABLE public.umkm ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active UMKM
CREATE POLICY "Anyone can view active UMKM"
ON public.umkm FOR SELECT
USING (status = 'active');

-- Policy: Users can manage their own UMKM
CREATE POLICY "Users can manage their own UMKM"
ON public.umkm FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for umkm updated_at
CREATE TRIGGER update_umkm_updated_at
    BEFORE UPDATE ON public.umkm
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PRODUCTS TABLE (optional - can use WooCommerce)
-- Local product cache for faster queries
-- ============================================

CREATE TABLE IF NOT EXISTS public.products_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    woocommerce_id INTEGER UNIQUE,
    umkm_id UUID REFERENCES public.umkm(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(15, 2),
    harga_diskon DECIMAL(15, 2),
    stok INTEGER DEFAULT 0,
    kategori VARCHAR(100),
    gambar_urls JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'publish', 'private')),
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published products
CREATE POLICY "Anyone can view published products"
ON public.products_cache FOR SELECT
USING (status = 'publish');

-- Create trigger
CREATE TRIGGER update_products_cache_updated_at
    BEFORE UPDATE ON public.products_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ORDERS TABLE (synced with WooCommerce)
-- ============================================

CREATE TABLE IF NOT EXISTS public.orders_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    woocommerce_id INTEGER UNIQUE,
    user_id UUID REFERENCES public.users(id),
    umkm_id UUID REFERENCES public.umkm(id),
    order_number VARCHAR(50),
    status VARCHAR(50),
    total DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'IDR',
    items JSONB DEFAULT '[]',
    shipping_address JSONB,
    billing_address JSONB,
    payment_method VARCHAR(100),
    notes TEXT,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders_cache FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create trigger
CREATE TRIGGER update_orders_cache_updated_at
    BEFORE UPDATE ON public.orders_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS / SUCCESS
-- ============================================

COMMENT ON TABLE public.users IS 'User profiles linked to Supabase Auth';
COMMENT ON TABLE public.umkm IS 'UMKM business profiles';
COMMENT ON TABLE public.products_cache IS 'Local cache of WooCommerce products';
COMMENT ON TABLE public.orders_cache IS 'Local cache of WooCommerce orders';

-- Done!
SELECT 'Migration 001_create_users_table completed successfully!' as status;
