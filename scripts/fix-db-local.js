const mysql = require('mysql2/promise');

async function main() {
    console.log('Attempting to connect to database...');
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'imd-betadrop',
            password: 'JqgzFA61QCaw734RLVEA',
            database: 'betadrop',
            port: 3306,
            // Attempt to handle sha256_password if possible without SSL by allowing clear text if server permits, 
            // or just hope mysql2 handles it better than the shell.
        });

        console.log('Connected successfully!');

        // 1. Fix NULL values for the required column
        console.log('Fixing NULL values in builds table...');
        try {
            const [result] = await connection.execute("UPDATE builds SET custom_theme_mode = 'dark' WHERE custom_theme_mode IS NULL");
            console.log(`Updated ${result.affectedRows} rows in 'builds' table.`);
        } catch (e) {
            console.error('Error updating NULLs:', e.message);
        }

        // 2. Update Authentication Plugin
        console.log('Updating authentication plugin to mysql_native_password...');
        try {
            await connection.execute("ALTER USER 'imd-betadrop'@'localhost' IDENTIFIED WITH mysql_native_password BY 'JqgzFA61QCaw734RLVEA'");
            await connection.execute("FLUSH PRIVILEGES");
            console.log('Authentication plugin updated successfully.');
        } catch (e) {
            console.error('Error updating auth plugin:', e.message);
        }

        await connection.end();
        console.log('Done.');

    } catch (err) {
        console.error('Connection failed:', err.message);
        console.log('\nPotential Solution: You may need to reset your MySQL root password or create a new user compatible with native_password if this script cannot connect.');
    }
}

main();
