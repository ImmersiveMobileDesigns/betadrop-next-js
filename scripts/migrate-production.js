/**
 * Safe Migration Script for Production
 * Only adds new tables/columns without dropping existing data
 * 
 * Usage:
 *   node scripts/migrate-production.js
 *   node scripts/migrate-production.js --yes  (skip confirmation)
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const readline = require('readline');
const { URL } = require('url');

// Simple .env parser
function loadEnv(envFile = '.env') {
    const envPath = path.resolve(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2 && !line.trim().startsWith('#')) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
        console.log(`✓ Loaded environment variables from ${envFile}`);
    } else {
        console.log(`No ${envFile} file found, using process environment variables`);
    }
}

async function migrate() {
    // Check for production env file
    if (fs.existsSync('.env.production')) {
        loadEnv('.env.production');
    } else {
        loadEnv('.env');
    }

    // Database config
    let connectionConfig = {
        multipleStatements: true,
    };

    if (process.env.DATABASE_URL) {
        try {
            const dbUrl = new URL(process.env.DATABASE_URL);
            connectionConfig.host = dbUrl.hostname;
            connectionConfig.port = dbUrl.port || 3306;
            connectionConfig.user = dbUrl.username;
            connectionConfig.password = dbUrl.password;
            connectionConfig.database = dbUrl.pathname.substring(1);
            console.log('✓ Parsed connection details from DATABASE_URL');
        } catch (e) {
            console.error('Failed to parse DATABASE_URL:', e.message);
            process.exit(1);
        }
    } else {
        connectionConfig.host = process.env.DB_HOST || 'localhost';
        connectionConfig.user = process.env.DB_USER || 'root';
        connectionConfig.password = process.env.DB_PASSWORD || '';
        connectionConfig.port = process.env.DB_PORT || 3306;
        connectionConfig.database = process.env.DB_NAME || 'betadrop';
    }

    console.log(`\n📡 Target Database: ${connectionConfig.database}`);
    console.log(`📡 Target Host: ${connectionConfig.host}`);

    // Read the sync-production SQL file (safe migrations only)
    const sqlPath = path.join(__dirname, 'sync-production.sql');

    if (!fs.existsSync(sqlPath)) {
        console.error('❌ sync-production.sql not found!');
        process.exit(1);
    }

    let sql = fs.readFileSync(sqlPath, 'utf8');

    // Replace database name if different
    const targetDbName = connectionConfig.database;
    if (targetDbName !== 'betadrop') {
        console.log(`Replacing 'betadrop' with '${targetDbName}' in SQL script...`);
        sql = sql.replace(/USE betadrop;/g, `USE ${targetDbName};`);
    }

    console.log('\n🔄 This script will safely add new tables and columns.');
    console.log('   Existing data will NOT be deleted.\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const skipPrompt = process.argv.includes('--yes') || process.argv.includes('-y');

    if (skipPrompt) {
        console.log('Skipping confirmation due to --yes flag.');
        await runMigration(rl, connectionConfig, sql);
    } else {
        rl.question('Proceed with migration? (yes/no): ', async (answer) => {
            if (answer.trim().toLowerCase() !== 'yes') {
                console.log('Migration cancelled.');
                rl.close();
                process.exit(0);
            }
            await runMigration(rl, connectionConfig, sql);
        });
    }
}

async function runMigration(rl, connectionConfig, sql) {
    try {
        console.log('\n🔌 Connecting to database...');
        const connection = await mysql.createConnection(connectionConfig);
        console.log('✓ Connected successfully!\n');

        console.log('🚀 Running migration...');

        // Split by semicolon and run each statement separately
        // This allows us to continue even if one statement fails (e.g., column already exists)
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        let successCount = 0;
        let errorCount = 0;

        for (const statement of statements) {
            try {
                await connection.query(statement);
                successCount++;
            } catch (err) {
                // Ignore "Duplicate column" or "Table already exists" errors
                if (err.code === 'ER_DUP_FIELDNAME' ||
                    err.code === 'ER_TABLE_EXISTS_ERROR' ||
                    err.message.includes('Duplicate column') ||
                    err.message.includes('already exists')) {
                    console.log(`  ⏭️  Skipped (already exists): ${statement.substring(0, 60)}...`);
                } else {
                    console.error(`  ❌ Error: ${err.message}`);
                    errorCount++;
                }
            }
        }

        console.log(`\n✅ Migration completed!`);
        console.log(`   ${successCount} statements executed successfully`);
        if (errorCount > 0) {
            console.log(`   ${errorCount} errors (see above)`);
        }

        await connection.end();
    } catch (err) {
        console.error('\n❌ Migration failed:', err.message);
    } finally {
        rl.close();
        process.exit(0);
    }
}

migrate();
