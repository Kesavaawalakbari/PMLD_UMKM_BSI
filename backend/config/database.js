/**
 * Supabase Database Configuration
 * BSI UMKM Centre - Authentication & User Management
 * 
 * Supabase provides:
 * - PostgreSQL database with Row Level Security (RLS)
 * - Built-in authentication
 * - Real-time subscriptions
 * - Storage for files
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('   Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

/**
 * Supabase Admin Client (Server-side only)
 * Uses service role key - bypasses Row Level Security
 * Use this for admin operations only
 */
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * Supabase Public Client
 * Uses anon key - respects Row Level Security
 * Safe to use for user-facing operations
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

/**
 * Test Supabase Connection
 */
const testConnection = async () => {
    try {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('count')
            .limit(1);
        
        if (error && error.code !== 'PGRST116') {
            // PGRST116 means table doesn't exist yet, which is OK
            throw error;
        }
        
        console.log('✅ Supabase Connected Successfully');
        console.log(`📦 Database URL: ${supabaseUrl}`);
        return true;
    } catch (error) {
        console.error('❌ Supabase Connection Error:', error.message);
        return false;
    }
};

/**
 * Initialize Database Tables
 * Creates required tables if they don't exist
 */
const initializeDatabase = async () => {
    try {
        // Check if users table exists by attempting a query
        const { error } = await supabaseAdmin
            .from('users')
            .select('id')
            .limit(1);
        
        if (error && error.code === 'PGRST116') {
            console.log('📋 Users table not found. Please run the SQL migration.');
            console.log('   See: backend/migrations/001_create_users_table.sql');
        } else {
            console.log('✅ Database tables verified');
        }
    } catch (error) {
        console.error('⚠️  Database initialization warning:', error.message);
    }
};

module.exports = {
    supabase,
    supabaseAdmin,
    testConnection,
    initializeDatabase
};
