const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const readline = require('readline');
const { URL } = require('url');

// Simple .env parser
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2 && !line.trim().startsWith('#')) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
        console.log('Loaded environment variables from .env');
    } else {
        console.log('No .env file found, using process environment variables');
    }
}

async function migrate() {
    loadEnv();

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
            connectionConfig.database = dbUrl.pathname.substring(1); // remove leading /
            console.log('Parsed connection details from DATABASE_URL');
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

    console.log(`Using database host: ${connectionConfig.host}`);

    // To run CREATE DATABASE, we should initially allow connecting without a specific DB
    // or connect to a default one if possible. 
    // detailed setup comes from the SQL file.

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'full-setup.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');

    // Check database name match
    const targetDbName = connectionConfig.database;

    // Basic replacement if the user wants to use a different DB name than 'betadrop'
    // The SQL file hardcodes `betadrop`. We should replace it if DB_NAME is different.
    if (targetDbName !== 'betadrop') {
        console.log(`Replacing 'betadrop' with '${targetDbName}' in SQL script...`);
        sql = sql.replace(/betadrop/g, targetDbName);
    }

    // Warning
    console.log('\n⚠️  WARNING: This script will execute the following SQL file:');
    console.log(sqlPath);
    console.log('\nThis typically includes DROP DATABASE commands which will DESTROY ALL DATA.');
    console.log(`Target Database Name: ${targetDbName}`);
    console.log(`Target Host: ${connectionConfig.host}\n`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const skipPrompt = process.argv.includes('--yes') || process.argv.includes('-y');

    if (skipPrompt) {
        console.log('Skipping confirmation prompt due to --yes flag.');
        await runMigration(rl, connectionConfig, sql);
    } else {
        rl.question('Are you sure you want to proceed? Type "yes" to continue: ', async (answer) => {
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
        // Connect specifically to the DB if we can, but full-setup drops the DB.
        // If we connect to 'betadrop' and then DROP it, the connection might be killed.
        // Better to connect with no database selected, or just connect to sys/mysql.
        // However, on many providers we only have access to our specific DB.
        // The full-setup.sql has:
        // DROP DATABASE IF EXISTS betadrop;
        // CREATE DATABASE betadrop ...;
        // USE betadrop;

        // If we are on a hosted DB where we can't create databases, we should remove the CREATE DATABASE part
        // and just use the existing one.
        // But typically "setup" scripts assume full control.

        // We'll try to connect without a database first to execute the drop/create.
        const { database, ...serverConfig } = connectionConfig;

        console.log('Connecting to database server...');
        let connection;

        try {
            // Try connecting without selecting a DB to allow DROP/CREATE
            connection = await mysql.createConnection(serverConfig);
        } catch (err) {
            // If that fails (e.g. user only has access to specific DB), connect with DB
            console.log('Could not connect to root. Connecting to specific database...');
            connection = await mysql.createConnection(connectionConfig);
        }

        console.log('Connected. Running schema script...');

        // Execute the SQL
        await connection.query(sql);

        console.log('✅ Migration completed successfully!');

        await connection.end();
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        rl.close();
        process.exit(0);
    }
}

migrate();
