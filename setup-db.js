/**
 * Setup script for Supabase database tables
 * 
 * Usage:
 * 1. Make sure you have the Supabase CLI installed
 * 2. Run: node setup-db.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Supabase database tables...');

// Check if Supabase CLI is installed
exec('supabase --version', (error) => {
    if (error) {
        console.error('❌ Supabase CLI not found. Please install it first:');
        console.error('npm install -g @supabase/cli');
        process.exit(1);
    }

    // Check if migrations directory exists
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
        console.error('❌ Migrations directory not found:', migrationsDir);
        console.error('Please make sure it exists and contains your SQL files.');
        process.exit(1);
    }

    // Run all migrations
    console.log('⏳ Running migrations...');
    exec('supabase db push', (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error running migrations:', error.message);
            console.error(stderr);
            process.exit(1);
        }

        console.log(stdout);
        console.log('✅ Database setup complete!');
        console.log('');
        console.log('You can now run the application:');
        console.log('npm run dev');
    });
}); 